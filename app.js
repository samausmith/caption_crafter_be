const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const app = express();

const { PORT = 3001 } = process.env;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID;

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./utils/errorHandler");
const mainRouter = require("./routes/index");
const { BadRequestError } = require("./utils/errors/BadRequestError");

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/cc_db")
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to process image and send to GPT-4 Vision
app.post("/generate", async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(
      new BadRequestError("Invalid data for creating a captioned image")
    );
  }
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a poetic scene narrator for someone with visual impairment. Describe images using sensory language, mood, and feeling — avoiding visual phrasing like 'you see' or 'this picture shows.' Focus on sound, texture, motion, temperature, and emotion.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Project": OPENAI_PROJECT_ID,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing the image" });
  }
});

app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
