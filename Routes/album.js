var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
const albumr = require("../Controllers/album");
const Auth = require("../Middleware/auth");

router.post("/createaccount", albumr.signup);
router.post("/login", albumr.login);
router.post("/alreadylogincheck", Auth, albumr.alreadylogin);
router.post("/run", albumr.runprogram);
router.get("/status", albumr.status);


// router.get("/GetAllalbums", albumr.getallalbums);
// router.get("/GetAlbums/:id", albumr.albumsget);
// router.put("/UpdateAlbums/:id", albumr.albumsupdate);
// router.put("/UpdateOneAlbums/:id", albumr.albumsupdateone);
// router.delete("/DeleteAlbums/:id", albumr.albumsdelete);
// router.delete("/DeleteOneAlbums/:id", albumr.albumsdeleteone);



module.exports = router;
