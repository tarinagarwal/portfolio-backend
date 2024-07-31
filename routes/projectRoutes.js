import express from 'express';
import { addProject, fetchProjects } from '../controllers/projectsController.js';

const projectRouter = express.Router();

projectRouter.get('/', fetchProjects);
projectRouter.post('/', addProject);

export default projectRouter;
