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

const fetchGallery = async (req, res) => {
  try {
    const galleryData = await withClient(async (client) => {
      const { rows } = await client.query("SELECT * FROM gallery");
      return rows;
    });

    res.status(200).json({ gallery: galleryData });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Something went wrong while fetching gallery items ${error.message}` });
  }
};

const addGallery = async (req, res) => {
  const { imgUrl, location, eventName, projectName } = req.body;

  if (!imgUrl || !location || !eventName || !projectName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS gallery (
          id SERIAL PRIMARY KEY,
          imgUrl VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          eventName VARCHAR(255),
          projectName VARCHAR(255) NOT NULL
        );
      `);

      // Insert new gallery item
      await client.query(
        "INSERT INTO gallery (imgUrl, location, eventName, projectName) VALUES ($1, $2, $3, $4)",
        [imgUrl, location, eventName, projectName]
      );
    });

    res.status(201).json({ message: "Added gallery item successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while adding gallery item" });
  }
};

const deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    await withClient(async (client) => {
      const result = await client.query("DELETE FROM gallery WHERE id = $1", [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
    });

    res.status(200).json({ message: "Deleted gallery item successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while deleting gallery item: ${error.message}` });
  }
};

const updateGallery = async (req, res) => {
  const { id } = req.params;
  const { imgUrl, location, eventName, projectName } = req.body;

  if (!imgUrl || !location || !eventName || !projectName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await withClient(async (client) => {
      const result = await client.query(
        "UPDATE gallery SET imgUrl = $1, location = $2, eventName = $3, projectName = $4 WHERE id = $5",
        [imgUrl, location, eventName, projectName, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
    });

    res.status(200).json({ message: "Updated gallery item successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong while updating gallery item: ${error.message}` });
  }
};

export { fetchGallery, addGallery, deleteGallery, updateGallery };
