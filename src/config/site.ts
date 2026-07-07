/**
 * Site-wide editable constants.
 *
 * ABOUT_VIDEO_ID — YouTube video ID for the About Me page.
 * The video isn't recorded yet: leave as "PLACEHOLDER" to show the
 * "coming soon" state. When the video is up, replace with the real ID
 * (the part after `watch?v=`), e.g. "dQw4w9WgXcQ" — no code changes needed.
 */
export const ABOUT_VIDEO_ID = "PLACEHOLDER";

/**
 * DOOM_EMBED_URL — browser-playable DOOM used on /doom.
 * Internet Archive's embed of the original 1993 shareware episode
 * (DOOM1.WAD, freely redistributable), running on Em-DOSBox (DOSBox
 * compiled to WebAssembly). The /embed/ path is purpose-built for
 * third-party iframes (no frame-ancestors restrictions).
 */
export const DOOM_EMBED_URL = "https://archive.org/embed/DoomsharewareEpisode";
