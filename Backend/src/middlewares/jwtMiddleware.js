const jwt = require("jsonwebtoken");

const formatResponse = (success,  message = "") => ({
    success,
    message
  });

function jwtTokenAuthentication(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    // chekc if token is provided
    if (!token) {
        return res.status(401).json(formatResponse(false, "No token provided"));
    }

    // decoding the token
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json(formatResponse(false, "Invalid token"));
        }
        req.user = user;
        next();
    });


}

module.exports = {
    jwtTokenAuthentication
};