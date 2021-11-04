'use strict';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';

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
            "20211103":{
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



let server = http.createServer();
server.on('request', async (request, response) => {

    response.end();
});

server.listen(8080);