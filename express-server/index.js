require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
