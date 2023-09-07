import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to the Spammer Server" });
});

app.get("/messages", async (req, res) => {
  const messages = await prisma.message.findMany();
  res.send({ success: true, messages });
});

app.post("/messages", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.send({
      success: false,
      error: "Text must be provided to create a message!",
    });
  }

  const message = await prisma.message.create({
    data: {
      text,
    },
  });

  res.send({ success: true, message });
});

app.put("/messages/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const { text, likes } = req.body;
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { text, likes },
    });
    res.send({ success: true, message });
  } catch (error) {
    res.send({ success: false, error: "Update failed." });
  }
});

app.delete("/messages/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const message = await prisma.message.delete({
      where: { id: messageId },
    });

    res.send({ success: true, message });
  } catch (error) {
    res.send({
      success: false,
      error: "An error occurred while deleting a message",
    });
  }
});

app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
