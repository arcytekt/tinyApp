const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.use(cookieParser());

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const defaultUsername = "Guest";

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.username = req.cookies.username || defaultUsername;
  next();
});

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;

  if (urlDatabase[id]) {
    urlDatabase[id] = updatedLongURL;
    res.redirect(`/urls/${id}`);
  } else {
    res.status(404).send("URL not found");
  }
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate a new short URL
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL; // Save to the urlDatabase
  res.redirect(`/urls/${shortURL}`); // Redirect to the new URL show page
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  // Check if URL exists in urlDatabase
  if (urlDatabase[id]) {
    // If yes - delete
    delete urlDatabase[id];
    res.redirect("/urls"); // Redirect to main page
  } else {
    res.status(404).send("URL not found"); // If URL doesn't exist - return 404
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});