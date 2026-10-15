import mysql from "mysql"
import express from "express"
const app = express()

app.use(express.json())


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

// CRUD OPERATION
//GET Fetch all data
app.get('/api/users',(req,res)=>{
    const myQuery='SELECT * FROM users';
    db.query(myQuery,(error,results)=>{
        if(error){
            return res.status(500).json({error: error})
        }
        return res.status(200).json({message: 'data fetched',
             results})
    })

})


// POST insert data in db
app.post('/api/users',(req,res)=>{
    const {name,age,gender} = req.body;
    const myQuery=
    'INSERT INTO users(name,age,gender) VALUES(?,?,?)'
    db.query(myQuery,[name,age,gender],(error,results)=>{
        if(error){
            return res.status(500).json({error: error})
        }
        return res.status(200).json({message: 'data inserted',
             results})
    })
})

app.get('/api/users/:id',(req,res)=>{
    const id = req.params.id
    const myQuery='SELECT * from users where id =?'
    db.query(myQuery,[id],(error,results)=>{
        if(error){
            return res.status(500).json({error: error})
        }
        return res.status(200).json({message: 'data fetched',
             results})
    })

})


app.put("/api/users/:id",(req,res)=>{
    const id = req.params.id
    const {name,age,gender} = req.body;
    const myQuery=
    'UPDATE users SET name=?,age=?,gender=? WHERE id=?'
    db.query(myQuery,[name,age,gender,id],(error,results)=>{
        if(error){
            return res.status(500).json({error: error})
        }
        return res.status(200).json({message: 'data updated',
             results})
    })
})


app.listen(5000,()=>{
    console.log("server is running on port 5000")
})