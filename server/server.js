'use strict';
import * as fs from 'fs';

import * as picApi from './pictures-api.js';
//import * as passport from 'passport';
//import * as passport_local from 'passport-local';

import * as path from 'path';

import passport from 'passport';
import * as passport_local from 'passport-local';

import express from 'express';
import expressSession from 'express-session';
import multer from 'multer';
import bodyParser from 'body-parser';

import { MongoClient } from 'mongodb';

import { MiniCrypt } from './miniCrypt.js';

const mc = new MiniCrypt();



const LocalStrategy = passport_local.Strategy;// User/password strategy

// Loading DB connection
let secrets;
let password;

if (!process.env.PASSWORD) {
    secrets = JSON.parse(fs.readFileSync("secrets.json"));
    password = secrets["password"];
} else {
    password = process.env.PASSWORD;
}

const uri = `mongodb+srv://dbUser:${password}@hw10cluster.kt0zy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export let database, events, eventList, images, user, counters;

// Initializing connection + error checking
(async () => {
    // DB connection part
    try {
        await client.connect((err, db) => {
            if (err !== null) {
                console.log("Database connection successful!");
            } else {
                console.log(err);
            }
        });
    } catch (e) {
        console.log("Database connection threw error:");
        console.log(e);
    }

    function gracefulShutdown() {
        client.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    }

    // This will handle process.exit():
    process.on('exit', (code) => {
        console.log(`Exit code: ${code}`);
        gracefulShutdown();
    });

    // This will handle kill commands, such as CTRL+C:
    process.on('SIGINT', (code) => {
        console.log(`Exit code: ${code}`);
        gracefulShutdown();
    });

    process.on('SIGTERM', (code) => {
        console.log(`Exit code: ${code}`);
        gracefulShutdown();
    });

    // Database
    database = client.db("habituall");

    // Collections list
    eventList = database.collection("eventList");
    events = database.collection("events");
    images = database.collection("images");
    user = database.collection("user");
    counters = database.collection("counters");

})();

const upload = multer({ dest: '../client/uploads/' });
const app = express();

// express session config
const session = {
    secret: process.env.EXPRESS_HASH || JSON.parse(fs.readFileSync("secrets.json"))["hash"],
    resave: false,
    saveUninitialized: false
};

// Passport config for app

const strategy = new LocalStrategy(
    async (username, password, done) => {
        user.findOne({ 'username': username }).then(document => {
            // Invalid username
            if (document === null) {
                // no such user
                return done(null, false, { 'message': 'Wrong username' });
            }
            // Invalid password
            else if (!mc.check(password, document["password"][0], document["password"][1])) {
                // invalid password
                return done(null, false, { 'message': 'Wrong password' });
            }
            return done(null, username);
        });
    }
);

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

// Picture API shared object
const port = process.env.PORT || 8080;

// Env variable for client directory, setting based on local or heroku environment

const clientDir = process.env.CLIENTDIR || '../client';
// Making files in client available to use from (domain)/ as if it was (domain)/client/
app.use(express.static(clientDir));
app.use(express.json()) // To parse JSON bodies.
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.bodyParser());

// Routes
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/login');
    }
}

// IMAGE routes
// - /images/id
//   - Should return the path to the image with the given id. 404 not found if it doesn't exist.
//   - Return the image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/1.jpg)
// app.get('/images/:id', getUserImageRoute(req, res));

// - /images/user/id
//   - Should return the path to the image for a specific user with the given id. 404 not found if it doesn't exist.
//   - Return the path to image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/user/date/1.jpg)
app.get('/images/:user/:id', function (req, res) { picApi.getUserImageHandler(req, res) });

// - /user/id/date/images
//   - Should return the list of images that the user has data for on that day.
//   - Return the array of "images" within the JSON value of the key "day" as passed in by API.
app.get('/:user/:date/images', function (req, res) { picApi.getUserImagesByDateHandler(req, res) });

// - /user/images
//   - Should return a list of paths for images of that user
//   - Return the array of paths within the JSON value of the key "images".
app.get('/:user/images/details', function (req, res) { picApi.getUserImageDetailsHandler(req, res) });

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
app.post('/:user/:date/images/create', upload.single('img'), function (req, res) { picApi.createUserImageHandler(req, res) });

// - /user/id/images/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
app.put('/:user/:id/images/update', function (req, res) { picApi.updateUserImageHandler(req, res) });

// - /user/id/images/name/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
app.put('/:user/:id/images/name/update', function (req, res) { picApi.updateUserImageCaptionHandler(req, res) });

// - /user/id/images/caption/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
app.put('/:user/:id/images/caption/update', function (req, res) { picApi.updateUserImageCaptionHandler(req, res) });

// - /user/id/images/delete
//   - DELETE request to delete an image.
//   - Should delete image from the server. Also delete it from the appropriate date.
app.delete('/:user/:id/images/delete', function (req, res) { picApi.deleteUserImageHandler(req, res) });

// In the future, when we don't need to reference Data (with databases), we
// can and SHOULD refactor so that these app.gets are instead given a handler.

// LOGIN RELATED APIs

app.get('/login', (req, res) => {
    res.sendFile(`login.html`, { 'root': clientDir });
});

// Login request
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/login'
    })
);
// Register request
app.post('/register', (req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
    (async () => {

        // Queries db for any documents with given username.
        if (await user.find({ "username": username }).count() !== 0) {
            console.log(`Register error: username ${username} already exists`);
            res.status(409);
        } else if (username.length === 0 || password.length === 0) {
            console.log("Username or password too short");
            res.status(406);
        } else {
            user.insertOne({
                "username": username,
                "password": mc.hash(password),
                "theme": 1
            });
            res.status(200);
            console.log("User created");
        }
        res.end();
    })();
});

// THEME RELATED APIs

// Fetch user's theme id
app.get('/user/:id/theme', (req, res) => {
    const id = req.params["id"];
    user.findOne({ '_id': new ObjectId(id) }).then(document => {
        if (document === null) {
            res.status(404);
            console.log(`User not found`);
        } else {
            res.status(200);
            res.json({ "theme": document["theme"] });
            console.log(`Theme for user found`);
        }
    });
});

// Set user's theme ID
// TODO: Update this with database implementation
app.put('/user/:id/theme/set', (req, res) => {
    const username = req.params["id"];
    const theme = req.body["id"];

    // Broken-- need to use database, not data
    if (!(username in data)) {
        res.status(404);
        console.log(`Username ${username} not found`);
    } else if (typeof (theme) !== "number") {
        console.log(`${theme} is INVALID`);
        res.status(400);
    } else {
        res.status(200);
        console.log("Theme successfully overwritten");
        data[username]["theme"] = theme;
    }
    res.end();
});




// DATE related API's

// Fetches dates that user has data for
app.get('/user/:id/date', (req, res) => {
    const username = req.params["id"];

    // Broken-- need to use database, not data
    if (!(username in data)) {
        res.status(404);
        console.log(`Username ${username} not found`);
    } else {
        res.status(200);
        res.json({
            "dates": Object.keys(data[username]["data"])
        })
    }
    res.end();
});


// ERIN
// EVENTS

async function userExists(username) {
    return await user.find({ "username": username }).count() !== 0;
  }
  
  // Helper function to get the userID for a corresponding username.
async function getUserId(username) {
    if (await userExists(username)) {
      const userObject = await user.findOne({"username": username });
      return userObject._id;
    }
    return null;
}
  

//to get all completed events 
// Tested with postman
app.get('/user/:id/events', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            res.status(200);
            const userId = await getUserId(username);
            res.json(await events.find({"userID" : userId}).toArray());
        }
        res.end();
    })();
});

//create a completed event on a specific day used when checkbox is checked off
// Tested with postman
app.post('/user/:id/events', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        // req.body should look like
        // {
        //     eventID: <ObjectId1>,   // id of event that this is an instance of
        //     name: String,           // name of even tthat this is an instance of
        //     month: String,          // Month that this specific event occured in. JAN, FEB, MAR, etc. All caps
        //     day: int32,             // Day that this specific event occured in. 1, 2, 3, 4, etc.
        //     date: String,           // Date that this specific events this is for. Format: YYYY-mm-dd
        // }
        else {
            const document = req.body;
            document["userID"] = await getUserId(username);
            try{
                await events.insertOne(document);
                res.status(200);
                console.log("Event occurence created");
            } catch (e) {
                res.status(500);
                console.log("Err adding event occurence");
                console.log(e);
            }
        }
        res.end();
    })();
});

//removes completed event from the list, happens when a checkbox is unchecked
// tested in postman
app.delete('/user/:id/events', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            try {
                const document = req.body;
                document["userID"] = await getUserId(username);
                await events.findOneAndDelete(document);
                res.status(200);
            }
            catch (e) {
                res.status(500);
                console.log(e);
            }
        }
        res.end();
    })();
});

//get the events completed in a specific month with all details to fill in boxes on monthly page
// Tested with postman
app.get('/user/:id/:month/events', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            res.status(200);
            const userId = await getUserId(username);
            res.json(await events.find({"userID" : userId, "month": req.params.month}).toArray());
        }
        res.end();
    })();
});

//get the completed events for a specific day
// Tested with postman
app.get('/user/:id/:month/:day/events', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            res.status(200);
            const userId = await getUserId(username);
            res.json(await events.find({"userID" : userId, "month": req.params.month, "day": parseInt(req.params.day)}).toArray());
        }
        res.end();
    })();
});

//gets the list of events for that specific month, used to make checklist and load sections for monthly and daily pages
// Tested with postman
app.get('/user/:id/:month/eventList', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            res.status(200);
            const userId = await getUserId(username);
            res.json(await eventList.find({"userID" : userId, "month": req.params.month}).toArray());
        }
        res.end();
    })();
});

// create event that is being tracked for the month
// Tested with postman
app.post('/user/:id/eventList', (req, res) => {
    const username = req.params.id;
    (async () => {
        if(!(await userExists(username))) {
            res.status(404);
            console.log(`Username ${username} not found`);
        }
        else {
            res.status(200);
            const document = req.body;
            document["userID"] = await getUserId(username);
            try{
                eventList.insertOne(document);
                res.status(200);
                console.log("Event created");
            } catch (e) {
                res.status(500);
                console.log("Err adding event");
                console.log(e);
            }
        }
        res.end();
    })();
});




app.get('/user',
    checkLoggedIn,
    (req, res) => {
        res.redirect('/user/' + req.user);
    }
);

app.get('/user/:id/',
    checkLoggedIn,
    (req, res) => {
        if (req.params.id === req.user) {
            res.sendFile(`page.html`, { 'root': clientDir });
        } else {
            res.redirect('/user/');
        }
    }
)

app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
})

// Default route-- redirects to main page if logged in, else to login
app.get("/",
    checkLoggedIn,
    (req, res) => {
        res.redirect('/user');
    }
);

// Route for invalid requests
app.all("*", (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
});
