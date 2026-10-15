import mysql from "mysql"
import express from "express"
const app = express()


// db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "l4sod"
})

db.connect((err)=>{
    if(err) {console.log('db connection error')}
    else{console.log('database connected successfully')}
})


app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})