const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function(app){
    // home page route
    app.get('/', function(req,res){
        db.Article.fing({saved: false}, function(err,data){
            res.render('home',{home: true, article: data});
        })
    });
    // Saved page route
    app.get('/saved', function(req,res){
        db.Article.find({saved: true}, function(req, res){
            res.render('saved',{home:false, article: data}); 
        })
    });
    // change feild save to true to save to db
    app.put("/api/headlines/:id", function(req, res){
        let saved = req.body.saved == "true";
        if(err){
            db.Article.updateOne({_id: req.body._id},{$set: {saved: true}}, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    return res.send(true);
                }
            });
        }
    });

    app.delete("/api/headlines/:id", function(req, res){
        console.log(`reqbody: ${JSON.stringify(req.params.id)}`)
        db.Article.deleteOne({_id: req.params.id}, function(err,result){
            if(err){
                console.log(err);
            }else {
                return res.send(true)
            };
        });
    });
    // Scraper
    app.get("/api/fetch", function(req,res){
        axios.get("http://www.ubu.com/recent.html").then(function(response){
            const $ = cheerio.load(response.data);

            $('a').each(function(i,element){
                let result ={};

                // adds resulting text to variables.
                result.title = $(this).text();
                result.link = $(this).attr("href");

                // ocreates article object.
                db.Article.create(result)
                    .then(function(dbArticle){
                        console.log(dbArticle);
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            })
            res.send("Scrape Complete")
        })

    })

}