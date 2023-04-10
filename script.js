var scriptOptions = {
    scrolling_min_time: 1300, // Change the mininum time the script will try to refresh the page
    scrolling_max_time: 2100, // Change the maxinum time the script will try to refresh the page
    get_array_after_scroll: false, // Gets the item links after the webpage is fully scrolled, and not after every scroll.
    min_views: -1, // If a video has fewer views than this, it won't be included in the script.
}

var height = document.body.scrollHeight;
var containerSets = [[], []];
function loadWebpage() {
    if (document.body.innerHTML.indexOf("class=\"tiktok-qmnyxf-SvgContainer\">") == -1) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        setTimeout(function () {
            if (height !== document.body.scrollHeight) {
                if (!scriptOptions.get_array_after_scroll) addArray();
                setTimeout(function () {
                    height = document.body.scrollHeight;
                    loadWebpage();
                }, Math.floor(Math.random() * scriptOptions.scrolling_max_time + scriptOptions.scrolling_min_time));
            } else {
                setTimeout(function() {
                    if (document.body.innerHTML.indexOf("class=\"tiktok-qmnyxf-SvgContainer\">") == -1 && height == document.body.scrollHeight) {
                        ytDlpScript();        
                    } else {
                        loadWebpage();
                    }
                }, 3500)
            }
        }, 150);
    } else {
        setTimeout(function () {
            loadWebpage()
        }, 1000);
    }
}
loadWebpage();
function addArray() {
    var getClass = document.getElementsByClassName("tiktok-x6y88p-DivItemContainerV2");
    for (var i = 0; i < getClass.length; i++) {
        var getLink = getClass[i].innerHTML.substring(getClass[i].innerHTML.indexOf("<a href=\"")).replace("<a href=\"", "");
        getLink = getLink.substring(0, getLink.indexOf("\""));
        if (containerSets[0].indexOf(getLink) == -1) {
            containerSets[0].push(getLink);
            var getViews = getClass[i].innerHTML.substring(getClass[i].innerHTML.indexOf("video-views"));
            getViews = getViews.substring(getViews.indexOf(">") + 1);
            containerSets[1].push(getViews.substring(0, getViews.indexOf("<")).replace(".", "").replace("K", "00").replace("M", "00000"));
        }
    }
}
function ytDlpScript() {
    addArray();
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