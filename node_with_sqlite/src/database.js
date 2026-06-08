import { DatabaseSync } from "node:sqlite";


const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users {
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  }
  `)
db.exec(`

  CREATE TABLE todos {

    id INTEGER PRIMARY KEY AUTOINCREMENT,


  }
  `)
