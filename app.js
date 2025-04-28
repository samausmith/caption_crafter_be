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

app.use(requestLogger);

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

app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
