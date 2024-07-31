import express from 'express'
import { addSkills, fetchSkills } from '../controllers/skillsController.js';


const skillRouter = express.Router();

skillRouter.get('/',fetchSkills)
skillRouter.post('/',addSkills)

export default skillRouter