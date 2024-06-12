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
            let data = fs.readFileSync(this.filePath, "utf8");
            let parsedData = this.parseINI(data);

            if (!parsedData[""]) {
                parsedData[""] = {};
            }

            parsedData[""][name] = value;
            let newData = this.stringifyINI(parsedData);

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

                //DEBUG console.log(`Variable '${oldName}' renamed to '${newName}' successfully.`);
            } else {
                console.error(`Variable '${oldName}' not found.`);
            }
        } catch (err) {
            console.error("Error while renaming variable in INI file:", err);
        }
    }
    
    raw(command) {
      try {
          const regexSet = /SELECT_KEY\s+"([^"]+)"\s+OPERATOR\s+(set)\s+VALUE\s+"([^"]+)"/;
          const regexGetHasDelete = /SELECT_KEY\s+"([^"]+)"\s+OPERATOR\s+(get|has|delete)/;
          const regexClear = /OPT\s+"clear"/;
  
          if (regexSet.test(command)) {
              const match = command.match(regexSet);
  
              if (!match || match.length !== 4) {
                  console.error("Invalid set command format.");
                  return;
              }
  
              const name = match[1];
              const operator = match[2];
              const value = match[3];
  
              this.set(name, value);
          } else if (regexGetHasDelete.test(command)) {
              const match = command.match(regexGetHasDelete);
  
              if (!match || match.length !== 3) {
                  console.error("Invalid get/has/delete command format.");
                  return;
              }
  
              const name = match[1];
              const operator = match[2];
  
              switch (operator) {
                  case "get":
                      return this.get(name);
                  case "has":
                      return this.has(name);
                  case "delete":
                      this.delete(name);
                      break;
                  default:
                      console.error("Invalid operator:", operator);
              }
          } else if (regexClear.test(command)) {
              this.clear();
          } else {
              console.error("Invalid command format.");
              return;
          }
      } catch (err) {
          console.error("Error while executing raw command:", err);
      }
    }
    
    
    createObject(name, object) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          parsedData[name] = object;
          let newData = this.stringifyINI(parsedData);
          fs.writeFileSync(this.filePath, newData, "utf8");
          //DEBUG console.log(`Object '${name}' created successfully.`);
      } catch (err) {
          console.error(`Error while creating object '${name}':`, err);
      }
    }

    getObject(name) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          return parsedData[name] || null;
      } catch (err) {
          console.error(`Error while getting object '${name}':`, err);
          return null;
      }
    }

    hasObject(name) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          return !!parsedData[name];
      } catch (err) {
          console.error(`Error while checking if object '${name}' exists:`, err);
          return false;
      }
    }

    addObject(name, key, value) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          if (!parsedData[name]) {
              parsedData[name] = {};
          }
          parsedData[name][key] = value;
          let newData = this.stringifyINI(parsedData);
          fs.writeFileSync(this.filePath, newData, "utf8");
          //DEBUG console.log(`Key '${key}' with value '${value}' added to object '${name}' successfully.`);
      } catch (err) {
          console.error(`Error while adding key-value pair to object '${name}':`, err);
      }
    }

    deleteObject(name) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          delete parsedData[name];
          let newData = this.stringifyINI(parsedData);
          fs.writeFileSync(this.filePath, newData, "utf8");
          //DEBUG console.log(`Object '${name}' deleted successfully.`);
      } catch (err) {
          console.error(`Error while deleting object '${name}':`, err);
      }
    }

    removeObject(name, object) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          
          if(parsedData[name]) {
              delete parsedData[name][object];
              let newData = this.stringifyINI(parsedData);
              fs.writeFileSync(this.filePath, newData, "utf8");
              //DEBUG console.log(`Object '${object}' removed from '${name}' successfully.`);
          } else {
              console.error(`Object '${name}' not found.`);
          }
      } catch (err) {
          console.error(`Error while removing object '${object}' from '${name}':`, err);
      }
    }

    setObject(name, object, newValue) {
      try {
          let data = fs.readFileSync(this.filePath, "utf8");
          let parsedData = this.parseINI(data);
          
          if(parsedData[name]) {
              parsedData[name][object] = newValue;
          } else {
              parsedData[name] = { [object]: newValue };
          }
          
          let newData = this.stringifyINI(parsedData);
          fs.writeFileSync(this.filePath, newData, "utf8");
          //DEBUG console.log(`Object '${object}' set to '${newValue}' in '${name}' successfully.`);
      } catch (err) {
          console.error(`Error while setting object '${object}' to '${newValue}' in '${name}':`, err);
      }
    }
    
  
  
  // end
}

module.exports = Dini;