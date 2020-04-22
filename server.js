const express = require("express");
const app = express();
const shortid = require("shortid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [] }).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    name: "I love CodersX."
  });
});
// books
app.get("/books", (req, res) => {
  res.render("books/index", {
    books: db.get("books").value()
  });
});
// books search
app.get("/books/search", (req, res) => {
  var q = req.query.q;
  var matchedBooks = db
    .get("books")
    .value()
    .filter(book => book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1);
  res.render("books", {
    books: matchedBooks,
    question: q
  });
});
//books create
app.get("/books/create", (req, res) => {
  res.render("books/create");
});
app.post("/books/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("books")
    .unshift(req.body)
    .write();
  res.redirect("/books");
});
//books detelte
app.get("/books/:id/delete", (req, res) => {
  var id = req.params.id;
  db.get("books")
    .remove({ id: id })
    .write();
  res.redirect("/books");
});
//books update
app.get("/books/:id/update", (req, res) => {
  db.read();
  var id = req.params.id;
  var book = db
    .get("books")
    .find({ id: id })
    .value();
  res.render("books/editUpdate", {
    book: book
  });
});
app.post("/books/:id/update", (req, res) => {
  db.read();
  var id = req.params.id;
  db.get("books")
    .find({ id: id })
    .assign({ title: req.body.title })
    .assign({ description: req.body.description })
    .write();
  res.redirect("/books");
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
