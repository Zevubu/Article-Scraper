const mongoose = require("mongoose");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true  });

// const connection = mongoose.connection;
// connection.once('open', () =>{
//     console.log("MongoDB database connection established successfully." + MONGODB_URI);
// });

module.exports = function(app){
    // home page route
    app.get('/', function(req,res){
        console.log(`home page check`);
        db.Article.find({saved: false}, function(err,data){
            if(err){
                console.log(`home page routing error:${err}`);
            }else{
                res.render('home',{home: true, article: data});
            }
            
        })
    });
    // Saved page route
    app.get('/saved', function(req,res){
        console.log(`saved page check`);
        db.Article.find({saved: true}, function(err, data){
            if(err){
                console.log(`Saved page routing error:${err}`);
            }else{
                res.render('saved',{home:false, article: data}); 
            }
            
        })
    });
    // change feild save to true to save to db
    app.put("/api/headlines/:id", function(req, res){
        console.log(`change check`);
        let saved = req.body.saved == "true";
        if(saved){
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
    app.get("/api/fetch", function(req, res){
        console.log("scraper check!")
        axios.get("http://www.ubu.com/recent.html").then(function(response){
            const $ = cheerio.load(response.data);

            $('a').each(function(i,element){
                let result ={};
                console.log($(element).text().trim())

                // adds resulting text to variables.
                result.headline = $(element).text();
                result.url = `http://www.ubu.com${$(element).attr("href")}`;

                // checks that the items have text in them then creates in in the db.
                if(result.headline !== '' && result.headline !== "UbuWeb" && result.url !==''){
                    db.Article.findOne({headline: result.headline}, function(err,data){
                        if(err){
                            console.log(err);
                        } else {
                            if(data === null){
                                db.Article.create(result).then(function(dbArticle){
                                    console.log(dbArticle);
                                }).catch(function(err){
                                    console.log(err);
                                });
                            } console.log(data);
                        }
                    });
                }
            });
            res.send("Scrape Complete")
        });
    });
    // notes id retival route
    // NEEDS FURTHER WORK

    app.get("/api/notes/:id", function(req,res){
        console.log(`Note Routes: ${JSON.stringify(req.params.id)}`);
        db.Article.findOne({_id: req.params.id}).populate("note")
         .then(function(dbArticle){
                console.log(`dbArticle: ${dbArticle.note}`)
                res.json(dbArticle.note)
            }).catch(function(err){
                console.log(err)
                res.send(err)
            }) 
    });

    // add a note to the an article
    // NEEDS FURTHER WORK
    app.post("/api/notes", function(req,res){
        console.log("notes add check");
        console.log(`req.body: ${req.body}`);
        db.note.create({ noteText: req.body.noteText })
        .then(function(dbNote){
            console.log(`dbNote: ${dbNote}`);
            return db.Article.findOneAndUpdate({ _id:req.body._headlineID}, { $push: {note:dbNote._id}},
                {new:true})
        }).then(function(dbArticle){
            console.log(`dbArticle: ${dbArticle}`);
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });

    // deleting note from article.
    app.delete("/api/notes/:id", function(req,res){
        console.log(`reqBody: ${JSON.stringify(req.params.id)}`);
        db.note.deleteOne({_id: req.params.id}, function(err, result){
            if(err){
                console.log(err);
            }else{
                return res.send(true);
            }
        });
    });

    // clears all articles from db
    app.get("/api/clear", function(err,res){
        console.log(res.body);
        db.Article.deleteMany({}, function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log(result);
                res.send(true);
            }
        });
    });
};


