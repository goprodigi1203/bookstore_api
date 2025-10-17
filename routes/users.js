const express = require('express');
const router = express.Router();
const { verifyTokenAdminAndUserHimSelf, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', verifyTokenAndAdmin, getAllUsers);
router
    .route("/:id")
    .get(verifyTokenAdminAndUserHimSelf, getUserById)
    .put(verifyTokenAdminAndUserHimSelf, updateUser)
    .delete(verifyTokenAdminAndUserHimSelf, deleteUser);

module.exports = router;