/*
This node.js script has been written to check if all of the TikTok links are saved when the "delete_from_next_txt" option is enabled.  
When the user enables that option, the script automatically deletes the website links downloaded to the first txt file, and it'll put the other ones in the second txt file.

To check if, at the end of the script, all of the website links have been downloaded, do the following:
    a) Start the script on the webpage
    b) After a few scrollings, execute the requestTxtNow() command. Save all of these files.
    c) After the webpage has scrolled completely, execute the script again. This will export a complete .txt file
    d) In the customOptions of this file, change  
        1) "fileWithAllLinks" with the location of the file with all the links (the last downloaded)
        2) "separatedFileNumber" with the number of the downloaded files. Usually, browsers (ad OSes) add a number in brackets to differentiate files with the same name. Put those numbers in the array, and make sure to put all of these files in the same folder.
    e) Run this script with node.js
*/

let customOptions = {
    fileWithAllLinks: "TempLinks/TikTokLinks (5).txt",
    separatedFileNumber: ["(3)", "(1)", "(4)"]
}

let fs = require("fs");
console.log("📖 | Reading files...");
let allItems = fs.readFileSync(customOptions.fileWithAllLinks, "utf8").replaceAll("\r", "");
let itemsMerged = "";
for (let i = 0; i < customOptions.separatedFileNumber.length; i++) itemsMerged += `${fs.readFileSync(`TempLinks/TikTokLinks ${customOptions.separatedFileNumber[i]}.txt`, "utf-8")}\n`;
itemsMerged = itemsMerged.replaceAll("\r", "");
let splitAll = allItems.split("\n");
let splitMerge = itemsMerged.split("\n");
console.log("🔍 | Starting looking into files...");
for (let i = 0; i < splitAll.length; i++) if (splitMerge.indexOf(splitAll[i]) === -1 && splitAll[i] !== "") console.log(`❌ | Not found ${splitAll[i]}`);
console.log("✅ | Finished testing! If you don't see anything else, all of the links are in the split txt files.");
