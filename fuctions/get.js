const fs = require("fs");

function get(filePath, name) {
    if (!filePath) throw new Error("Target file not specified.");

    const fileContent = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(`^${name}=(.*)$`, "gm");
    const match = regex.exec(fileContent);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

module.exports = get;
