const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllBooks, getBookById, addNewBook, updateBookById, deleteBookById } = require("../controllers/booksController");

router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, addNewBook);

router
    .route("/:id")
    .get(getBookById)
    .put(verifyTokenAndAdmin, updateBookById)
    .delete(verifyTokenAndAdmin, deleteBookById);

module.exports = router;