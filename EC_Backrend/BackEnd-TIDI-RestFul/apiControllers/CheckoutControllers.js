var express = require("express");
var verifier = require("email-verify");
var checkoutRepo = require("../repos/CheckoutRepo");
var userRepo = require("../repos/userRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;

var router = express.Router();

router.post("/couponStatus", verifyStaff, (req, res) => {
    console.log(req.body);
    checkoutRepo
        .getCouponStatus(req.body.coupon)
        .then(coupon => {
            console.log(coupon);
            if (coupon) {
                if ((coupon.active = "TRUE")) {
                    coupon.status = 1;
                } else {
                    coupon.status = 0;
                }
                res.json({
                    status: coupon.status,
                    discPercent: coupon.percent,
                    money: coupon.money
                });
            } else {
                res.json({
                    status: -1,
                    discPercent: 0,
                    money: 0
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.post("/checkout", verifyStaff, (req, res) => {
    console.log(req.body);
    userRepo
        .getUserByUsername(req.body.username)
        .then(user => {
            if (user) {
                console.log(user);
                req.body.idAccount = user.id;
                if (req.body.couponCode && req.body.couponCode !== "") {
                    checkoutRepo
                        .getCouponStatus(req.body.coupon)
                        .then(coupon => {
                            if (coupon) {
                                req.body.couponId = coupon.id;
                                checkoutRepo
                                    .order(req.body)
                                    .then(res => {
                                        console.log(res);
                                    })
                                    .catch(err2 => {
                                        console.log(err2);
                                    });
                            } else {
                                res.json({
                                    status: false,
                                    message: "coupon is invalid"
                                });
                            }
                        })
                        .catch(err1 => {
                            console.log(err1);
                            res.json({
                                status: false,
                                message: "checkout failure, check coupon code."
                            });
                        });
                } else {
                }
            } else {
                res.json({
                    status: false,
                    message: "username is invalid"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: false,
                message: "checkout failure, check username."
            });
        });
    // checkoutRepo
    //     .getCouponStatus(req.body.coupon)
    //     .then(coupon => {
    //         console.log(coupon);
    //         if (coupon) {
    //             if ((coupon.active = "TRUE")) {
    //                 coupon.status = 1;
    //             } else {
    //                 coupon.status = 0;
    //             }
    //             res.json({
    //                 status: coupon.status,
    //                 discPercent: coupon.percent,
    //                 money: coupon.money
    //             });
    //         } else {
    //             res.json({
    //                 status: -1,
    //                 discPercent: 0,
    //                 money: 0
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.statusCode = 500;
    //         res.end("View error log on console");
    //     });
});

router.get("/cart", verifyStaff, (req, res) => {
    console.log("request get cart: ", req.query);
    userRepo
        .getUserByUsername(req.query.username)
        .then(user => {
            if (user) {
                console.log("user cart: ", user);
                userRepo
                    .listCart(user.id)
                    .then(rows => {
                        console.log(rows);
                        res.json({
                            products: rows,
                            status: true
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.end("View error log on console");
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});
router.post("/", (req, res) => {
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

router.post("/cart", (req, res) => {
    console.log(req.body);
    userRepo
        .getUserByUsername(req.body.username)
        .then(row => {
            if (row) {
                const idAccount = row.id;
                userRepo
                    .getCartByAccAndPro(idAccount, req.body.productId)
                    .then(cartItem => {
                        console.log(cartItem);
                        if (cartItem) {
                            console.log("update cart ");
                            userRepo
                                .updateCart(cartItem, parseInt(req.body.amount))
                                .then(effect => {
                                    console.log(effect);
                                    res.statusCode = 200;
                                    res.json({
                                        status: true,
                                        code: 200,
                                        msg: `update cart successful with id: ` + cartItem.accounts_id
                                    });
                                })
                                .catch(err2 => {
                                    console.log(err2);
                                    res.statusCode = 403;
                                    res.json({
                                        status: false,
                                        code: 403,
                                        msg: `update cart failed with code 403!`
                                    });
                                });
                        } else {
                            console.log("insert cart");
                            userRepo
                                .insertCart(idAccount, req.body.productId, req.body.amount)
                                .then(uid => {
                                    res.status = 200;
                                    res.json({
                                        status: true,
                                        code: 200,
                                        msg: `insert cart successful with id: ` + uid
                                    });
                                })
                                .catch(err3 => {
                                    res.statusCode = 403;
                                    res.json({
                                        status: false,
                                        code: 403,
                                        msg: `insert cart failed with code 403!`
                                    });
                                    console.log(err3);
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 403;
                        res.json({
                            status: false,
                            code: 403,
                            msg: `Username is already used!`
                        });
                    });
            } else {
                console.log(err);
                res.statusCode = 403;
                res.json({
                    status: false,
                    code: 403,
                    msg: `Username is invalid!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.put("/cart", (req, res) => {
    console.log("Update cart item with user: ", req.body.username);
    userRepo
        .getUserByUsername(req.body.username)
        .then(row => {
            if (row) {
                const idAccount = row.id;
                userRepo
                    .getCartByAccAndPro(idAccount, req.body.productId)
                    .then(cartItem => {
                        console.log(cartItem);
                        if (cartItem) {
                            console.log("update cart ");
                            userRepo
                                .updateCart(cartItem, parseInt(req.body.amount))
                                .then(effect => {
                                    console.log(effect);
                                    res.statusCode = 200;
                                    res.json({
                                        code: 200,
                                        msg: `update cart successful with id: ` + cartItem.accounts_id
                                    });
                                })
                                .catch(err2 => {
                                    console.log(err2);
                                    res.statusCode = 403;
                                    res.json({
                                        code: 403,
                                        msg: `update cart failed with code 403!`
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 403;
                        res.json({
                            code: 403,
                            msg: `Username is already used!`
                        });
                    });
            } else {
                console.log(err);
                res.statusCode = 403;
                res.json({
                    code: 403,
                    msg: `Username is invalid!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
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

// router.get("/:id", verifyStaff, (req, res) => {
//     console.log("get user verify: ", req.params);
//     var id = +req.params.id;
//     if (id) {
//         userRepo
//             .single(id)
//             .then(row => {
//                 res.json(row);
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.statusCode = 500;
//                 res.end("View error log on console");
//             });
//     } else {
//         res.statusCode = 404;
//         res.end("Not Found");
//     }
// });

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
