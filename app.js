import express from 'express'
import fs from 'fs'
import timeFormatter from './timeFormatter.js'
import mongoose from 'mongoose'
import User from './models/userModel.js'

mongoose.connect('mongodb+srv://amanjhavdjs12tha:kYb69Okx0qtJqBff@testprodb.jodaqon.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log("hello Mongo Db connected")
})
.catch((err) => {
    console.error(err);
})

const funimporter = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const users = funimporter('./User_Data.json');

const app = express()

// Middleware-Plugin

app.use(express.urlencoded({ extended:false }));

app.use((req,res,next) => {
    fs.appendFile('log.txt',`${timeFormatter()}  ${req.path} ${req.method}\n`,(err,data) => {
        // Do Nothing just go to next.
    })
    next()
})

app.get('/',(req,res) => {
    res.end("hello")
})

app.get('/users', async (req, res) => {
    try {
        const allDbUsers = await User.find({});
        const html = `
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }

                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
            </style>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Job Title</th>
                    </tr>
                </thead>
                <tbody>
                    ${allDbUsers.map((user) => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>${user.gender}</td>
                            <td>${user.job_title}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const html = `
            <html>
            <head>
                <style>
                    body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f4f4f4;
                        font-family: 'Arial', sans-serif;
                    }

                    .user-card {
                        border: 1px solid #ddd;
                        padding: 20px;
                        width: 300px;
                        background-color: #fff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    h3 {
                        margin: 0;
                        color: #333;
                    }

                    p {
                        margin: 10px 0 0;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="user-card">
                    <h3>${user.first_name} ${user.last_name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Gender: ${user.gender}</p>
                    <p>Job Title: ${user.job_title}</p>
                </div>
            </body>
            </html>`;

        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/api/users',async (req,res) => {
    // res.json(users)
    const allDbUsers = await User.find({})
    return res.status(200).json(allDbUsers)
})

app.route("/api/users/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const user = await User.findOne({ id: id });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    })
    .patch((req,res) => {
        const id = req.params.id;
        return res.status(502).send("<h1>request patched.</h1>")
    })
    .delete((req,res) => {
        return res.status(501).json({status:'pending'})
    })

app.post('/api/users',(req,res) => {
    const body = req.body
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg:'ALL Fields are required.'})
    }
    console.log(body)
    const nextid = users[users.length -1]['id'] + 1
    users.push({id : nextid,...body})
    fs.writeFile('./User_Data.json',JSON.stringify(users) , (err,data) => {

    })
    const newUser = new User({
        id: nextid , ...body
    })
    newUser.save();
    return res.status(201).json({
        status : 'Success!!',
        id:`${nextid}`
    })
})

app.listen(5000,()=>{
    console.log("Listing on port 5000.")
})


