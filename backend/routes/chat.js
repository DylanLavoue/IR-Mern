const express = require("express");
const router = express.Router();

const chatCtrl = require("../controllers/chat");
const auth = require('../middleware/auth');


router.route("/").post(auth, chatCtrl.accessChat);
router.route("/").get(auth, chatCtrl.fetchChats);
router.route("/group").post(auth, chatCtrl.createGroupChat);
router.route("/rename").put(auth, chatCtrl.renameGroup);
router.route("/groupremove").put(auth, chatCtrl.removeFromGroup);
router.route("/groupadd").put(auth, chatCtrl.addToGroup);

module.exports = router;