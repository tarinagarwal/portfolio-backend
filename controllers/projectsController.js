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

const fetchProjects = async (req, res) => {
  try {
    const projectsData = await withClient(async (client) => {
      const { rows } = await client.query("SELECT * FROM projects");
      return rows;
    });

    res.status(200).json({ projects: projectsData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while fetching projects" });
  }
};

const addProject = async (req, res) => {
  const { src, link, repo } = req.body;

  if (!src || !link) {
    return res
      .status(400)
      .json({ message: "src and link fields are required" });
  }

  try {
    await withClient(async (client) => {
      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          src VARCHAR(255) NOT NULL,
          link VARCHAR(255) NOT NULL,
          repo VARCHAR(255) DEFAULT NULL
        );
      `);

      // Insert new project
      await client.query(
        "INSERT INTO projects (src, link, repo) VALUES ($1, $2, $3)",
        [src, link, repo || null]
      );
    });

    res.status(201).json({ message: "Added project successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Something went wrong while adding project: ${error.message}`,
    });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await withClient(async (client) => {
      const result = await client.query("DELETE FROM projects WHERE id = $1", [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Project not found" });
      }
    });

    res.status(200).json({ message: "Deleted project successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while deleting project: ${error.message}` });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { src, link, repo } = req.body;

  if (!src || !link) {
    return res.status(400).json({ message: "src and link fields are required" });
  }

  try {
    await withClient(async (client) => {
      const result = await client.query(
        "UPDATE projects SET src = $1, link = $2, repo = $3 WHERE id = $4",
        [src, link, repo || null, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Project not found" });
      }
    });

    res.status(200).json({ message: "Updated project successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while updating project: ${error.message}` });
  }
};

export { fetchProjects, addProject, deleteProject, updateProject };
