const fs = require("fs");
const zip = require("jszip");
const sep = require("path").sep;
// BUILDING OUTPUT
(fs.existsSync("output")) && fs.rmSync("output", { recursive: true });
fs.mkdirSync("output");
require("child_process").execSync(`cd code${sep}vite && npm i && npx vite build --base=ui`);
require("fs-extra").moveSync(`.${sep}code${sep}vite${sep}dist`, `.${sep}output${sep}ui`);
fs.mkdirSync(`output${sep}icons`);
for (let item of ["manifest.json", `icons${sep}16.png`, `icons${sep}48.png`, `icons${sep}128.png`]) fs.copyFileSync(`code${sep}${item}`, `output${sep}${item}`);
let firstScript = fs.readFileSync(`..${sep}script.js`, "utf-8");
firstScript = firstScript.substring(0, firstScript.indexOf("nodeElaborateCustomArgs();"));
fs.writeFileSync(`output${sep}extensionHandler.js`, `${firstScript}${fs.readFileSync(`code${sep}extensionHandler.js`, "utf-8")}`);
const zipFile = new zip();
for (let file of fs.readdirSync("output", { recursive: true })) if (fs.statSync(`output${sep}${file}`).isFile()) zipFile.file(file, fs.readFileSync(`output${sep}${file}`), { createFolders: true });
zipFile.generateAsync({ type: "nodebuffer" }).then((buffer) => fs.writeFileSync("output.zip", buffer));
// BUILDING SOURCE CODE ZIP
const sourceCode = new zip();
sourceCode.file(`README.md`, `# Build instrutions\n\nYou can find instructions to build this extension in the "extension" folder.\n\nRequirements: Node JS 20; NPM. Tested only on macOS and Linux.`);
sourceCode.file("script.js", fs.readFileSync(`..${sep}script.js`));
for (const item of ["build.js", "package.json", "package-lock.json", "README.md"]) sourceCode.file(`extension${sep}${item}`, fs.readFileSync(item));
for (const item of fs.readdirSync("code", { recursive: true }).filter(item => item.indexOf("node_modules") === -1)) if (fs.statSync(`code${sep}${item}`).isFile()) sourceCode.file(`extension${sep}code${sep}${item}`, fs.readFileSync(`code${sep}${item}`));
sourceCode.generateAsync({ type: "nodebuffer" }).then((buffer) => fs.writeFileSync("source.zip", buffer));
