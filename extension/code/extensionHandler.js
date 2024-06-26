/**
 * Send to the UI the current "conversion" status
 */
function updateClient() {
    (chrome ?? browser).runtime.sendMessage((chrome ?? browser).runtime.id, { operation: scriptOptions.node.resolve && !scriptOptions.node.isResolveTime });
}
(chrome ?? browser).runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case "start": { // Start running the script
            scriptOptions = { ...scriptOptions, ...message.content }; // Add the values from the object provided
            const avoidNullishValues = new Map([ // If those values are null (Svelte might save them as null if nothing is provided), sign them as default
                ["scrolling_min_time", 1300],
                ["scrolling_max_time", 2100],
                ["min_views", -1]
            ]);
            for (let [key, value] of avoidNullishValues) if (scriptOptions[key] === null) scriptOptions[key] = value;
            if (scriptOptions.advanced.maximum_downloads === null) scriptOptions.advanced.maximum_downloads = Infinity;
            scriptOptions.node.isNode = true; // Mark this script as it is being used in Node via Puppeteer, so that a Promise will be made, resolved when it's time to download everything. While the download would start in any case, in this way we can also notify the extension UI that the conversion has ended.
            startDownload().then((arr) => {
                downloadScript(arr.join("\n"), true);
                updateClient();
            });
            updateClient();
            break;
        }
        case "partial": { // Download a part of the script
            const request = requestTxtNow();
            downloadScript(typeof request[0] === "string" ? request.join("\n") : JSON.stringify(request), true);
            break;
        }
        case "requestOperation": { // Ask if a conversion is being done or not.
            updateClient();
            break;
        }
    }
});
