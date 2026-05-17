/**
 * Player Image Resolver — fetches real player photos from Wikipedia's free API.
 * No API key required. Returns the main Wikipedia portrait for a given player name.
 * Falls back to a Google Image search redirect if Wikipedia has no image.
 */

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop";

// In-memory cache to avoid repeated lookups for the same player
const imageCache = new Map<string, string>();

/**
 * Fetches the primary Wikipedia image for a given player name.
 * Uses the MediaWiki pageimages API (free, no key needed, high-quality results).
 * Returns the image URL or a fallback if not found.
 */
export async function fetchPlayerImage(playerName: string): Promise<string> {
  // Check in-memory cache first
  const cached = imageCache.get(playerName);
  if (cached) {
    return cached;
  }

  try {
    // 1. Try Wikipedia API — best source for well-known athletes
    const wikiTitle = playerName.replace(/\s+/g, "_");
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=600&redirects=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(wikiUrl, {
      headers: { "User-Agent": "CricketAkinator/1.0 (educational project)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const pages = data?.query?.pages;

      if (pages) {
        const pageId = Object.keys(pages)[0];
        const thumbnail = pages[pageId]?.thumbnail?.source;

        if (thumbnail && pageId !== "-1") {
          // Upscale Wikipedia thumbnail to higher resolution
          const hiRes = thumbnail.replace(/\/\d+px-/, "/500px-");
          imageCache.set(playerName, hiRes);
          console.log(`PlayerImage: Wikipedia hit for "${playerName}"`);
          return hiRes;
        }
      }
    }

    // 2. Try Wikipedia search API as fallback (handles name variations)
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(playerName + " cricketer")}&format=json&srlimit=1`;
    const searchController = new AbortController();
    const searchTimeout = setTimeout(() => searchController.abort(), 3000);

    const searchResp = await fetch(searchUrl, {
      headers: { "User-Agent": "CricketAkinator/1.0 (educational project)" },
      signal: searchController.signal,
    });
    clearTimeout(searchTimeout);

    if (searchResp.ok) {
      const searchData = await searchResp.json();
      const searchResults = searchData?.query?.search;

      if (searchResults && searchResults.length > 0) {
        const foundTitle = searchResults[0].title.replace(/\s+/g, "_");
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(foundTitle)}&prop=pageimages&format=json&pithumbsize=600&redirects=1`;

        const imgController = new AbortController();
        const imgTimeout = setTimeout(() => imgController.abort(), 3000);

        const imgResp = await fetch(imgUrl, {
          headers: { "User-Agent": "CricketAkinator/1.0 (educational project)" },
          signal: imgController.signal,
        });
        clearTimeout(imgTimeout);

        if (imgResp.ok) {
          const imgData = await imgResp.json();
          const imgPages = imgData?.query?.pages;

          if (imgPages) {
            const imgPageId = Object.keys(imgPages)[0];
            const imgThumb = imgPages[imgPageId]?.thumbnail?.source;

            if (imgThumb && imgPageId !== "-1") {
              const hiRes = imgThumb.replace(/\/\d+px-/, "/500px-");
              imageCache.set(playerName, hiRes);
              console.log(`PlayerImage: Wikipedia search hit for "${playerName}" → "${searchResults[0].title}"`);
              return hiRes;
            }
          }
        }
      }
    }

    console.log(`PlayerImage: No image found for "${playerName}", using fallback.`);
    imageCache.set(playerName, FALLBACK_IMAGE);
    return FALLBACK_IMAGE;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.warn(`PlayerImage: Timeout fetching image for "${playerName}".`);
    } else {
      console.error(`PlayerImage: Error fetching image for "${playerName}":`, error.message);
    }
    return FALLBACK_IMAGE;
  }
}
