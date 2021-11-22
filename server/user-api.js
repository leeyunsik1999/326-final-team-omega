'use strict';

import {database, events, eventList, images, user, counters} from './server.js';

export async function getUser(req, res) {
  const userId = req.params.userId;
  const user = await database.getUser(userId);
  res.json(user);
}

export async function getUserByUsername(req, res) {
  const username = req.params.username;
  const user = await user.getUserByUsername(username);
  res.json(user);
}

// Helper function to see if a user exists.
export async function userExists(username) {
  return await user.find({ "username": username }).count() !== 0;
}

// Helper function to get the userID for a corresponding username.
export async function getUserId(username) {
  if (await userExists(username)) {
    const userObject = await user.findOne({ "username": username });
    return userObject._id;
  }

  return null;
}
