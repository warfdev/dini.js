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

// raw(code)
<file>.raw(`SELECT_KEY "diamonds" OPERATOR set VALUE "30"`);
```

<br/>

<br/>

### Object Functions Information;
```js
// Functions List;

// createObject(name, object)
<file>.createObject('person', { name: 'John', age: 30, city: 'New York' });

/*
 returns;
 
 ./YourIniFile.ini
 
 [person]
 name=John
 age=30
 city=New York
 
*/


// addObject(name, object, value)
<file>.addObject("person", "money", 3000);

/*
returns;

./YourIniFile.ini

 [person]
 name=John
 age=30
 city=New York
 money=3000
*/


// removeObject(name, object)
<file>.removeObject("person", "age");

/*
returns;

./YourIniFile.ini

 [person]
 name=John
 city=New York
 money=3000
*/


// setObject(name, object, value)
<file>.setObject("person", "money", 10000);

/*
returns;

./YourIniFile.ini

 [person]
 name=John
 city=New York
 money=10000
*/


// getObject(name)
const obj = <file>.getObject("person");
console.log(obj); // returns; { name: "John", city: "New York", money: 10000 }
console.log(obj.name); // returns; John


// hasObject(name)
console.log(<file>.hasObject("persom")) // returns; boolean
```