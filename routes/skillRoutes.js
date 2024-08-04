import express from 'express';
import { fetchSkills, addSkills, deleteSkill, updateSkill } from '../controllers/skillsController.js';

const skillRouter = express.Router();

skillRouter.get('/', fetchSkills);
skillRouter.post('/', addSkills);
skillRouter.delete('/:id', deleteSkill);
skillRouter.put('/:id', updateSkill);

export default skillRouter;
