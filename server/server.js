'use strict';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';

import * as picApi from './pictures-api.js';

import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import { dirname } from 'path';

import { MongoClient } from 'mongodb';

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

// Variable to store pre-defined data on
/**
 * Format:
 * keys in the object "data" are usernames.
 * In username: key "password" contains the user's password.
 * ID should be used to query things in the future-- implement this when databases
 */
const data = {
    "username": {
        "id": 1,
        "password": "password",
        "events": [
            "Go to the gym",
            "Go swimming"
        ],
        "theme": 1,
        "data": {
            "20211101": {
                "images": [
                ],
                "events": [
                    {
                        "name": "Go biking",
                        "completed": true
                    }
                ]
            },
            "20211102": {
                "images": [
                    {
                        "id": 1,
                        "name": "gym1",
                        "caption": "Example Caption"
                    }
                ],
                "events": [
                    {
                        "name": "Go to the gym",
                        "completed": true
                    }
                ]
            },
            "20211103": {
                "images": [
                    {
                        "id": 2,
                        "name": "gym2",
                        "caption": "Another example caption"
                    }
                ],
                "events": [
                    {
                        "name": "Go to the gym",
                        "completed": false
                    },
                    {
                        "name": "Go swimming",
                        "completed": false
                    }
                ]
            }
        }
    },
    "user1": {
        "id": 2,
        "password": "asdf1234",
        "events": [
            "Eat breakfast"
        ],
        "theme": 2,
        "data": {
            "20211101": {
                "images": [],
                "events": []
            },
            "20211102": {
                "images": [
                    {
                        "id": 3,
                        "name": "breakfast",
                        "caption": "Example captions"
                    }
                ],
                "events": []
            },
            "20211103": {
                "images": [],
                "events": [
                    {
                        "name": "Eat breakfast",
                        "completed": true
                    }
                ]
            }
        }
    }
};

const upload = multer({ dest: '../client/uploads/' });
const app = express();

// Picture API shared object
const port = process.env.PORT || 8080;

// Env variable for client directory, setting based on local or heroku environment

const clientDir = process.env.CLIENTDIR || '../client';
// Making files in client available to use from (domain)/ as if it was (domain)/client/
app.use(express.static(clientDir));
app.use(express.json()) // To parse JSON bodies.
app.use(bodyParser.urlencoded({ extended: true }));

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

// Login request
app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log(`U: ${username}, P: ${password}`);

    // Calling DB for the document with username.
    user.findOne({ 'username': username }).then(document => {
        // Invalid username
        if (document === null) {
            console.log("username not found");
            res.status(404);
        }
        // Invalid password
        else if (document["password"] !== password) {
            console.log(`incorrect password-- expected ${document["password"]}`);
            res.status(401);
        } else {
            res.status(200);
            // Now returns userID based off of the unique id identifier.
            res.json({ "id": document["_id"].toString() });
        }
        res.end();
        /*
        Old implementation using data
        // Invalid username
        if (!(username in data)) {
            console.log("username not found");
            res.status(404);
        }
        // Invalid password
        else if (data[username]["password"] !== password) {
            console.log(`incorrect password-- expected ${data[username]["password"]}`);
            res.status(401);
        } else {
            res.status(200);
            console.log(`${username} logged in`);
            res.json({ "id": data[username]["id"] });
        }
        res.end();
        */
    });
});

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
            /*
            local implementation:

            let temp = {
                "id": Math.floor(Math.random() * (999999 - 3 + 1) + 3),
                "password": password,
                "events": [],
                "theme": 1,
                "data": {}
            };
            data[username] = temp;
            */
            user.insertOne({
                "username": username,
                "password": password,
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
        if (document === null){
            res.status(404);
            console.log(`User not found`);
        } else {
            res.status(200);
            res.json({"theme": document["theme"]});
            console.log(`Theme for user found`);
        }
    });
    /*
    Old implementation
    if (!(username in data)) {
        res.status(404);
        console.log(`Username ${username} not found`);
    } else {
        res.status(200);
        res.json({ "theme": data[username]["theme"] });
        console.log(`Theme for ${username} found`);
    }
    res.end();
    */
});

// Set user's theme ID
// TODO: Update this with database implementation
app.put('/user/:id/theme/set', (req, res) => {
    const username = req.params["id"];
    const theme = req.body["id"];
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

app.get("*", (req, res) => {
    /*
    const __filename = url.fileURLToPath(import.meta.url);
    res.sendFile(dirname(__filename) + "/../client/index.html");
    */
    res.write(fs.readFileSync(`${clientDir}/index.html`));
    res.end();
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
});
