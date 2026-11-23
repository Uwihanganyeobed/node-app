import mysql from "mysql"
import express from "express"
import jwt from "jsonwebtoken" 
import bcrypt from "bcryptjs"

const app = express()

app.use(express.json())


// db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school_db"
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





// POST  register user
app.post('/api/auth/register',(req,res)=>{
   const {username,email,password,role} = req.body;
   //check if user is in db
   const checkEmailSql = 'SELECT * FROM users WHERE email = ?'
   db.query(checkEmailSql,[email],async(error,results)=>{
    if(error){
        return res.status(500).json({error:
             'user already exists', error})
    }
        const hashedPassword = await bcrypt.hash(password,10);

        const myQuery=
        'INSERT INTO users (username,email,password,role) VALUES (?,?,?,?)'
        db.query(myQuery,[username,email,hashedPassword,role],
            (error,results)=>{
            if(error){
                return res.status(500).json({error: error})
            }
            return res.status(201).json({
                message: 'user registered successfully', results})
        })
   })
})

// LOGIN
app.post('/api/auth/login',(req,res)=>{
    const {email,password} = req.body;
    // 1. check if user is in db
    const checkUserSql = 'SELECT * FROM users WHERE email = ?'
    db.query(checkUserSql,[email],async(error,results)=>{
        if(results.length === 0){
            return res.status(404).json({error: 'user not found'})
        }
    // 2. check if password is correct
        const matchedPassword = await bcrypt.compare(password,results[0].password)
        if(!matchedPassword){
            return res.status(401).json({error: 'invalid password'})
        }
    //3 generate token and send to user
        const token = await jwt.sign({
            id: results[0].id,
            email: results[0].email,
            role: results[0].role
        },'mySecretKey',{expiresIn: '1h'})
        
        return res.status(200).json(
            {message: 'login successful', token})
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