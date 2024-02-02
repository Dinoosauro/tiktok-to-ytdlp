# tiktok-to-ytdlp
Fetch all the liked videos, videos from an user, videos with a specific sound etc. from TikTok, and creates a script to download them with yt-dlp

## Instructions

1. Open the TikTok webpage of the user/sound/etc. you want all the videos downloaded
2. Press Ctrl (or Cmd if you are on a Mac) + Shift + I to open the Developer Tools. 
3. Go into the Console tab on the top (if you don't see it, click on the ```>>```).
   - If you've used the Developer Console before, you can continue to step 4
   - Otherwise, write "allow pasting" in the console, and then press "Enter"
4. Paste the content you can find in the [script.js](https://raw.githubusercontent.com/Dinoosauro/tiktok-to-ytdlp/main/script.js) file. 
   - If you prefer a minified version, you can find that [here](https://raw.githubusercontent.com/Dinoosauro/tiktok-to-ytdlp/main/script.min.js). 
5. Press enter. The script will start fetching TikTok links.

The webpage will automatically scroll until no other items are found. Then, a file called "TikTokLinks.txt" will be downloaded. You now can download the videos with yt-dlp. An example script is:

```yt-dlp -a TikTokLinks.txt -o “TikTok/%(uploader)s/%(title)s - %(id)s.%(ext)s"```

Note that the most important part in this script is ```-a TikTokLinks.txt```: by writing this, yt-dlp will download all the videos that are in the txt file. You can then add all the arguments you prefer to yt-dlp
### Ask for intermediate files
If you need to download a really long list of TikTok, you may want to start downloading them while the page continues scrolling. To do that, you can download an intermediate file, that will contain all of the links up to the point the page has scrolled. To do that, write in the console ```requestTxtNow()```, press enter and a ```TikTokLinks.txt``` file will be downloaded.

By default, the links in the first intermediate files will be deleted from the final (or the second/third etc. file if you want to download more intermediate files) file, so that you won't download any duplicates. You can change that by putting the ```delete_from_next_txt``` option to false.
## Script options
You can edit the values of the first five lines of the script to change some useful settings:
- ```scrolling_min_time``` & ```scrolling_max_time```: change the thread sleeps between a scroll and the next one.
- ```min_views```: don't add a video to the text file if it has fewer than _x_ views.
- ```delete_from_next_txt```: put this to false if you want that the final txt files has all the links, even the ones you've already downloaded with intermediate files. 
- ```output_name_type```: choose the format for the output file name. Valid inputs are:
    * A generic string: the file name will be exactly that
    * 0 (as integer): try fetching the title from some data tags
    * 1 (as integer): the webpage title will be used
    * 2 (as integer; default): the first title on the page (h1 HTML elmenet) will be used
    * Any other value: "TikTokLinks.txt" will be used as a file name
- ```adapt_text_output```: replace Windows unsafe characters for the output file name.
### Advanced script options
These really useful options permit to change how the script fetches data, and what it should do when errors are found.
- ```get_array_after_scroll```: change this if you want to fetch all the TikTok videos when the script has finished scrolling, and not after every single scroll. Keep in mind that it seems that TikTok doesn't unappend the previous videos, so this option shouldn't be relevant, but this might change in the future.
- ```get_link_by_filter```: use the new method of getting all the links in a video container, and then look for the one that contains the video URL structure. If false, the "old" method of using data attributes will be used (even if I couldn't find more tags, I can't garantee that this old method has all of them).
- ```check_nullish_link```: Check if the link is nullish, and, since it would be useless to append it, continue with the next link. It's reccomended to leave this set to true.
- ```log_link_error```: Write to the console if a link is nullish. 
## Warning:
This script is licensed under the MIT license.

Even if basically the only thing this script does is automatically scrolling the webpage, so there's not that big of a risk, I don't claim any responsibilties at all for the usage of this script and the eventual consequences.

