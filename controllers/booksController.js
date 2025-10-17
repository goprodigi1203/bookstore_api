const {
    Book,
    validateCreateBook,
    validateUpdateBook
} = require("../models/Book");
const asyncHandler = require("express-async-handler");

module.exports.getAllBooks = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    let books;

    if (minPrice && maxPrice) {
        books = await Book.find({
            price: { $gte: minPrice, $lte: maxPrice },
        }).populate("author", ["_id", "firstName", "lastName"])
    } else {
        books = await Book.find().populate("author", ["_id", "firstName", "lastName"])
    }

    res.status(200).json(books)
})

module.exports.getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: `Book with id ${req.params.id} not found !` })
    }
})

module.exports.addNewBook = asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
    });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
});

module.exports.updateBookById = asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover,
        }
    }, { new: true })

    res.status(200).json(updatedBook);
})

module.exports.deleteBookById = asyncHandler(async (req, res) => {
    const findBook = await Book.findById(req.params.id);
    if (findBook) {
        await Book.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Book deleted successfully !" })
    } else {
        return res.status(404).json({ message: "Book not found !" })
    }
})