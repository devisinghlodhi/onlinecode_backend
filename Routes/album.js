var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
const albumr = require("../Controllers/album");
const forgotPass = require("../Controllers/forgotpass")
const Auth = require("../Middleware/auth");

router.post("/createaccount", albumr.signup);
router.post("/login", albumr.login);
router.post("/logout", Auth, albumr.logout);
router.post("/forgot", forgotPass.sendforgotlink);
router.post("/verifyemailtoken", forgotPass.verifyemailtoken);
router.post("/forgotchangepassword", forgotPass.forgotchangepassword);


router.post("/alreadylogincheck", albumr.alreadylogin);
router.post("/run", albumr.runprogram);
router.get("/status", albumr.status);


// router.get("/GetAllalbums", albumr.getallalbums);
// router.get("/GetAlbums/:id", albumr.albumsget);
// router.put("/UpdateAlbums/:id", albumr.albumsupdate);
// router.put("/UpdateOneAlbums/:id", albumr.albumsupdateone);
// router.delete("/DeleteAlbums/:id", albumr.albumsdelete);
// router.delete("/DeleteOneAlbums/:id", albumr.albumsdeleteone);

module.exports = router;


