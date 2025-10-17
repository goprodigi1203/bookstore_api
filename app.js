const express = require('express');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errors');

require('dotenv').config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/books", require("./routes/books"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});