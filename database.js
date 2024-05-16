const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware - บอกวิธีการที่ client ส่งข้อมูลผ่าน middleware
app.use(bodyParser.urlencoded({extended:false})) // ส่งผ่าน Form
app.use(bodyParser.json()) // ส่งด้วย Data JSON

const mysql = require("mysql2/promise");
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'student_database',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});

//  GET students

app.get('/students', async (req,res) => {
    const connection = await dbConn
    const [rows] = await connection.query('SELECT * from students')
     
    //res.json(rows)
    //res.send(rows[0]) // ส่งแค่ข้อมูล เนื่องจากมีปัญหาด้านข้อมูล
    res.render('students', { students: rows });
})

// GET students/:id 
app.get('/students/:id', async (req,res)=>{
    const connection = await dbConn
    const [rows] = await connection.query('SELECT * from students where id = ' +req.params.id)
    
    res.json(rows)
})

// เมื่อ Delete แล้วควรส่ง status แจ้งให้ผู้ใช้ทราบด้วย เช่น code 204
// localhost:3000/students/2
app.delete('/students/:id', async (req,res)=>{

    const connection = await dbConn
    await connection.query('Delete from students where id = ' +req.params.id)
    res.status(204).send("Deleted id " + req.params.id + " successful" )
})

// ทำ POST /students สำหรับข้อมูล student 1 คน
// JSON Body-Parser 
/*
{
    "name":"Oak",
    "age":"22",
    "phone":555,
    "email":"oak@email.com"
}
*/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/student.html');
});

app.post("/students", async (req, res) => {
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    const name = req.body.name;
    const age = req.body.age;
    const phone = req.body.phone;
    const email = req.body.email;

    const connection = await dbConn
    const rows = await connection.query("insert into students (name,age,phone,email) values('"+name+"','"+age+"',"+phone+",'"+email+"')")
    //res.status(201).send(rows)
    //res.status(201).send('<h1 style="color:blue;">คุณได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว</h1>')
    // res.status(201).json({
    //     message: 'คุณได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว',
    //     data: rows
    // });
    res.status(201).send(`<h1 style="color:blue;"> คุณได้ทำการเพิ่มข้อมูลเรียบร้อยแล้ว จำนวน ${rows[0].affectedRows} แถว</h1>`)
})    

// PUT
/*
{
    "name":"Oak",
    "age":"22",
    "phone":555,
    "email":"oak@email.com"
}
*/
app.put("/students/:id", async (req, res) => {
    // รับ id จาก params
    const id = req.params.id;
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    const name = req.body.name;
    const age = req.body.age;
    const phone = req.body.phone;
    const email = req.body.email;

    const connection = await dbConn
    const rows = await connection.query("Update students set name = '"+name+"', age = '"+age+"', phone = "+phone+", email = '"+email+"' where id = "+id+" ")
    res.status(201).send(rows)
})



app.get("/query-1", async (req, res) => {
    const connection = await dbConn
    const rows = await connection.query('SELECT * from students')
    res.send(rows);
})

app.get("/query-2", async (req, res) => {
    const connection = await dbConn
    const rows = await connection.query('SELECT * from students')
    res.send(rows);
})

app.listen(3000, () => {
    console.log("Server is running at port 3000")
})