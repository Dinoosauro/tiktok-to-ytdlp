# tiktok-to-ytdlp
Fetch all the liked videos, videos from an user, videos with a specific sound etc. from TikTok, and creates a script to download them with yt-dlp

## Instructions

Open the TikTok webpage of the user/sound/etc. you want all the videos downloaded. Press Ctrl (or Cmd if you are on a Mac) + Shift + I to open the Developer Tools. Go into the Console tab on the top (if you don't see it, click on the ```>>```) and paste the content you can find in the [script.js](https://raw.githubusercontent.com/Dinoosauro/tiktok-to-ytdlp/main/script.js) file.

The webpage will automatically scroll until no other items are found. Then, a file called "TikTokLinks.txt" will be downloaded. You now can download the videos with yt-dlp. An example script is:

```yt-dlp -a TikTokFiles.txt -o “TikTok/%(uploader)s/%(title)s - %(id)s.%(ext)s"```

Note that the most important part in this script is ```-a TikTokFiles.txt```: by writing this, yt-dlp will download all the videos that are in the txt file. You can then add all the arguments you prefer to yt-dlp

## Script options
You can edit the values of the first five lines of the script to change some useful settings:
- ```scrolling_min_time``` & ```scrolling_max_time```: change the thread sleeps between a scroll and the next one.
- ```get_array_after_scroll```: change this if you want to fetch all the TikTok videos when the script has finished scrolling, and not after every single scroll. Keep in mind that it seems that TikTok doesn't unappend the previous videos, so this option should be relevant, but this might change in the future.
- ```min_views```: don't add a video to the text file if it has fewer than _x_ views.
## Warning:
This script is licensed under the MIT license.

Even if basically the only thing this script does is automatically scrolling the webpage, so there's not that big of a risk, I don't claim any responsibilties at all for the usage of this script and the eventual consequences.

