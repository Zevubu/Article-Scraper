const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cheerio = require("cheerio");
const axios = require("axios");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));

