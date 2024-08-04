import express from 'express';
import { fetchGallery, addGallery, deleteGallery, updateGallery } from '../controllers/galleryController.js';

const galleryRouter = express.Router();

galleryRouter.get('/', fetchGallery);
galleryRouter.post('/', addGallery);
galleryRouter.delete('/:id', deleteGallery);
galleryRouter.put('/:id', updateGallery);

export default galleryRouter;
