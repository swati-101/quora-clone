require("dotenv").config();
const PORT = process.env.PORT || 8080;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Post = require("./models/post");

const app = express();

// Database Connection
const dbURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quoraClone";
mongoose.connect(dbURL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Error:", err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// 1. READ: (Home Page)
app.get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render("index", { posts });
});

// 2. CREATE
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// 3. CREATE
app.post("/posts", async (req, res) => {
    const { username, content } = req.body;
    await Post.create({ username, content });
    res.redirect("/posts");
});

// 4. READ
app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("show", { post });
});

// 5. UPDATE
app.get("/posts/:id/edit", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render("edit", { post });
});

// 6. UPDATE
app.patch("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await Post.findByIdAndUpdate(id, { content });
    res.redirect("/posts");
});

// 7. DELETE
app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect("/posts");
});

// Root Route
app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` );
});