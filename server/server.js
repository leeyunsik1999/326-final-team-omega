'use strict';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';

import { getUserImageRoute, updateUserImageRoute, deleteUserImageRoute, initializePictureObjects, createUserImageRoute, getUserImagesByDate} from './pictures-api.js';

import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

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
        "theme": 1,
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

const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 8080;

// Picture API shared object
export const picturesApi = initializePictureObjects();
console.log(picturesApi);
console.log(picturesApi.getUserPictures("username"));

// Making files in ../client available to use from (domain)/ as if it was (domain)/client/
app.use(express.static('../client'));
app.use(express.json()) // To parse JSON bodies.
app.use(bodyParser.urlencoded({extended: true}));

// IMAGE routes
// - /images/id
//   - Should return an image buffer with the given id. 404 not found if it doesn't exist.
//   - Return the image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/1.jpg) as an image buffer.
// app.get('/images/:id', getUserImageRoute(req, res));

// - /images/user/id
//   - Should return an image buffer for a specific user with the given id. 404 not found if it doesn't exist.
//   - Return the image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/user/date/1.jpg) as an image buffer.
app.get('/images/:user/:id', function(req, res) {getUserImageRoute(req, res)});

// - /user/id/date/images
//   - Should return the list of images that the user has data for on that day.
//   - Return the array of "images" within the JSON value of the key "day" as passed in by API.
app.get('/:user/:date/images', function(req, res){getUserImagesByDate(req, res)});

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
app.post('/:user/:id/:date/images/create', upload.single('img'), function(req, res){createUserImageRoute(req, res)});

// - /user/id/date/images/update
//   - PUT request to update an image's name or caption.
app.put('/:user/:id/:date/images/update', function(req, res){updateUserImageRoute(req, res)});

// - /user/id/images/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
app.put('/:user/:id/images/update', function(req, res){updateUserImageRoute(req, res)});

// - /user/id/date/images/delete
//   - DELETE request to delete an image.
//   - Should delete image from the server. Also delete it from the appropriate date.
app.delete('/:user/:id/:date/images/delete', function(req, res){deleteUserImageRoute(req, res)});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
