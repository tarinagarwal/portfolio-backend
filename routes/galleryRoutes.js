import express from 'express';
import { fetchGallery, addGallery } from '../controllers/galleryController.js';

const galleryRouter = express.Router();

galleryRouter.get('/', fetchGallery);
galleryRouter.post('/', addGallery);

export default galleryRouter;
