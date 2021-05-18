require('dotenv').config()
import express from "express";
import mongoose from "mongoose";
import passport from "passport";

const users = require("./routes/api/users");

const app = express();
app.use(express.json());
const MONGODB_URI = process.env.MONGODB_URI || 'nodb';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err: any) => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/api/users", users);

app.get("/", (req: any, res: any) => {
  console.log(`req.body = ${req.body}`)
  return res.json({
    message: 'mernauth'
  })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server up and running on port ${port}!`));
