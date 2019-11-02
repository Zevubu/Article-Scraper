require('dotenv').config();
const express = require("express");
const logger = require("morgan");
const exphbs = require("express-handlebars");


const PORT = process.env.PORT || 3000;

const app = express();

// app will
app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(express.static("public"));

// setting up 
app.set('views', './views')
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
require("./routes/apiRoutes")(app);

app.listen(PORT, function (){
    console.log("listening on port: " + PORT);
});
