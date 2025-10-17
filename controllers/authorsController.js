
const asyncHandler = require("express-async-handler");

const {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
} = require("../models/Author");

module.exports.getAllAuthors = async (req, res) => {
    try {
        const { pageNumber, itemsPerPage } = req.query;
        const authorsList = await Author.find()
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json(authorsList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error !" })
    }
}

module.exports.getAuthorsById = asyncHandler(async (req, res) => {
    const foundedAuthor = await Author.findById(req.params.id);
    if (foundedAuthor) {
        res.status(200).json(foundedAuthor);
    } else {
        res.status(404).json({ message: `Author with ID ${req.params.id} not found` });
    }
});

module.exports.addNewAuthor = asyncHandler(async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image
    });

    const addedAuthor = await author.save();
    res.status(201).json(addedAuthor);
});

module.exports.updateAuthorById = asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image,
        }
    }, { new: true })

    res.status(200).json(updatedAuthor);
});

module.exports.deleteAuthorById = asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
        await Author.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Author deleted successfully !" })
    } else {
        return res.status(404).json({ message: "Author not found !" })
    }
});