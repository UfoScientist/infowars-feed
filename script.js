async function loadRSS() {
    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://www.infowars.com/rss.xml`);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const channelTitle = xml.querySelector("channel > title").textContent;
        const channelDesc = xml.querySelector("channel > description").textContent;
        const channelLink = xml.querySelector("channel > link").textContent;

        let headerHTML = `
            <div class="rss-header">
                <h2><a href="${channelLink}" target="_blank">${channelTitle}</a></h2>
                <p>${channelDesc}</p>
            </div>
        `;

        const items = xml.querySelectorAll("item");

        let html = '';
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "No Title";
            const link = item.querySelector("link")?.textContent || "#";
            const description = item.querySelector("description")?.textContent || "No Description";
            const pubDate = item.querySelector("pubDate")?.textContent || "";

            html += `
            <div class="rss-item">
                <h3><a href="${link}" target="_blank">${title}</a></h3>
                <p class="rss-date">
                    ${pubDate ? new Date(new Date(pubDate).getTime() + (6 * 60 * 60 * 1000)).toLocaleString() : "No Date"}
                </p>
                <p>${description}</p>
            </div>
            `;
        }

        document.getElementById("rss-feed").innerHTML = headerHTML + html;
    } catch (error) {
        console.error("Error loading RSS feed:", error);
        document.getElementById("rss-feed").innerHTML = "<p>Failed to load RSS feed.</p>";
    }
}

// Run on page load
loadRSS();

// Auto-refresh every 5 minutes
setInterval(loadRSS, 5 * 60 * 1000);
