const deleteHandler = require("./functions/delete");
const getHandler = require("./functions/get");
const hasHandler = require("./functions/has");
const fs = require("fs");

/*
    * Dini v1.0.0
    * (C) warfdev - discord: zsdot#0
*/

class Dini {
    constructor() {
        this.filePath = "";
    }

    /**
     * 
     * @param {*} filePath 
     * @description Identify your DB file.
     */
    targetFile(filePath) {
        this.filePath = filePath;
        return this;
    }

    set(name, value) {
        try {
            // Read existing data from the file
            let data = fs.readFileSync(this.filePath, "utf8");

            // Parse the data as INI format
            let parsedData = this.parseINI(data);

            // Check if the section exists, if not create it
            if (!parsedData[""]) {
                parsedData[""] = {};
            }

            // Set the value for the specified name
            parsedData[""][name] = value;

            // Convert the data back to INI format
            let newData = this.stringifyINI(parsedData);

            // Write the updated data to the file
            fs.writeFileSync(this.filePath, newData, "utf8");
        } catch (err) {
            console.error("Error while setting value in INI file:", err);
        }
    }

    // Helper function to parse INI formatted data
    parseINI(data) {
        let result = {};
        let currentSection = null;

        data.split(/\r?\n/).forEach(line => {
            let match;
            if (match = line.match(/^\[(.*)\]$/)) {
                currentSection = match[1];
            } else if (match = line.match(/^([^=]+)=(.*)$/)) {
                let key = match[1].trim();
                let value = match[2].trim();
                if (!result[currentSection]) {
                    result[currentSection] = {};
                }
                result[currentSection][key] = value;
            }
        });

        return result;
    }

    // Helper function to stringify data into INI format
    stringifyINI(data) {
        let iniString = '';

        Object.keys(data).forEach(section => {
            iniString += `[${section}]\n`;

            Object.keys(data[section]).forEach(key => {
                iniString += `${key}=${data[section][key]}\n`;
            });

            iniString += '\n';
        });

        return iniString;
    }

    delete(name) {
        deleteHandler(this.filePath, name);
    }

    get(name) {
        return getHandler(this.filePath, name);
    }

    has(name) {
        return hasHandler(this.filePath, name);
    }

    fetch(name) {
        try {
            let data = fs.readFileSync(this.filePath, "utf8");
            let parsedData = this.parseINI(data);
            if (name) {
                return parsedData[""] && parsedData[""][name] ? {[name]: parsedData[""][name]} : null;
            } else {
                return parsedData;
            }
        } catch (err) {
            console.error("Error while fetching data from INI file:", err);
            return null;
        }
    }
    
    clear() {
        try {
            fs.writeFileSync(this.filePath, "", "utf8");
            console.log("INI file cleared successfully.");
        } catch (err) {
            console.error("Error while clearing INI file:", err);
        }
    }

    rename(oldName, newName) {
        try {
            let data = fs.readFileSync(this.filePath, "utf8");
            let parsedData = this.parseINI(data);
    
            if (parsedData[""] && parsedData[""][oldName]) {

                let value = parsedData[""][oldName];
                delete parsedData[""][oldName];

                parsedData[""][newName] = value;
                let newData = this.stringifyINI(parsedData);
    
                fs.writeFileSync(this.filePath, newData, "utf8");
    
                console.log(`Variable '${oldName}' renamed to '${newName}' successfully.`);
            } else {
                console.error(`Variable '${oldName}' not found.`);
            }
        } catch (err) {
            console.error("Error while renaming variable in INI file:", err);
        }
    }
}

module.exports = Dini;
