// Using var so that the script can be re-used also in WebKit & Gecko
var scriptOptions = {
    scrolling_min_time: 1300, // Change the mininum time the script will try to refresh the page
    scrolling_max_time: 2100, // Change the maxinum time the script will try to refresh the page
    min_views: -1, // If a video has fewer views than this, it won't be included in the script.
    delete_from_next_txt: true, // Delete all the items put in the previous .txt file when asking for a new one. Useful only if you want to obtain a .txt file while scrolling.
    output_name_type: 2, // Put a string to specify a specific name of the file. Put 0 for trying to fetching it using data tags, 1 for fetching it from the window title, 2 for fetching it from the first "h1" element. _Invalid_ inputs will use the standard "TikTokLinks.txt". This will be edited if a different value is passed from the startDownload() function.
    adapt_text_output: true, // Replace characters that are prohibited on Windows
    allow_images: true, // Save also TikTok Image URLs
    export_format: "txt", // Put "json" to save everything as a JSON file.
    advanced: {
        get_array_after_scroll: false, // Gets the item links after the webpage is fully scrolled, and not after every scroll.
        get_link_by_filter: true, // Get the website link by inspecting all the links in the container div, instead of looking for data references.
        check_nullish_link: true, // Check if a link is nullish and, if true, try with the next video.
        log_link_error: true, // Write in the console if there's an error when fetching the link.
        maximum_downloads: Infinity // Change this to a finite number to fetch only a specific number of values. Note that a) more elements might be added to the final file if available; and b) "get_array_after_scroll" must be set to false.
    },
    node: {
        resolve: null,
        isNode: false,
        isResolveTime: false
    }
}
function nodeElaborateCustomArgs(customTypes) { // A function that is able to read a double array, composed with [["the property name", "the property value"]], and change the value of the scriptOptions array
    if ((customTypes ?? "") !== "") { // If the provided value isn't nullish
        customTypes.forEach(e => { // Get each value
            var optionChange = e[0].split("=>"); // The arrow (=>) is used to indicate that the property is in a nested object (ex: advanced=>log_link_error).
            optionChange.length === 1 ? scriptOptions[e[0]] = e[1] : scriptOptions[optionChange[0]][optionChange[1]] = e[1]; // If the length is 1, just change the option. Otherwise, look for the nested object and change its value
        });
    }
}
// SCRIPT START:
var height = document.body.scrollHeight;
var containerSets = new Map([]);
var skipLinks = []; // Array: [Video link to skip]
function loadWebpage() {
    if (document.querySelectorAll(".tiktok-qmnyxf-SvgContainer").length === 0) { // Checks if the SVG loading animation is present in the DOM
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to the bottom of the page
        setTimeout(() => {
            if (height !== document.body.scrollHeight) { // The webpage has scrolled the previous time, so we can try another scroll
                if (!scriptOptions.advanced.get_array_after_scroll) {
                    addArray();
                    if (scriptOptions.advanced.maximum_downloads < (Array.from(containerSets).length + skipLinks.length)) { // If the number of fetched items is above the permitted one, download the script and don't do anything.
                        ytDlpScript();
                        return;
                    }
                }
                setTimeout(() => {
                    height = document.body.scrollHeight;
                    loadWebpage();
                }, Math.floor(Math.random() * scriptOptions.scrolling_max_time + scriptOptions.scrolling_min_time));
            } else { // 
                setTimeout(() => {
                    if (document.querySelectorAll(".tiktok-qmnyxf-SvgContainer").length === 0 && height == document.body.scrollHeight) { // By scrolling, the webpage height doesn't change, so let's download the txt file
                        scriptOptions.node.isResolveTime = true;
                        ytDlpScript();
                        skipLinks = []; // Restore so that the items can be re-downloaded
                    } else { // The SVG animation is still there, so there are other contents to load.
                        loadWebpage();
                    }
                }, 3500)
            }
        }, 150);
    } else { // Let's wait 1 second, so that TikTok has time to load content.
        setTimeout(function () {
            loadWebpage()
        }, 1000);
    }
}
function addArray() {
    var getClass = document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2, .css-x6y88p-DivItemContainerV2, .css-1soki6-DivItemContainerForSearch"); // Class of every video container
    for (var i = 0; i < getClass.length; i++) {
        // Simple information scraping: the link (getLink) is put in the first array, while the views (getViews) are put in the second one
        if (!getClass[i]) continue; // Skip nullish results
        var getLink = scriptOptions.advanced.get_link_by_filter ? Array.from(getClass[i].querySelectorAll("a")).filter(e => e.href.indexOf("/video/") !== -1 || e.href.indexOf("/photo/") !== -1)[0]?.href : getClass[i].querySelector("[data-e2e=user-post-item-desc], [data-e2e=user-liked-item], [data-e2e=music-item], [data-e2e=user-post-item], [data-e2e=favorites-item], [data-e2e=challenge-item], [data-e2e=search_top-item]")?.querySelector("a")?.href; // If the new filter method is selected, the script will look for the first link that contains a video link structure. Otherwise, the script'll look for data tags that contain the video URL.
        if (!scriptOptions.allow_images && getLink.indexOf("/photo/") !== -1) continue; // Avoid adding photo if the user doesn't want to.
        if (scriptOptions.advanced.check_nullish_link && (getLink ?? "") === "") { // If the script needs to check if the link is nullish, and it's nullish...
            if (scriptOptions.advanced.log_link_error) console.log("SCRIPT ERROR: Failed to get link!"); // If the user wants to print the error in the console, write it
            continue; // And, in general, continue with the next link.
        }
        if (skipLinks.indexOf(getLink) === -1) {
            var views = getClass[i].querySelector("[data-e2e=video-views]")?.innerHTML ?? "0";
            var caption = getClass[i].querySelector(".css-vi46v1-DivDesContainer a span")?.textContent;
            containerSets.set(getLink, { views: `${views.replace(".", "").replace("K", "00").replace("M", "00000")}${(views.indexOf("K") !== -1 || views.indexOf("M") !== -1) && views.indexOf(".") === -1 ? "0" : ""}`, caption })
        }
    }
}
function sanitizeName(name) { // Replace a name with allowed Windows characters.
    return name.replaceAll("<", "‹").replaceAll(">", "›").replaceAll(":", "∶").replaceAll("\"", "″").replaceAll("/", "∕").replaceAll("\\", "∖").replaceAll("|", "¦").replaceAll("?", "¿").replaceAll("*", "");
}
function ytDlpScript() {
    addArray(); // Add the last elements in the DOM, or all the elements if get_array_after_scroll is set to true.
    // Create the txt file with all of the TikTok links.
    var ytDlpScript = scriptOptions.export_format === "json" ? [] : "";
    for (var [url, obj] of Array.from(containerSets)) {
        if (+obj.views < scriptOptions.min_views) continue;
        scriptOptions.export_format === "json" ? ytDlpScript.push({ ...obj, url }) : ytDlpScript += `${url}\n`;
    }
    if (scriptOptions.node.isNode && !scriptOptions.node.isResolveTime) return getWhatToReturn(ytDlpScript); else downloadScript(typeof ytDlpScript === "object" ? JSON.stringify(ytDlpScript) : ytDlpScript); // If the user has requested from Node to get the array, get it
}
function getWhatToReturn(content) { // Get if a JSON object array should be returned, or if a splitted string.
    return typeof content === "object" ? content : content.split("\n");
}
function downloadScript(script, force) { // Download the script text to a file
    if (scriptOptions.node.isNode && !force) {
        if (scriptOptions.node.isResolveTime) scriptOptions.node.resolve(getWhatToReturn(script)); else return getWhatToReturn(script);
        scriptOptions.node.resolve = null;
        scriptOptions.node.isResolveTime = false;
        return;
    }
    var blob = new Blob([script], { type: "text/plain" }); // Create a blob with the text
    var link = document.createElement("a");
    var name = `TikTokLinks.${scriptOptions.export_format}`; // Set the standard name
    switch (scriptOptions.output_name_type) { // Look at the type of the name
        case 0: // Fetch name from data tags
            name = document.querySelector("[data-e2e=user-title]")?.textContent.trim() ?? document.querySelector("[data-e2e=browse-username]")?.firstChild?.textContent.trim() ?? document.querySelector("[data-e2e=browse-username]")?.textContent.trim() ?? document.querySelector("[data-e2e=challenge-title]")?.textContent.trim() ?? document.querySelector("[data-e2e=music-title]")?.textContent.trim() ?? `TikTokLinks.${scriptOptions.export_format}`;
            break;
        case 1: // Fetch name from the website title
            name = `${document.title.substring(0, document.title.indexOf(" | TikTok"))}.${scriptOptions.export_format}`;
            break;
        case 2: // Fetch name from the first "h1" element on the page
            name = `${document.querySelector("h1")?.textContent.trim() ?? "TikTokLinks"}.${scriptOptions.export_format}`;
            break;
    }
    if (typeof scriptOptions.output_name_type === "string") name = scriptOptions.output_name_type; // If it's a string, apply it to the output name
    if (scriptOptions.adapt_text_output) name = sanitizeName(name); // If the user wants to use safe characters only, adapt the string name.
    link.href = URL.createObjectURL(new File([blob], name, { type: "text/plain" }));
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
}
function requestTxtNow() {
    // Write requestTxtNow() in the console to obtain the .txt file while converting. Useful if you have lots of items, and you want to start downloading them.
    var value = ytDlpScript();
    if (scriptOptions.delete_from_next_txt) { // If delete_from_next_txt is enabled, delete the old items, so that only the newer ones will be downloaded.
        skipLinks.push(...Array.from(containerSets).map(item => item[0]));
        containerSets = new Map([]);
    }
    return value;
}
function startDownload(name) {
    if ((name ?? "") !== "") scriptOptions.output_name_type = name; // Update the file name type if it's provided a non-nullish value
    if (scriptOptions.node.isNode) {
        return new Promise((resolve) => {
            scriptOptions.node.resolve = resolve;
            loadWebpage();
        })
    } else loadWebpage(); // And start scrolling the webpage
}
nodeElaborateCustomArgs();
startDownload(); // Add as an argument a custom file name (or a custom file type value), or edit it from the scriptOptions.output_name_type
