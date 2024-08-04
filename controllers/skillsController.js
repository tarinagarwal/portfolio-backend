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

const fetchSkills = async (req, res) => {
  try {
    const skillsData = await withClient(async (client) => {
      const { rows } = await client.query("SELECT * FROM skills");
      return rows;
    });

    res.status(200).json({ skills: skillsData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while fetching skills" });
  }
};

const addSkills = async (req, res) => {
  const { name, iconId, redirectUrl } = req.body;

  if (!name || !iconId || !redirectUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          iconId VARCHAR(255) NOT NULL,
          redirectUrl VARCHAR(255) NOT NULL
        );
      `);

      // Insert new skill
      await client.query(
        "INSERT INTO skills (name, iconId, redirectUrl) VALUES ($1, $2, $3)",
        [name, iconId, redirectUrl]
      );
    });

    res.status(201).json({ message: "Added skill successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Something went wrong while adding skills: ${error.message}`,
    });
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    await withClient(async (client) => {
      await client.query("DELETE FROM skills WHERE id = $1", [id]);
    });

    res.status(200).json({ message: "Skill deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Something went wrong while deleting skill: ${error.message}`,
    });
  }
};

const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, iconId, redirectUrl } = req.body;

  if (!name || !iconId || !redirectUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      await client.query(
        "UPDATE skills SET name = $1, iconId = $2, redirectUrl = $3 WHERE id = $4",
        [name, iconId, redirectUrl, id]
      );
    });

    res.status(200).json({ message: "Skill updated successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Something went wrong while updating skill: ${error.message}`,
    });
  }
};

export { fetchSkills, addSkills, deleteSkill, updateSkill };
