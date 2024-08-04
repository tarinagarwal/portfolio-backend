import express from 'express';
import { fetchBlogs, addBlog, deleteBlog, updateBlog } from '../controllers/blogsController.js';

const blogRouter = express.Router();

blogRouter.get('/', fetchBlogs);
blogRouter.post('/', addBlog);
blogRouter.delete('/:id', deleteBlog);
blogRouter.put('/:id', updateBlog);

export default blogRouter;
