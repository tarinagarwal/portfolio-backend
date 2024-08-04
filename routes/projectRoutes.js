import express from 'express';
import { addProject, fetchProjects, deleteProject, updateProject } from '../controllers/projectsController.js';

const projectRouter = express.Router();

projectRouter.get('/', fetchProjects);
projectRouter.post('/', addProject);
projectRouter.delete('/:id', deleteProject);
projectRouter.put('/:id', updateProject);

export default projectRouter;
