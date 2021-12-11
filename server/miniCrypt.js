'use strict';
/*
  DISCLAIMER
  Implementing cryptographically sound behavior in software is both very important and very hard.
  As such, in practice you should take great caution and be extra certain of what you're doing.
  Given this, it's best to rely on existing code that has been battle-tested and vetted by those knowledgeable.

  Node.js provides a native cryptography module, by the name 'crypto'.
  This is essentially a JS wrapper around OpenSSL, a widely used and longstanding library written primarily in C that provides a vast array of cryptographic functions.

  If you'd like to learn more about the theory and maths behind cryptography, then take 466 next semester. Great professor.
 */
//const c = require('crypto');

import * as c from 'crypto';

export class MiniCrypt{

  constructor(its = 1e5, keyL = 64, saltL = 16, digest = 'sha256') {
    this.its = its;
    this.keyL = keyL;
    this.saltL = saltL;
    this.digest = digest;
  }
  hash = function (pw) {
    const salt = c.randomBytes(this.saltL).toString('hex'), // get our new salt for this pw
      hash = c.pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest).toString('hex'); // hash the pw
    return [salt, hash]; // return the pair for safe storage
  };
  check = function (pw, salt, hash) {
    return c.timingSafeEqual(c.pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest), Buffer.from(hash, 'hex'));
  };
}