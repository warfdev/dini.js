const fs = require("fs");

function has(filePath, name) {
    if (!filePath) throw new Error("Target file not specified.");

    const fileContent = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(`^${name}=(.*)$`, "gm");
    return regex.test(fileContent);
}

module.exports = has;
