require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { createUser } = require("./controllers/userController");

const serverAddress = process.env.ADDRESS || "127.0.0.1";
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/sign-up", (_req, res) => {
    res.render("signup");
});
app.post("/sign-up", createUser);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(port, serverAddress, () => console.log(`Listening on ${serverAddress}:${port}`));
