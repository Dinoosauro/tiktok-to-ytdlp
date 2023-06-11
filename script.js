var scriptOptions = {
    scrolling_min_time: 1300, // Change the mininum time the script will try to refresh the page
    scrolling_max_time: 2100, // Change the maxinum time the script will try to refresh the page
    get_array_after_scroll: false, // Gets the item links after the webpage is fully scrolled, and not after every scroll.
    min_views: -1, // If a video has fewer views than this, it won't be included in the script.
    delete_from_next_txt: true, // Delete all the items put in the previous .txt file when asking for a new one. Useful only if you want to obtain a .txt file while scrolling.
}

var height = document.body.scrollHeight;
var containerSets = [[], []];
var skipLinks = [];
function loadWebpage() {
    if (document.body.innerHTML.indexOf("class=\"tiktok-qmnyxf-SvgContainer\">") == -1) { // Checks if the SVG loading animation is present in the DOM
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to the bottom of the page
        setTimeout(function () {
            if (height !== document.body.scrollHeight) { // The webpage has scrolled the previous time, so we can try another scroll
                if (!scriptOptions.get_array_after_scroll) addArray(); 
                setTimeout(function () {
                    height = document.body.scrollHeight;
                    loadWebpage();
                }, Math.floor(Math.random() * scriptOptions.scrolling_max_time + scriptOptions.scrolling_min_time));
            } else { // 
                setTimeout(function() {
                    if (document.body.innerHTML.indexOf("class=\"tiktok-qmnyxf-SvgContainer\">") == -1 && height == document.body.scrollHeight) { // By scrolling, the webpage height doesn't change, so let's download the txt file
                        ytDlpScript();        
                    } else { // The SVG animation is still present, there are other contents to load.
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
loadWebpage();
function addArray() {
    var getClass = document.getElementsByClassName("tiktok-x6y88p-DivItemContainerV2"); // Class of every video container
    for (var i = 0; i < getClass.length; i++) {
        // Simple information scraping: the link (getLink) is put in the first array, while the views (getViews) are put in the second one
        var getLink = getClass[i].innerHTML.substring(getClass[i].innerHTML.indexOf("<a href=\"")).replace("<a href=\"", "");
        getLink = getLink.substring(0, getLink.indexOf("\""));
        if (containerSets[0].indexOf(getLink) == -1 && skipLinks.indexOf(getLink) == -1) {
            containerSets[0].push(getLink);
            var getViews = getClass[i].innerHTML.substring(getClass[i].innerHTML.indexOf("video-views"));
            getViews = getViews.substring(getViews.indexOf(">") + 1);
            containerSets[1].push(getViews.substring(0, getViews.indexOf("<")).replace(".", "").replace("K", "00").replace("M", "00000"));
        }
    }
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
function downloadScript(script) {
    var blob = new Blob([script], {type: "text/plain"});
    var link = document.createElement("a"); 
    link.href = URL.createObjectURL(new File([blob], "TikTokLinks.txt", {type: "text/plain"})); 
    link.download = "TikTokLinks.txt";
    link.click(); 
    URL.revokeObjectURL(link.href); 
}
function requestTxtNow() {
    // Write requestTxtNow() in the console to obtain the .txt file while converting. Useful if you have lots of items, and you want to start downloading them.
    ytDlpScript();
    if (scriptOptions.delete_from_next_txt) { // If delete_from_next_txt is enabled, delete the old items, so that only the newer ones will be downloaded.
        skipLinks.push(...containerSets[0]);
        containerSets = [[],[]];    
    }
}