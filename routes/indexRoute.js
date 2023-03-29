const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});


router.get("/admin", isAdmin, (req, res) => {
   req.sessionStore.all((err, sessions) => {
    if(err) console.log(err);
    else { 
      res.render("admin", {
        user: req.user,
        sessionList: sessions
      });
      console.log(sessions);
    }
   })
});

router.get("/revoke", isAdmin, (req, res) => {
  req.sessionStore.destroy(req.query.sessionId, (err) => {
    console.log(err);
  } )
  res.redirect("/admin");
  //console.log(req.query.sessionId);
});



module.exports = router;
