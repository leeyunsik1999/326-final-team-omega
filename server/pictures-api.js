'use strict';

import { readFileSync, readdirSync, writeFileSync, existsSync, unlinkSync, renameSync, mkdirSync} from 'fs';
import { parse}  from "path";
import { database, events, eventList, images, user, counters} from './server.js';
import * as userApi from './user-api.js';
import { ObjectId } from 'mongodb';

// ##############################################################################################
// ######################################## MongoDB APIs ########################################
// ##############################################################################################

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
export async function createUserImageHandler(req, res) {
  const username = req.params.user;
  const date = req.params.date;
  const img = req.file;
  const caption = req.body.caption;
  const name = req.body.name;

  if (img === undefined) {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('No image was uploaded.');
    return;
  }

  // Limit input to only jpg format.
  if (parse(img.originalname).ext === '.jpg') {
    if (userApi.userExists(username)) {
      try {
        await createUserImage(username, img, date, caption, name);
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('Picture added!');
      } catch (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Internal server error');
      }
    }
    else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('User does not exist');
    }
  } else {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('Unsupported image file type.');
  }

  deleteFileIfExists(img.path);
}


// - /user/id/date/images/delete
//   - DELETE request to delete an image.
//   - Should delete image from the server. Also delete it from the appropriate date.
export async function deleteUserImageHandler(req, res) {
  const username = req.params.user;
  const pictureId = req.params.id;

  try {
    await deleteUserImage(username, pictureId);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Picture deleted.');
  }
  catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /user/id/images/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
export async function updateUserImageHandler(req, res) {
  const username = req.params.user;
  const pictureId = req.params.id;
  const caption = req.body.caption;
  const name = req.body.name;

  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    await updateImageDetails(pictureId, name, caption);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Picture details updated!');
  }
  catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /user/id/images/caption/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
export async function updateUserImageCaptionHandler(req, res) {
  const username = req.params.user;
  const pictureId = req.params.id;
  const caption = req.body.caption;

  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    await updateImageCaption(pictureId, caption);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Picture caption updated!');
  }
  catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /user/id/images/name/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
export async function updateUserImageNameHandler(req, res) {
  const username = req.params.user;
  const pictureId = req.params.id;
  const name = req.body.name;

  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    await updateImageName(pictureId, name);
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Picture name updated!');
  }
  catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /user/images/details
//   - Should return a list of details {path, name, caption) for images of that user
//   - Return the array of details within the JSON value of the key "images".
export async function getUserImageDetailsHandler(req, res) {
  const username = req.params.user;
  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    const details = await getAllImagesForAUser(username);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    const paths = {
      images: details
    };
    res.end(JSON.stringify(paths));
  } catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /user/id/date/images
//   - Should return the list of images that the user has data for on that day.
//   - Return the array of "images" within the JSON value of the key "day" as passed in by API.
export async function getUserImagesByDateHandler(req, res) {
  const username = req.params.user;
  const date = req.params.date;

  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    const images = await getUserImagesByDate(username, date);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    const pictureDates = {};
    const dateStr = date.toString();
    pictureDates[dateStr] = images;
    res.end(JSON.stringify(pictureDates));
  } catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}

// - /images/user/id
//   - Should return the path to the image for a specific user with the given id. 404 not found if it doesn't exist.
//   - Return the path to image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/user/date/1.jpg)
export async function getUserImageHandler(req, res) {
  const username = req.params.user;
  const pictureId = req.params.id;

  if (!userApi.userExists(username)) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('User does not exist');

    return;
  }

  try {
    const image = await getUserImage(username, pictureId);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(image.path));
  } catch (err) {
    console.log(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Internal server error.');
  }
}


// ##################################################
// ################ Helper Functions ################
// ##################################################

async function userHasImages(username) {
  return await getAllImagesForAUser(username).length > 0;
}

// Get all images for a user.
async function getImagePathsForAllImagesForAUser(username) {
  const images = getAllImagesForAUser(username);
  const imagePaths = [];

  for (let i = 0; i < images.length; i++) {
    imagePaths.push(images[i].path);
  }

  return imagePaths;
}

// Get all images for a user.
async function getAllImagesForAUser(username) {
    const userId = await userApi.getUserId(username);
    if (userId === null) {
      throw new Error(`User (${username}) does not exist.`);
    }

    return await images.find({"userID": userId}).toArray();
}

// Get all images for a user for a specific date.
async function getUserImagesByDate(username, date) {
    const userId = await userApi.getUserId(username);
    if (userId === null) {
      throw new Error(`User (${username}) does not exist.`);
    }

    return await images.find({"userID": userId, "date": date}).toArray();
}

// Get an image from a user based on its ID
async function getUserImage(username, id) {
  const userId = await userApi.getUserId(username);
  if (userId === null) {
    throw new Error(`User (${username}) does not exist.`);
  }

  return await images.findOne({"userID": userId, "_id": id}).toArray();
}

// Delete all images for a user.
async function deleteUserPictures(username) {
  const userId = await userApi.getUserId(username);
  if (userId === null) {
    throw new Error(`User (${username}) does not exist.`);
  }

  const imgs = await images.find({"userID": userId}).toArray();

  const imgPaths = [];
  for (let i = 0; i < imgs.length; i++) {
    imgPaths.push(imgs[i].path);

  }

  await images.deleteMany({"userID": userId});

  return imgPaths
}

// Delete all images for a user for a specific date.
async function deleteUserPicturesByDate(username, date) {
  const userId = await userApi.getUserId(username);
  if (userId === null) {
    throw new Error(`User (${username}) does not exist.`);
  }

  const imgs = await images.find({"userID": userId}).toArray();

  const imgPaths = [];
  for (let i = 0; i < imgs.length; i++) {
    imgPaths.push(imgs[i].path);

  }

  await images.deleteMany({"userID": userId, "date": date});

  return imgPaths
}

// Delete an image from the database for a user based on its ID.
async function deleteUserImage(username, id) {
  const userId = await userApi.getUserId(username);
  if (userId === null) {
    throw new Error(`User (${username}) does not exist.`);
  }

  const imgID = new ObjectId(id);
  try {
    const deletedImg = await images.findOneAndDelete({"_id": imgID});
    // Return the path to the image to be deleted.
    deleteFileIfExists(`../client/images/user_images/${imgID}.jpg`);
  } catch (err) {
    throw new Error(`Failed to delete image ${id} for user ${username} from DB: ${err.toString()}`);
  }
}

// Create a new image in the database for a user. No guarantee that the image will be moved .
async function createUserImage(username, img, date, caption, name) {
  const userId = await userApi.getUserId(username);
  if (userId === null) {
    throw new Error(`User (${username}) does not exist.`);
  }

  // Get an id from Mongo.
  const objID = new ObjectId();
  const path = `../client/images/user_images/${objID.toString()}.jpg`;
  try {
    renameSync(img.path, path);
  } catch (err) {
    throw new Error('Could not rename image: ', err.toString());
  }

  const result = await images.insertOne({
    "_id": objID,
    "userID": userId,
    "path": path,
    "date": date,
    "caption": caption,
    "name": name
  });

  return result.insertedId;
}

async function updateImageName(id, name) {
  const imgID = new ObjectId(id);
  await images.updateOne({"_id": imgID}, {$set: {"name": name}});
}

async function updateImageCaption(id, caption) {
  const imgID = new ObjectId(id);
  await images.updateOne({"_id": imgID}, {$set: {"caption": caption}});
}

async function updateImageDetails(id, name, caption) {
  const imgID = new ObjectId(id);
  await images.updateOne({"_id": imgID}, {$set: {"name": name, "caption": caption}});
}

// Move the file if it exists.
function moveFileIfExists(src, dest) {
  if (existsSync(src)) {
    renameSync(src, dest);
  }
}

// Create a dir if it doesn't exists.
function createDirIfDNE(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

// Delete the file if it exists.
function deleteFileIfExists(path) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}
