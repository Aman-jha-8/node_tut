import express from 'express'
import User from '../models/userModel.js';
import connection from '../connection.js';
import { getUser ,getUserId } from '../controllers/usercontroller.js';

const router = express.Router()

connection()

router.get('/', getUser);

router.get('/:id', getUserId);

export default router
