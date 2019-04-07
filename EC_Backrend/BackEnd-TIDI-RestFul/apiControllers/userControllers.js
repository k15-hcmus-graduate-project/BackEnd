var express = require("express");
var verifier = require("email-verify");
var userRepo = require("../repos/userRepo");
var authRepo = require("../repos/authRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;

var router = express.Router();

router.get("/", verifyStaff, (req, res) => {
    userRepo
        .list()
        .then(rows => {
            res.json({
                users: rows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/admin", verifyStaff, (req, res) => {
    console.log("admin get: ", req.body);
    userRepo
        .adminList(req.body)
        .then(rows => {
            console.log(rows.length);
            res.json({
                totalItems: rows.length,
                accounts: rows,
                status: "TRUE",
                message: "Get danh sách accounts thành công với số lượng " + rows.length
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json({
                accounts: [],
                status: "FALSE",
                message: "Get danh sách người dùng thất bại. Xin đăng nhập và thử lại."
            });
        });
});

router.post("/admin/add", verifyStaff, (req, res) => {
    console.log("admin add account: ", req.body);
    userRepo
        .getUserByUsername(req.body.username)
        .then(res0 => {
            if (res0) {
                res.json({
                    message: "Username đã tồn tại.",
                    status: "FALSE"
                });
            } else {
                userRepo
                    .getUserByEmail(req.body.email)
                    .then(res1 => {
                        if (res1) {
                            res.json({
                                message: "Email đã tồn tại.",
                                status: "FALSE"
                            });
                        } else {
                            userRepo
                                .add(req.body)
                                .then(res2 => {
                                    if (res2) {
                                        res.json({
                                            status: "TRUE",
                                            message: "Thêm người dùng thành công"
                                        });
                                    } else {
                                        res.json({
                                            status: "FALSE",
                                            message: "Có lỗi khi thêm người dùng. Vui lòng nhập đầy đủ thông tin."
                                        });
                                    }
                                })
                                .catch(err2 => {
                                    res.json({
                                        message: "Có lỗi khi thêm người dùng. Xin thử  lại với thông tin đầy đủ hơn.",
                                        status: "FALSE"
                                    });
                                });
                        }
                    })
                    .catch(err1 => {
                        res.json({
                            status: "FALSE"
                        });
                    });
            }
        })
        .catch(err => {
            res.json({
                status: "FALSE",
                message: "Có lỗi khi thêm người dùng. Xin thử  lại với thông tin đầy đủ hơn."
            });
        });
});
router.post("/", verifyStaff, (req, res) => {
    console.log(req.body);
    userRepo
        .getUserByUsername(req.body.username)
        .then(row => {
            if (row) {
                res.statusCode = 403;
                res.json({
                    code: 403,
                    msg: `Username is already used!`
                });
            } else {
                userRepo.getUserByEmail(req.body.email).then(row => {
                    if (row) {
                        res.statusCode = 403;
                        res.json({
                            code: 403,
                            status: "FALSE",
                            msg: `Email is already used!`
                        });
                    } else {
                        userRepo.add(req.body).then(uid => {
                            var access_token = authRepo.generateAccessToken(req.body);
                            var refresh_token = authRepo.generateRefreshToken();
                            if (uid) {
                                authRepo.insertRefreshToken(uid, refresh_token).then(uid => {
                                    res.json({ status: "TRUE", msg: `Added user!`, token: access_token, refreshToken: refresh_token });
                                });
                            }
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.put("/admin", verifyStaff, (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    delete req.body.id;
    userRepo
        .update(id, req.body)
        .then(row => {
            if (row) {
                console.log(row);
                res.statusCode = 200;
                res.json({
                    code: 200,
                    status: "TRUE",
                    message: "Update accounts success with status code 200."
                });
            } else {
                console.log(err);
                res.json({
                    status: false,
                    message: "Update account fail! Check your data and try again!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: false,
                message: "Update account fail! Please login and try again!"
            });
        });
});

router.post("/login", (req, res) => {
    //check account login
    userRepo.login(req.body).then(row => {
        if (row) {
            console.log("after login: ", row);
            var user_info = row;
            var access_token = authRepo.generateAccessToken(user_info);
            var refresh_token = authRepo.generateRefreshToken();
            authRepo
                .getRefreshToken(user_info.id)
                .then(uid => {
                    if (uid) {
                        authRepo.updateRefreshToken(user_info.id, refresh_token).then(uid => {
                            res.json({
                                auth: true,
                                user: user_info,
                                authToken: access_token,
                                refreshToken: refresh_token
                            });
                        });
                    } else {
                        authRepo.insertRefreshToken(user_info.id, refresh_token).then(uid => {
                            res.json({
                                auth: true,
                                user: user_info,
                                authToken: access_token,
                                refreshToken: refresh_token
                            });
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    res.end("View error log on console");
                });
        } else {
            res.json({
                msg: `Failed to login!`
            });
        }
    });
});

router.get("/one/:username", verifyStaff, (req, res) => {
    console.log("get user verify: ", req.params);
    var username = req.params.username;
    if (username) {
        userRepo
            .getUserByUsername(username)
            .then(row => {
                res.json(row);
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.end("View error log on console");
            });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

module.exports = router;
