import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";

config();

const router = express.Router();

router.post("/send", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data = await response.json();
    console.log("Message sent to Telegram:", data);
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
