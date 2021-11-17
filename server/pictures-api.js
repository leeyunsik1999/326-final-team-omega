'use strict';

import { readFileSync, readdirSync, writeFileSync, existsSync, unlinkSync, renameSync} from 'fs';
import { parse}  from "path";
import { picturesApi } from './server.js';

class PicturesApi {
  constructor() {
    this.userPictures = new Map();
    this.picturesPath = '../client/images/user_images';
    createDirIfDNE(this.picturesPath);
  }

  addUser(userId) {
    const userPics = new UserPictures(userId);
    this.userPictures.set(userId, userPics);
  }

  hasUser(userId) {
    return this.userPictures.has(userId);
  }

  deleteUser(userId) {
    this.userPictures.delete(userId);
  }

  getUserPictures(userId) {
    if (this.userPictures.has(userId)) {
      return this.userPictures.get(userId);
    }

    return null;
  }
}

class UserPictures {
  constructor(userId) {
    this.userId = userId;
    this.userPicturesPath = `../client/images/user_images/${userId}`;
    this.pictures = new Map();

    createDirIfDNE(this.userPicturesPath);
    this.loadPictures();
  }

  // Delete all pictures for this user.
  deleteUserPictures() {
    const dateFolders = readdirSync(this.userPicturesPath);

    dateFolders.forEach(dateFolder => {
      const files = readdirSync(`${this.userPicturesPath}/${dateFolder}`);

      files.forEach(file => {
        unlinkSync(`${this.userPicturesPath}/${dateFolder}/${file}`);
      });

      unlinkSync(`${this.userPicturesPath}/${dateFolder}`);
    });

    unlinkSync(this.userPicturesPath);
  }

  // Add the picture to the map.
  addPicture(picture) {
    this.pictures.set(picture.pictureId, picture);
  }

  // See if the user has the specified picture.
  hasPicture(pictureId) {
    return this.pictures.has(pictureId);
  }

  // Get a specific picture for this user based on the picture's id.
  getPicture(pictureId) {
    if (this.pictures.has(pictureId)) {
      return this.pictures.get(pictureId);
    }

    return null;
  }

  // Get the details for all pictures for this user.
  getAllDetails() {
    const images = [];

    for (let picture of this.pictures.values()) {
      const details = {
        pictureId: picture.pictureId,
        caption: picture.caption,
        path: picture.picturePath,
      }

      images.push(details);
    }

    return images;
  }

  // Get the picture ids for this user under the specified date.
  getPicturesByDate(date) {
    const dateStr = date.toString();
    let pictureDates = {};
    pictureDates[dateStr] = [];

    for (let picture of this.pictures.values()) {
      if (picture.pictureDate === date) {
        pictureDates[dateStr].push(picture.pictureId);
      }
    }

    return pictureDates;
  }

  // Delete the specified picture for a user.
  deletePicture(pictureId) {
    if (this.pictures.has(pictureId)) {
      const picture = this.pictures.get(pictureId);
      picture.deletePicture();
      this.pictures.delete(pictureId);
    }
  }

  // Create a new picture for a user.
  createPicture(pictureId, date, img, filePath) {
    createDirIfDNE(`${this.userPicturesPath}/${date}`);
    moveFileIfExists(img.path, filePath);
    const picture = new Picture(this.userId, pictureId, filePath, date);
    this.pictures.set(picture.pictureId, picture);
  }

  // Load all pictures for this object.
  loadPictures() {
    let files = [];
    this.pictures = new Map(); // Reset pictures

    const dateFolders = readdirSync(this.userPicturesPath);

    dateFolders.forEach(dateFolder => {
      const date = parse(dateFolder).name;
      files = readdirSync(`${this.userPicturesPath}/${dateFolder}`);

      files.forEach(file => {
        // Skip non picture files
        if (!file.endsWith('.jpg' || !file.endsWith('.png'))) {
          return;
        }

        let picture = new Picture(this.userId, parse(file).name, `${this.userPicturesPath}/${dateFolder}/${file}`, date);
        this.pictures.set(picture.pictureId, picture);
      });
    });
  }
}

class Picture {
  constructor(userId, pictureId, picturePath, date) {
    this.userId = userId;
    this.pictureId = pictureId;
    this.picturePath = picturePath;
    this.captionFile = `${this.picturePath}-caption.txt`;
    this.nameFile = `${this.picturePath}-name.txt`;
    this.pictureDate = date;
    this.name = "";
    this.caption = "";
    this.loadPictureDetails();
  }

  // Delete the picture and its info.
  deletePicture() {
    deleteFileIfExists(this.picturePath);
    deleteFileIfExists(this.captionFile);
    deleteFileIfExists(this.nameFile);
  }

  // Set the caption for this picture.
  setPictureCaption(caption) {
    this.caption = caption;
    writeFileSync(this.captionFile, this.caption);
  }

  // Set the name for this picture.
  setPictureName(name) {
    this.name = name;
    writeFileSync(this.nameFile, this.name);
  }

  // Get the path to the picture as an object w/ "path" as the key.
  getPicturePath() {
    return {
      path: this.picturePath,
    }
  }

  // Get the id of the picture.
  getPictureId() {
    return this.pictureId;
  }

  // Get the user id of the picture.
  getUserId() {
    return this.userId;
  }

  // Load the details for this picture into the object.
  loadPictureDetails() {
    if (existsSync(this.captionFile)) {
      this.caption = readFileSync(this.captionFile, 'utf8');
    } else {
      this.caption = '';
      writeFileSync(this.captionFile, this.caption);
    }
    if (existsSync(this.nameFile)) {
      this.name = readFileSync(this.nameFile, 'utf8');
    } else {
      this.name = '';
      writeFileSync(this.nameFile, this.name);
    }
  }

  // Write the caption & name for this picture to the file system.
  writePictureDetails() {
    writeFileSync(this.captionFile, this.caption);
    writeFileSync(this.nameFile, this.name);
  }
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

export function initializePictureObjects() {
  const picturesApi = new PicturesApi();
  const userId = 'username';
  picturesApi.addUser(userId);
  return picturesApi;
}

// - /images/user/id
//   - Should return the path to the image for a specific user with the given id. 404 not found if it doesn't exist.
//   - Return the path to image pointed at by the id (id.jpg-- for example, image id 1 would point to /images/user/date/1.jpg)
export function getUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;

  if (picturesApi.hasUser(userId)) {
    if (picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(picturesApi.getUserPictures(userId).getPicture(pictureId).getPicturePath()));
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Picture not found');
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('User not found');
  }
}

// - /user/id/date/images/create
//   - POST request to create a new image.
//   - Should add image to the day's image list, and upload image to images directory with appropriate id.
export function createUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  const date = req.params.date;
  const img = req.file;
  const caption = req.body.caption;
  const name = req.body.name;

  if (parse(img.originalname).ext === '.jpg' || parse(img.originalname).ext === '.png') {
    if (picturesApi.hasUser(userId)) {
      if (!picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
        const filePath = `${picturesApi.getUserPictures(userId).userPicturesPath}/${date}/${pictureId}${parse(img.originalname).ext}`;
        picturesApi.getUserPictures(userId).createPicture(pictureId, date, img, filePath);
        picturesApi.getUserPictures(userId).getPicture(pictureId).setPictureCaption(caption);
        picturesApi.getUserPictures(userId).getPicture(pictureId).setPictureName(name);
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('Picture created');
      } else {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        res.end('Picture already exists');
      }
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('User not found');
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Unsupported image file type.');
  }

  deleteFileIfExists(img.path);
}

// - /user/id/date/images
//   - Should return the list of images that the user has data for on that day.
//   - Return the array of "images" within the JSON value of the key "day" as passed in by API.
export function getUserImagesByDate(req, res) {
  const userId = req.params.user;
  const date = req.params.date;

  if (picturesApi.hasUser(userId)) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(picturesApi.getUserPictures(userId).getPicturesByDate(date)));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('User not found');
  }
}

// - /user/images/details
//   - Should return a list of details {path, name, caption) for images of that user
//   - Return the array of details within the JSON value of the key "images".
export function getUserImageDetails(req, res) {
  const userId = req.params.user;
  const date = req.params.date;

  if (picturesApi.hasUser(userId)) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    const paths = {
      images: picturesApi.getUserPictures(userId).getAllDetails(),
    }
    res.end(JSON.stringify(paths));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('User not found');
  }
}

// - /user/id/date/images/update
//   - PUT request to update an image's name or caption. (Since image id is unique per user, this is the same as /user/id/date/images/update).
export function updateUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  const caption = req.body.caption;
  const name = req.body.name;

  if (picturesApi.hasUser(userId)) {
    if (picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
      picturesApi.getUserPictures(userId).getPicture(pictureId).setPictureCaption(caption);
      picturesApi.getUserPictures(userId).getPicture(pictureId).setPictureName(name);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Picture updated');
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Picture not found');
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('User not found');
  }
}

// - /user/id/date/images/delete
//   - DELETE request to delete an image.
//   - Should delete image from the server. Also delete it from the appropriate date.
export function deleteUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  if (picturesApi.hasUser(userId)) {
    if (picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
      picturesApi.getUserPictures(userId).deletePicture(pictureId);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Picture deleted');
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Picture not found');
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('User not found');
  }
}
