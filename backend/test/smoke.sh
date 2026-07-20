#!/usr/bin/env bash
# End-to-end smoke test against the mock Ollama server (no GPU needed):
# ingests the real docs, starts the API, and checks auth, retrieval,
# off-topic redirection, and rate limiting.
set -euo pipefail
cd "$(dirname "$0")/.."

MOCK_PORT=11435
API_PORT=3999
BASE="http://127.0.0.1:$API_PORT"
KEY="smoke-test-key"

export OLLAMA_URL="http://127.0.0.1:$MOCK_PORT"
export CHATBOT_API_KEY="$KEY"
export VECTOR_STORE="test/tmp/vector-store.json"
export HOST=127.0.0.1
export PORT=$API_PORT
export RATE_LIMIT_MAX=3
export RATE_LIMIT_WINDOW_MS=60000
# The mock's bag-of-words vectors score lower than real embeddings; the
# threshold only needs to separate on-topic (~0.15+) from off-topic (~0.0).
export MIN_SIMILARITY=0.08

PIDS=()
cleanup() { kill "${PIDS[@]}" 2>/dev/null || true; }
trap cleanup EXIT

fail() { echo "FAIL: $1" >&2; exit 1; }

wait_for() { # url
  for _ in $(seq 1 50); do
    curl -sf "$1" >/dev/null 2>&1 && return 0
    sleep 0.2
  done
  fail "timed out waiting for $1"
}

rm -rf test/tmp && mkdir -p test/tmp

node test/mock-ollama.js --port $MOCK_PORT & PIDS+=($!)
wait_for "http://127.0.0.1:$MOCK_PORT/api/tags"

echo "--- ingest"
node ingest/ingest.js --out test/tmp/vector-store.json

node server.js & PIDS+=($!)
wait_for "$BASE/api/health"

echo "--- health"
curl -sf "$BASE/api/health" | grep -q '"ok":true' || fail "health check"

echo "--- auth: missing key -> 401"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -d '{"message":"hi"}')
[ "$code" = "401" ] || fail "expected 401 without key, got $code"

echo "--- auth: wrong key -> 401"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H 'X-API-Key: nope' -d '{"message":"hi"}')
[ "$code" = "401" ] || fail "expected 401 with bad key, got $code"

echo "--- CORS: disallowed origin -> 403"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H "X-API-Key: $KEY" \
  -H 'Origin: https://evil.example.com' -d '{"message":"hi"}')
[ "$code" = "403" ] || fail "expected 403 for bad origin, got $code"

echo "--- on-topic question -> answer with sources"
resp=$(curl -sf -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H "X-API-Key: $KEY" \
  -d '{"message":"Tell me about the lung cancer detection project"}')
echo "$resp" | grep -q '"answer"' || fail "no answer field: $resp"
echo "$resp" | grep -q '"offTopic":false' || fail "on-topic question flagged off-topic: $resp"
echo "$resp" | grep -qi 'lung' || fail "expected lung-cancer context in mock answer: $resp"

echo "--- off-topic question -> polite redirect, no LLM call"
resp=$(curl -sf -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H "X-API-Key: $KEY" \
  -d '{"message":"zzqx vvbn qqrr wwtt"}')
echo "$resp" | grep -q '"offTopic":true' || fail "gibberish not redirected: $resp"
echo "$resp" | grep -q 'MOCK ANSWER' && fail "off-topic question reached the LLM: $resp"

# Two authorized requests have counted so far; #3 is allowed, #4 must be cut off.
echo "--- rate limit: request #4 in window -> 429"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H "X-API-Key: $KEY" \
  -d '{"message":"What are Niket'"'"'s skills?"}')
[ "$code" = "200" ] || fail "expected request #3 to pass, got $code"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/chat" \
  -H 'Content-Type: application/json' -H "X-API-Key: $KEY" \
  -d '{"message":"What are Niket'"'"'s skills?"}')
[ "$code" = "429" ] || fail "expected 429 after limit, got $code"

echo
echo "PASS: all smoke checks passed"
