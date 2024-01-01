import mongoose from 'mongoose'
import mongodbUrl from './ENVIRONMENT_PROCESS.js'

const connection = (url=`${mongodbUrl}`) =>{
    return mongoose.connect(url)
    .then(() => {
        console.log("hello Mongo Db connected")
    })
    .catch((err) => {
        console.error(err);
    })
}

export default connection
