// Using var so that the script can be re-used also in WebKit & Gecko
var scriptOptions = {
    scrolling_min_time: 1300, // Change the mininum time the script will try to refresh the page
    scrolling_max_time: 2100, // Change the maxinum time the script will try to refresh the page
    get_array_after_scroll: false, // Gets the item links after the webpage is fully scrolled, and not after every scroll.
    min_views: -1, // If a video has fewer views than this, it won't be included in the script.
    delete_from_next_txt: true, // Delete all the items put in the previous .txt file when asking for a new one. Useful only if you want to obtain a .txt file while scrolling.
    output_name_type: 2, // Put a string to specify a specific name of the file. Put 0 for trying to fetching it using data tags, 1 for fetching it from the window title, 2 for fetching it from the first "h1" element. _Invalid_ inputs will use the standard "TikTokLinks.txt". This will be edited if a different value is passed from the startDownload() function.
    adapt_text_output: true // Replace characters that are prohibited on Windows
}
// SCRIPT START:
var height = document.body.scrollHeight;
var containerSets = [[], []]; // Array: [[Video link], [Video views]]
var skipLinks = []; // Array: [Video link to skip]
function loadWebpage() {
    if (document.querySelectorAll(".tiktok-qmnyxf-SvgContainer").length === 0) { // Checks if the SVG loading animation is present in the DOM
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to the bottom of the page
        setTimeout(() => {
            if (height !== document.body.scrollHeight) { // The webpage has scrolled the previous time, so we can try another scroll
                if (!scriptOptions.get_array_after_scroll) addArray();
                setTimeout(() => {
                    height = document.body.scrollHeight;
                    loadWebpage();
                }, Math.floor(Math.random() * scriptOptions.scrolling_max_time + scriptOptions.scrolling_min_time));
            } else { // 
                setTimeout(() => {
                    if (document.querySelectorAll(".tiktok-qmnyxf-SvgContainer").length === 0 && height == document.body.scrollHeight) { // By scrolling, the webpage height doesn't change, so let's download the txt file
                        ytDlpScript();
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
    var getClass = document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2"); // Class of every video container
    for (var i = 0; i < getClass.length; i++) {
        // Simple information scraping: the link (getLink) is put in the first array, while the views (getViews) are put in the second one
        var getLink = (getClass[i].querySelector("[data-e2e=user-post-item-desc]") ?? getClass[i].querySelector("[data-e2e=user-liked-item]") ?? getClass[i].querySelector("[data-e2e=music-item]") ?? getClass[i].querySelector("[data-e2e=user-post-item]") ?? getClass[i].querySelector("[data-e2e=favorites-item]") ?? getClass[i].querySelector("[data-e2e=challenge-item]")).querySelector("a").href;
        if (containerSets[0].indexOf(getLink) === -1 && skipLinks.indexOf(getLink) === -1) {
            containerSets[0].push(getLink);
            containerSets[1].push(((getClass[i].querySelector("[data-e2e=video-views]"))?.innerHTML ?? "0").replace("K", "00").replace("M", "00000"));
        }
    }
}
function sanitizeName(name) {
    return name.replaceAll("<", "‹").replaceAll(">", "›").replaceAll(":", "∶").replaceAll("\"", "″").replaceAll("/", "∕").replaceAll("\\", "∖").replaceAll("|", "¦").replaceAll("?", "¿").replaceAll("*", "");
}
function ytDlpScript() {
    addArray(); // Add the last elements in the DOM, or all the elements if get_array_after_scroll is set to true.
    // Create the txt file with all of the TikTok links.
    var ytDlpScript = "";
    for (var x = 0; x < containerSets[0].length; x++) {
        if (parseInt(containerSets[1][x]) < scriptOptions.min_views) continue;
        ytDlpScript += `${containerSets[0][x]}\n`;
    }
    downloadScript(ytDlpScript);
}
function downloadScript(script) { // Download the script text to a file
    var blob = new Blob([script], { type: "text/plain" }); // Create a blob with the text
    var link = document.createElement("a");
    var name = "TikTokLinks.txt"; // Set the standard name
    switch (scriptOptions.output_name_type) { // Look at the type of the name
        case 0: // Fetch name from data tags
            name = document.querySelector("[data-e2e=user-title]")?.textContent ?? document.querySelector("[data-e2e=browse-username]")?.firstChild?.textContent ?? document.querySelector("[data-e2e=browse-username]")?.textContent ?? document.querySelector("[data-e2e=challenge-title]")?.textContent ?? document.querySelector("[data-e2e=music-title]")?.textContent ?? "TikTokLinks.txt";
            break;
        case 1: // Fetch name from the website title
            name = `${document.title.substring(0, document.title.indexOf(" | TikTok"))}.txt`;
            break;
        case 2: // Fetch name from the first "h1" element on the page
            name = `${document.querySelector("h1")?.textContent ?? "TikTokLinks"}.txt`;
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
    ytDlpScript();
    if (scriptOptions.delete_from_next_txt) { // If delete_from_next_txt is enabled, delete the old items, so that only the newer ones will be downloaded.
        skipLinks.push(...containerSets[0]);
        containerSets = [[], []];
    }
}
function startDownload(name) {
    if ((name ?? "") !== "") scriptOptions.output_name_type = name; // Update the file name type if it's provided a non-nullish value
    loadWebpage(); // And start scrolling the webpage
}
startDownload(); // Add as an argument a custom file name (or a custom file type value), or edit it from the scriptOptions.output_name_type