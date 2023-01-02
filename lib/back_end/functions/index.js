// 'use strict';

const loadFunctions = require("firebase-function-tools");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const config = functions.config();

// functions.logger.log(config);
admin.initializeApp();
loadFunctions(__dirname, exports, true);
