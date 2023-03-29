const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


const userController = require("../controllers/userController");
const { userModel } = require("../models/userModel");

const GitHubStrategy = require("passport-github").Strategy;
require('dotenv').config();
/*------Github Login------ */
const githubLogin = new GitHubStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  // need to check if user already in database
  const user = userModel.findOrCreate(profile);
  return done(null, user);
});

/*------Local Login------ */
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin).use(githubLogin);
