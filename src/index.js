const express = require("express");
var session = require("express-session");
const passport = require("passport");
require("./auth");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong...");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send("Hello, " + req.user.displayName + "!");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("Goodbye, " + req.user.displayName);
});
app.listen(5000, () => console.log("Listening on port 5000"));
