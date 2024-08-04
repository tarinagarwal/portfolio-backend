

import pool from "../config/db.js";

const withClient = async (callback) => {
  const client = await pool.connect();
  try {
    return await callback(client);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const fetchBlogs = async (req, res) => {
  try {
    const blogsData = await withClient(async (client) => {
      const { rows } = await client.query("SELECT * FROM blogs");
      return rows;
    });

    res.status(200).json({ blogs: blogsData });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching blogs" });
  }
};

const addBlog = async (req, res) => {
  const { title, author, date, img, body, description } = req.body;

  if (!title || !author || !date || !img || !body || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          img VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          description TEXT NOT NULL
        );
      `);

      // Insert new blog
      await client.query(
        "INSERT INTO blogs (title, author, date, img, body, description) VALUES ($1, $2, $3, $4, $5, $6)",
        [title, author, date, img, body, description]
      );
    });

    res.status(201).json({ message: "Added blog successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Something went wrong while adding blog: ${error.message}` });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await withClient(async (client) => {
      const result = await client.query("DELETE FROM blogs WHERE id = $1", [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }
    });

    res.status(200).json({ message: "Deleted blog successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while deleting blog: ${error.message}` });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, author, date, img, body, description } = req.body;

  if (!title || !author || !date || !img || !body || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      const result = await client.query(
        "UPDATE blogs SET title = $1, author = $2, date = $3, img = $4, body = $5, description = $6 WHERE id = $7",
        [title, author, date, img, body, description, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }
    });

    res.status(200).json({ message: "Updated blog successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while updating blog: ${error.message}` });
  }
};

export { fetchBlogs, addBlog, deleteBlog, updateBlog };

