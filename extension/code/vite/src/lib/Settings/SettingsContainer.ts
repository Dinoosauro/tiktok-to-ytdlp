import { writable } from "svelte/store"

let Settings = writable({
    scrolling_min_time: 1300, // Change the mininum time the script will try to refresh the page
    scrolling_max_time: 2100, // Change the maxinum time the script will try to refresh the page
    min_views: -1, // If a video has fewer views than this, it won't be included in the script.
    delete_from_next_txt: true, // Delete all the items put in the previous .txt file when asking for a new one. Useful only if you want to obtain a .txt file while scrolling.
    output_name_type: 2, // Put a string to specify a specific name of the file. Put 0 for trying to fetching it using data tags, 1 for fetching it from the window title, 2 for fetching it from the first "h1" element. _Invalid_ inputs will use the standard "TikTokLinks.txt". This will be edited if a different value is passed from the startDownload() function.
    adapt_text_output: true, // Replace characters that are prohibited on Windows
    allow_images: true, // Save also TikTok Image URLs
    export_format: "txt",
    exclude_from_json: [], // If you plan to export the content in a JSON file, here you can exclude some properties from the JSON output. You can exclude "url", "views", "caption".
    advanced: {
        get_array_after_scroll: false, // Gets the item links after the webpage is fully scrolled, and not after every scroll.
        get_link_by_filter: true, // Get the website link by inspecting all the links in the container div, instead of looking for data references.
        check_nullish_link: true, // Check if a link is nullish and, if true, try with the next video.
        log_link_error: true, // Write in the console if there's an error when fetching the link.
        maximum_downloads: Infinity, // Change this to a finite number to fetch only a specific number of values. Note that a) more elements might be added to the final file if available; and b) "get_array_after_scroll" must be set to false.
        delete_from_dom: false, // Automatically delete the added items from the DOM. This works only if "get_array_after_scroll" is disabled. This is suggested only if you need to download a page with lots of videos
        get_video_container_from_e2e: false // Use the [data-e2e] attributes for getting the video container, instead of the normal CSS class.
    },
    __extension: {
        fileName: ""
    }
});
export default Settings;