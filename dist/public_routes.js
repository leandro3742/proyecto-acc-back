"use strict";
exports.__esModule = true;
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 *
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
var express_1 = require("express");
var utils_1 = require("./utils");
var actions_1 = require("./actions");
var router = express_1.Router();
// signup route, creates a new user in the DB
router.post('/login', utils_1.safe(actions_1.login));
// router.get('/user', safe(getAllUsers));
router.get('/user/:id', utils_1.safe(actions_1.getUser));
router.post('/user', utils_1.safe(actions_1.createUser));
router.post('/forgotPassword', utils_1.safe(actions_1.forgotPassword));
router["delete"]('/:id', utils_1.safe(actions_1.deleteUser));
exports["default"] = router;
