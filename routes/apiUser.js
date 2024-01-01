import express from 'express'
import User from '../models/userModel.js';
import connection from '../connection.js';
import { getApiUser, getApiUserId, patchApiUserId, deleteApiUserId,postApiUser } from '../controllers/apiUsercontroller.js'

connection()

const apirouter = express.Router()

apirouter.get('/',getApiUser)


apirouter.route("/:id")
    .get(getApiUserId)
    .patch(patchApiUserId)
    .delete(deleteApiUserId)

apirouter.post('/',postApiUser)

export {
    apirouter
}
