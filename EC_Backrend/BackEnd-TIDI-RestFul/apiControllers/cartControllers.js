var express = require("express");
var verifier = require("email-verify");
var userRepo = require("../repos/userRepo");
var cartRepo = require("../repos/cartRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;

var router = express.Router();

router.get("/", verifyStaff, (req, res) => {
    console.log("request get cart: ", req.query);
    userRepo
        .getUserByUsername(req.query.username)
        .then(user => {
            if (user) {
                console.log("user cart: ", user);
                cartRepo
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
                const idAccount = row.id;
                cartRepo
                    .getCartByAccAndPro(idAccount, req.body.productId)
                    .then(cartItem => {
                        console.log(cartItem);
                        if (cartItem) {
                            console.log("update cart ");
                            cartRepo
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
                            cartRepo
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

router.put("/", (req, res) => {
    console.log("Update cart item with user: ", req.body.username);
    userRepo
        .getUserByUsername(req.body.username)
        .then(row => {
            if (row) {
                const idAccount = row.id;
                cartRepo
                    .getCartByAccAndPro(idAccount, req.body.productId)
                    .then(cartItem => {
                        console.log(cartItem);
                        if (cartItem) {
                            console.log("update cart ");
                            cartRepo
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

router.delete("/", (req, res) => {
    console.log("Delete cart item with user: ", req.body.username);
    userRepo
        .getUserByUsername(req.body.username)
        .then(row => {
            if (row) {
                const idAccount = row.id;
                cartRepo
                    .getCartByAccAndPro(idAccount, req.body.productId)
                    .then(cartItem => {
                        console.log(cartItem);
                        if (cartItem) {
                            console.log("delete cart ");
                            cartRepo
                                .delete(cartItem.id)
                                .then(effect => {
                                    console.log(effect);
                                    res.statusCode = 200;
                                    res.json({
                                        code: 200,
                                        msg: `delete cart successful with id: ` + cartItem.id
                                    });
                                })
                                .catch(err2 => {
                                    console.log(err2);
                                    res.statusCode = 403;
                                    res.json({
                                        code: 403,
                                        msg: `delete cart failed with code 403!`
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 403;
                        res.json({
                            code: 403,
                            msg: `cart is not exist!!`
                        });
                    });
            } else {
                console.log(err);
                res.statusCode = 403;
                res.json({
                    code: 403,
                    msg: `Username is not valid!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});
module.exports = router;
