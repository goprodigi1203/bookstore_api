const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllAuthors, getAuthorsById, addNewAuthor, deleteAuthorById, updateAuthorById } = require("../controllers/authorsController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, addNewAuthor);

router
    .route("/:id")
    .get(getAuthorsById)
    .put(verifyTokenAndAdmin, updateAuthorById)
    .delete(verifyTokenAndAdmin, deleteAuthorById);

module.exports = router;