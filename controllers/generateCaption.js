const fetch = require("node-fetch");
const { BadRequestError } = require("../utils/errors/BadRequestError");

const generateCaption = async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(
      new BadRequestError("Invalid data for creating a captioned image")
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": process.env.OPENAI_PROJECT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return res
        .status(response.status)
        .json({ error: "Error processing the image" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { generateCaption };
