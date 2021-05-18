require('dotenv').config()
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
import mongoose from "mongoose";
const User = mongoose.model("users");

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret || 'none';
module.exports = (passport: any) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload: any, done: any) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};