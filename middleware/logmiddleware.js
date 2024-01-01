import fs from 'fs'
import timeFormatter from '../timeFormatter.js'

export default function logmiddleware(filename=`log.txt`){
    return (req,res,next) => {
        fs.appendFile(`${filename}`,`${timeFormatter()}  ${req.path} ${req.method}\n`,(err,data) => {
            // Do Nothing just go to next.
        })
        next()
    }
}
