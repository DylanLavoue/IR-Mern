const express = require("express");
const router = express.Router();

const messageCtrl = require("../controllers/message");
const auth = require('../middleware/auth');


router.route("/:chatId").get(auth, messageCtrl.allMessages);
router.route("/").post(auth, messageCtrl.sendMessage);

module.exports = router;