import express from 'express'
import fs from 'fs'
import htmlhome from './index.js'
import logmiddleware from './middleware/logmiddleware.js'
import router from './routes/user.js'
import { apirouter} from './routes/apiUser.js'

const PORT =5000

const app = express()

// Middleware-Plugin

app.use(express.urlencoded({ extended:false }));

app.use(logmiddleware())

app.get('/',(req,res) => {
    res.end(`${htmlhome}`)
})

app.use('/users',router)

app.use('/api/users',apirouter)

app.listen(`${PORT}`,()=>{
    console.log("Listing on port",PORT,".",`http://localhost:5000/`)
})


