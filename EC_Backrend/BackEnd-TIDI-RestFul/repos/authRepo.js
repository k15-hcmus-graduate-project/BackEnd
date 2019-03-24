var jwt = require("jsonwebtoken");
var rndToken = require("rand-token");
var moment = require("moment");

var kn = require("../fn/db");

const SECRET = process.env.SECRET_KEY || "QWERTYUIOP";
const AC_LIFETIME = parseInt(process.env.ACCESS_TOKEN_LIFETIME) || 1200; // seconds

exports.generateAccessToken = input => {
    var payload = {
        user: input,
        info: "more info"
    };
    return jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });
};

exports.verifyAccessToken = (req, res, next) => {
    var access_token = req.headers["x-access-token"];
    if (access_token) {
        jwt.verify(access_token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: "INVALID ACCESS TOKEN",
                    error: err
                });
            } else {
                req.token_payload = payload;
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

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
};

exports.getRefreshToken = uid =>
    kn("accounts")
        .select("refreshToken")
        .where("id", uid)
        .first();

exports.insertRefreshToken = (uid, refresh_token) => {
    return kn("accounts")
        .update({
            refreshToken: refresh_token
        })
        .where("id", uid)
        .returning("id");
};

exports.updateRefreshToken = (uid, refresh_token) => {
    return kn("accounts")
        .where("id", uid)
        .update(
            {
                refreshToken: refresh_token
                // write_at: moment().format(process.env.DATETIME_FORMAT)
            },
            [uid]
        );
};

exports.checkRefreshToken = refresh_token =>
    kn("accounts")
        .select("id")
        .where("refresh_token", refresh_token)
        .first();
