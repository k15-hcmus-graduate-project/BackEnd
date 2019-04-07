var jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET_KEY || "QWERTYUIOP";

exports.verifyStaff = async (req, res, next) => {
    var access_token = req.headers["x-access-token"];
    if (access_token) {
        await jwt.verify(access_token, SECRET, async (err, payload) => {
            if (err) {
                console.log(err);
                res.statusCode = 401;
                res.json({
                    code: 401,
                    msg: "INVALID ACCESS TOKEN",
                    error: err
                });
            } else {
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: "NOT FOUND ACCESS TOKEN"
        });
    }
};
