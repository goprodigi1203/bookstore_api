const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRETKEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid Token !" });
        }
    } else {
        res.status(401).json({ message: "No token provided !" })
    }
}

function verifyTokenAdminAndUserHimSelf(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed !" });
        }
    })
}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed ! Only Admin allowed." });
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAdminAndUserHimSelf,
    verifyTokenAndAdmin
}