require('dotenv').config()

import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
const validateSignUp = require("../../validation/SignUp");
const validateSignIn = require("../../validation/SignIn");
const User = require("../../models/User");

const secret = process.env.secret || 'nosecret';

router.post("/signup", (req: any, res: any) => {
  const { errors, isValid } = validateSignUp(req.body);

  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then((user: any) => {
    if (user) return res.status(400).json({ email: "Email already exists" });

    User.find().then((users: any) => {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
  
      if (users.length === 0) newUser.roles = { admin: true }
  
      return bcrypt.genSalt(10, (err: any, salt: any) => {
        console.log(err)
        bcrypt.hash(newUser.password, salt, (err: any, hash: any) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user: any) => res.json(user))
            .catch((err: any) => console.log(err));
        });
      });
    })
  });
});

router.post("/signin", async (req: any, res: any) => {
  const { errors, isValid } = validateSignIn(req.body);
  if (!isValid) return res.status(400).json(errors);
  
  const email = req.body.email;
  const password = req.body.password;
  let user: any = await User.findOne({ email })

  if (!user) return res.status(404).json({ emailnotfound: "Email not found" });

  let isMatch: boolean = await bcrypt.compare(password, user.password)
  if (isMatch) {
    const payload = {
      id: user.id,
      name: user.name
    };

    return jwt.sign(
      payload,
      secret,
      {
        expiresIn: 31556926
      },
      (err: any, token: String) => {
        res.json({
          err,
          success: true,
          token: "Bearer " + token
        });
      }
    );
  }

  return res
    .status(400)
    .json({ passwordincorrect: "The password you’ve entered is incorrect" });
});

router.get("/", (req: any, res: any) => {
  console.log(`req.body = ${req.body}`)
  return User.find().then((users: any) => {
    return res.json(users.map((user: any) => {
      return {
        name: user.name,
        email: user.email,
        roles: user.roles,
      }
    }))
  })
})

module.exports = router;
