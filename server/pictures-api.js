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

  addPicture(picture) {
    this.pictures.set(picture.pictureId, picture);
  }

  hasPicture(pictureId) {
    return this.pictures.has(pictureId);
  }

  getPicture(pictureId) {
    if (this.pictures.has(pictureId)) {
      return this.pictures.get(pictureId);
    }

    return null;
  }

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

  deletePicture(pictureId) {
    if (this.pictures.has(pictureId)) {
      const picture = this.pictures.get(pictureId);
      picture.deletePicture();
      this.pictures.delete(pictureId);
    }
  }

  createPicture(pictureId, date, img, filePath) {
    createDirIfDNE(`${this.userPicturesPath}/${date}`);
    moveFileIfExists(img.path, filePath);
    const picture = new Picture(this.userId, pictureId, filePath, date);
    this.pictures.set(picture.pictureId, picture);
  }

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
    this.pictureBuffer = readFileSync(this.picturePath);
    this.name = "";
    this.caption = "";
    this.loadPictureDetails();
  }

  deletePicture() {
    deleteFileIfExists(this.picturePath);
    deleteFileIfExists(this.captionFile);
    deleteFileIfExists(this.nameFile);
  }

  setPictureCaption(caption) {
    this.caption = caption;
    writeFileSync(this.captionFile, this.caption);
  }

  setPictureName(name) {
    this.name = name;
    writeFileSync(this.nameFile, this.name);
  }

  getPictureBuffer() {
    return this.pictureBuffer;
  }

  getPicturePath() {
    return this.picturePath;
  }

  getPictureId() {
    return this.pictureId;
  }

  getUserId() {
    return this.userId;
  }

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

  loadPicture() {
    if (existsSync(this.picturePath)) {
      this.pictureBuffer = readFileSync(this.picturePath);
      this.name = readFileSync(this.nameFile);
    }
  }

  writePictureDetails() {
    writeFileSync(this.captionFile, this.caption);
    writeFileSync(this.nameFile, this.name);
  }
}

function moveFileIfExists(src, dest) {
  if (existsSync(src)) {
    renameSync(src, dest);
  }
}

function createDirIfDNE(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

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

export function getUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  console.log("UserID: " + userId);
  console.log("PictureID: " + pictureId);
  picturesApi.getUserPictures(userId).loadPictures(); // Keep object up to date.
  if (picturesApi.hasUser(userId)) {
    if (picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': picturesApi.getUserPictures(userId).getPicture(pictureId).getPictureBuffer().length
      });
      res.end(picturesApi.getUserPictures(userId).getPicture(pictureId).getPictureBuffer());
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

export function createUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  const date = req.params.date;
  const img = req.file;
  const caption = req.body.caption;
  const name = req.body.name;

  picturesApi.getUserPictures(userId).loadPictures(); // Keep object up to date.
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

export function getUserImagesByDate(req, res) {
  const userId = req.params.user;
  const date = req.params.date;
  console.log("UserID: " + userId);
  console.log("Date: " + date);

  picturesApi.getUserPictures(userId).loadPictures(); // Keep object up to date.

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

export function updateUserImageRoute(req, res) {
  const userId = req.params.user;
  const pictureId = req.params.id;
  const caption = req.body.caption;
  const name = req.body.name;

  if (picturesApi.hasUser(userId)) {
    if (picturesApi.getUserPictures(userId).hasPicture(pictureId)) {
      picturesApi.getUserPictures(userId).getPicture(pictureId).loadPicture(); // Keep object up to date.
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
