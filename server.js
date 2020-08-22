// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/students");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Blog = mongoose.model('Blog', {
    title: String,
    shortDescr: String,
    href: String,
});

// Get all blogs
app.get('/api/blogs', function (req, res) {

    console.log("Listing blogs...");

    //use mongoose to get all blogs in the database
    Blog.find(function (err, blogs) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(blogs); // return all blogs in JSON format
    });
});

// Create a blog
app.post('/api/blogs', function (req, res) {

    console.log("Creating blog...");

    Blog.create({
        title: req.body.title,
        shortDescr: req.body.shortDescr,
        href: req.body.href,
        done: false
    }, function (err, blog) {
        if (err) {
            res.send(err);
        }

        // create and return blogs
        Blog.find(function (err, blogs) {
            if (err)
                res.send(err);
            res.json(blogs);
        });
    });

});


// Start app and listen on port 8082
app.listen(process.env.PORT || 8082);
console.log("Blogs server listening on port  - ", (process.env.PORT || 8082));