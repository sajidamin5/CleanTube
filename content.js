// console.log("YouTube Exact Upload Date: script running.");

// Get exact upload date from meta tag
function getExactDate() {

    const meta = document.querySelector('meta[itemprop="datePublished"]');
    if (!meta) return null;

    const isoDate = meta.getAttribute("content");
    if (!isoDate) return null;

    const dateObj = new Date(isoDate);
    return dateObj.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Try replacing any date-looking element on the watch page
function replaceVisibleDate() {
    // add space to the end of formatted date string to give seperation from view count
    const formattedDate = getExactDate() + "                                          ";
    if (!formattedDate) {
        console.log("No formatted date found.");
        return false;
    }
    
    // grab all tokens from the document
    const tokens = document.querySelectorAll('yt-formatted-string, span'); 

    // iterate through all tokens hunting for date estimate
    // WARNING: THIS MAY GRAB COMMENTS AND TITLES AS WELL
    for (let token of tokens) {
        if (token.textContent.match(/\byear|\bmonth|\bweek|\bday|\bhour|\bminute/i)) {
            token.textContent = formattedDate;
            console.log("Updated upload date:", formattedDate, "in element:", token);
            return true;
        }
    }

    // console.log("No matching element to replace.");
    return false;
}

// Auto-run when the page loads
if (location.pathname.startsWith("/watch")) {
    const observer = new MutationObserver(() => {
        if (replaceVisibleDate()) {
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

// ==============================
// Hide Shorts on YouTube Home
// ==============================

function hideShorts() {
    // 1. Remove full "Shorts" shelves
    const shortsShelves = document.querySelectorAll(
        'ytd-rich-section-renderer'
    );

    shortsShelves.forEach(shelf => {
        const title = shelf.querySelector('#title');
        if (title && title.textContent.trim().toLowerCase() === 'shorts') {
            shelf.remove();
            console.log("Removed Shorts shelf");
        }
    });

    // 2. Remove individual Shorts tiles
    const videoLinks = document.querySelectorAll('a[href^="/shorts/"]');

    videoLinks.forEach(link => {
        const tile = link.closest('ytd-rich-item-renderer');
        if (tile) {
            tile.remove();
            console.log("Removed Shorts tile");
        }
    });
}

// Run only on the homepage
if (location.pathname === "/") {
    const shortsObserver = new MutationObserver(() => {
        hideShorts();
    });

    shortsObserver.observe(document, {
        childList: true,
        subtree: true
    });

    // Run once immediately in case content is already there
    hideShorts();
}

function hideWatchPageShorts() {
    const shortsShelves = document.querySelectorAll(
        'yt-horizontal-list-renderer'
    );

    shortsShelves.forEach(shelf => {
        const title = shelf.querySelector('#title');
        if (title && title.textContent.trim().toLowerCase() === 'shorts') {
            shelf.remove();
            console.log("Removed Shorts shelf");
        }
    });

    // 2. Remove individual Shorts tiles
    const videoLinks = document.querySelectorAll('a[href^="/shorts/"]');

    videoLinks.forEach(link => {
        const tile = link.closest('yt-horizontal-list-renderer');
        if (tile) {
            tile.remove();
            console.log("Removed Shorts tile");
        }
    });
}

// Run on watch pages
if (location.pathname.startsWith("/watch")) {
    const watchShortsObserver = new MutationObserver(() => {
        hideWatchPageShorts();
    });

    watchShortsObserver.observe(document, {
        childList: true,
        subtree: true
    });

    // Run once immediately
    hideWatchPageShorts();
}


// document.addEventListener(
//     "click",
//     function () {
//         console.log("Click detected. Running function...");
//         updateUploadDate();
//     },
//     { once: true } // Only runs the first click after page load
// );
