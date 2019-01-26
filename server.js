let port = process.env.PORT || 8000;

const express = require("express");
const app = express();
const path = require("path");
const mongo = require("mongodb").MongoClient;

const validPhone = require(path.join(
  __dirname + "/src/client/app/scripts/verify_phone"
));

const KILL_THE_HITLERS = "src/client/kth";

const mongo_pw = process.env.MPW || require("./mongo_pw.js").password;

let db;
let likes;
let id;
debugger;
// serve the app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/client/index.html"));
});

app.get("/images/:filename", (req, res) => {
  res.sendFile(
    path.join(__dirname + `/src/client/public/images/${req.params.filename}`)
  );
});

app.get("/style", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/client/public/style.css"));
});

// serve the script
app.get("/script", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/client/public/bundle.js"));
});

app.get("/likes", (req, res) => {
  res.json(likes);
});

// post likes to the hosted database
app.post("/click", (req, res) => {
  db.collection("likes").save({ _id: 69420247, likes: ++likes });
  res.json(likes);
});

app.get("/click", (req, res) => {
  res.json(likes);
});

app.get("/call/:phoneNumber", (req, res) => {
  res.redirect(`tel:${validPhone(req.params.phoneNumber)}`);
});

app.get("/payme", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "client", "public", "payme.html"));
});

app.get("/kill_the_hitlers", (req, res) => {
  res.sendFile(path.join(__dirname, KILL_THE_HITLERS, "kill_the_hitlers.html"));
});

app.get("/kth/style", (req, res) => {
  res.sendFile(path.join(__dirname, KILL_THE_HITLERS, "kth_style.css"));
});

app.get("/kth/script", (req, res) => {
  res.sendFile(path.join(__dirname, KILL_THE_HITLERS, "script.js"));
});

mongo.connect(
  `mongodb://liker:${mongo_pw}@ds157278.mlab.com:57278/yetis_first_db`,
  (err, database) => {
    if (err) throw err;
    db = database;
    app.listen(port, () => {
      console.log("listening on " + port);
    });
    db.collection("likes")
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        likes = result[0]["likes"];
      });
  }
);
