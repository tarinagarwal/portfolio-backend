import express from 'express';
import { fetchBlogs, addBlog } from '../controllers/blogsController.js';

const blogRouter = express.Router();

blogRouter.get('/', fetchBlogs);
blogRouter.post('/', addBlog);

export default blogRouter;
