const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const port = process.env.port || 8000;

const app = express();
/* ------Using redis--------- 
// FIRST, Setup the "Redis server" on you PC.
// SECOND, npm install redis connect-redis express-session
const redis = require('redis');
// Initialize store
const RedisStore = require('connect-redis').default;
// Initialize client
const redisClient = redis.createClient({
    legacyMode: true,
    host:'redis-server',
    port: 6379
})
redisClient.connect().catch(console.error);
--------------- */
const MemoryStore = require('memorystore')(session);
// If you want access to the MemoryStore interface for that module,
// then you just have to save the instance to your own variable
const memorystore = new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    //store: new RedisStore({ client: redisClient }),
    //http://www.senchalabs.org/connect/session.html
    store: memorystore,
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

// app.get("/admin", (req, res) => {
//   memorystore.all((err, sessions) => {
//         if(err) console.log(err);
//         else { console.log(sessions)}
//   });
// });

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});