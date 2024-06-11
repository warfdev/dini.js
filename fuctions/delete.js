const fs = require("fs");

function deleteKey(filePath, name) {
    if (!filePath) throw new Error("Target file not specified.");

    let fileContent = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(`^${name}=.*$`, "gm");
    fileContent = fileContent.replace(regex, "");

    fs.writeFileSync(filePath, fileContent);
}

module.exports = deleteKey;
