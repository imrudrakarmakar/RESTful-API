//jshint esversion:6

// required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// create new app using express
const app = express();

app.set("view engine", "ejs");

// Body Parser used to parse requests
app.use(bodyParser.urlencoded({
    extended: true
}));

// public directry to store static files eg. photos, html etc
app.use(express.static("public"));

// connect with mongoDB server
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

// create mongoDB schema
const articleSchema = {
    title: String,
    content: String
};

// model name. mongoose will automatically convert Article to artiles.
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////// Request Targetting all Articles ////////////////////////////////////////////

// using Routing methods https://expressjs.com/en/guide/routing.html
app.route("/articles")
    // Get request
    .get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    // Post request
    .post(function(req, res) {
        // Create new article from post request
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err) {
            if(!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    // Delete all article from delete request
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if(!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////////////// Request Targetting a specific Articles /////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, foundAticle) {
            if (foundAticle) {
                res.send(foundAticle);
            } else {
                res.send("No article matching that title was found.")
            }
        });
    })
    .patch(function(req, res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err) {
                    res.send("Successfully updates article");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err) {
                    res.send("Successfully deleted the article");
                } else {
                    res.send(err);
                }
            }
        );
    });

// listen to port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
});