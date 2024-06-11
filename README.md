<center>

## Dini.db

</center>


---

<br/>

<div align="center">
  <b>With this module, you'll be able to perform database operations with your .ini extension files.</b>
</div>

<br/>
<br/>

### 📥 Install;
```sh
npm install dini.db
npm install dini.db@latest
```

<br/>

---

<br/>

### ✨️ Example Usage;
```js
const Dini = require("dini.db");
const db = new Dini();

// target file
const f = db.targetFile("YourIniFile.ini"); // required


f.set("apples", "1");
f.set("username", "warfdev");

/*
returns;

./YourIniFile.ini

[]
apples=1
username=warfdev
*/


```

<br/>

<br/>

### Functions;
```js
// set(name, value)
<file>.set("diamomds", "15");

// get(name)
<file>.get("diamonds");

// has(name)
<file>.has("diamonds");

// delete(name)
<file>.delete("diamonds");

// fetch(name)
<file>.fetch("diamonds");

// clear()
<file>.clear();

// rename(name, newName)
<file>.rename("diamonds", "irons");
```
