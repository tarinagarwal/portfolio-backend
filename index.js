import express from "express";
import { config } from "dotenv";
import cors from "cors";
import skillRouter from "./routes/skillRoutes.js";
import galleryRouter from "./routes/galleryRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import blogRouter from "./routes/blogsRoutes.js";
import telegramRouter from "./routes/telegramRoutes.js";
config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/telegram", telegramRouter);
app.get("/", (req, res) => {
  res.send("Portfolio Backend- Tarin Agarwal");
});

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
blogRouter;
