var express = require("express");
var verifier = require("email-verify");
var checkoutRepo = require("../repos/CheckoutRepo");
var userRepo = require("../repos/userRepo");
var cartRepo = require("../repos/cartRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;
var parseConfig = require("../fn/parse");
var Parse = parseConfig.Parse;
var client = parseConfig.LiveQueryClient;
var router = express.Router();

router.post("/couponStatus", verifyStaff, (req, res) => {
    console.log(req.body);
    checkoutRepo
        .getCouponStatus(req.body.coupon)
        .then(coupon => {
            console.log(coupon);
            if (coupon) {
                if (coupon.active === "TRUE") {
                    coupon.status = 1;
                } else {
                    coupon.status = 0;
                    coupon.percent = coupon.money = 0;
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
    const { username, couponCode } = req.body;
    userRepo
        .getUserByUsername(username)
        .then(user => {
            //user í valid
            if (user) {
                req.body.idAccount = user.id; // get id User
                if (couponCode && couponCode !== "") {
                    checkoutRepo
                        .getCouponStatus(couponCode)
                        .then(coupon => {
                            // coupon is valid
                            if (coupon) {
                                if (coupon.active !== "TRUE") {
                                    res.json({
                                        status: "FALSE",
                                        message: "Coupon is not valid!!"
                                    });
                                    return;
                                }
                                req.body.idCoupon = coupon.id;
                                cartRepo
                                    .delByAccount(req.body.idAccount)
                                    .then(del => {
                                        console.log("after delete cart: ", del);
                                        if (del && del > -1) {
                                            checkoutRepo
                                                .insertOrder(req.body, Parse)
                                                .then(async orderId => {
                                                    if (orderId) {
                                                        var parseQuery = new Parse.Object("orders");
                                                        if (parseQuery) {
                                                            checkoutRepo.insertOrderParseAdmin(parseQuery, orderId, req.body);
                                                        }
                                                        res.json({
                                                            orderId: orderId,
                                                            status: "TRUE",
                                                            message: "Place order success with id order: " + orderId
                                                        });
                                                    } else {
                                                        res.json({
                                                            status: "FALSE",
                                                            message: "Have error in place order process!!"
                                                        });
                                                    }
                                                })
                                                .catch(err2 => {
                                                    console.log(err2);
                                                    res.json({
                                                        status: "FALSE",
                                                        message: "Cannot place order."
                                                    });
                                                });
                                        } else {
                                            res.json({
                                                status: false,
                                                message: "Cannot delete cart by account."
                                            });
                                        }
                                    })
                                    .catch(err5 => {
                                        console.log("delete cart error");
                                        res.json({
                                            status: false,
                                            message: "Error in delete cart process."
                                        });
                                    });
                            } else {
                                res.json({
                                    status: false,
                                    message: "coupon is not valid"
                                });
                            }
                        })
                        .catch(err1 => {
                            console.log(err1);
                            res.json({
                                status: false,
                                message: "checkout failure, coupon is not valid."
                            });
                        });
                } else {
                    console.log("Khong co coupon. ");
                    req.body.idCoupon = 0;
                    cartRepo
                        .delByAccount(req.body.idAccount)
                        .then(del => {
                            if (del) {
                                checkoutRepo
                                    .insertOrder(req.body, Parse)
                                    .then(orderId => {
                                        if (orderId) {
                                            var parseQuery = new Parse.Object("orders");
                                            if (parseQuery) {
                                                checkoutRepo.insertOrderParseAdmin(parseQuery, orderId, req.body);
                                            }
                                            res.json({
                                                orderId: orderId,
                                                status: "TRUE",
                                                message: "Place order success with id order: " + orderId
                                            });
                                        } else {
                                            res.json({
                                                status: "FALSE",
                                                message: "Have error in place order process!!"
                                            });
                                        }
                                    })
                                    .catch(err2 => {
                                        console.log(err2);
                                        res.json({
                                            status: "FALSE",
                                            message: "Cannot place order."
                                        });
                                    });
                            } else {
                                res.json({
                                    status: false,
                                    message: "Cannot delete cart by account."
                                });
                            }
                        })
                        .catch(err5 => {
                            console.log("delete cart error");
                            res.json({
                                status: false,
                                message: "Cannot delete cart by account."
                            });
                        });
                }
            } else {
                res.json({
                    status: "FALSE",
                    message: "username is not valid"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Checkout failure, username can not be found!!"
            });
        });
});

router.post("/admin/order", verifyStaff, (req, res) => {
    console.log("Admin get all orders: ", req.body);
    checkoutRepo
        .listOrders(req.body)
        .then(result => {
            if (result.orders) {
                res.json({
                    orders: result.orders,
                    totalItems: result.totalItems,
                    status: "TRUE",
                    message: "Get orders for admin successfully."
                });
            } else
                res.json({
                    orders: [],
                    status: "FALSE",
                    message: "Have error in get orders process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                orders: [],
                status: "FALSE",
                message: "Have error in get orders process. Check login and try again."
            });
        });
});

router.put("/admin/order", verifyStaff, (req, res) => {
    console.log("Admin update orders: ", req.body);
    const id = req.body.orderId;
    checkoutRepo
        .updateOrder(req.body)
        .then(async effect => {
            console.log("effect update order: ", effect);
            if (effect) {
                var parseQuery = new Parse.Query("orders");
                if (id) {
                    await parseQuery.equalTo("uid", parseInt(id, 10));
                    if (parseQuery) {
                        var result = await checkoutRepo.updateOrderAdminParseServer(parseQuery, id, req.body);
                        console.log("result update order: ", result);
                    }
                }

                res.json({
                    status: "TRUE",
                    message: "Update order successfully."
                });
            } else
                res.json({
                    status: "FALSE",
                    message: "Have error in get update process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Have error in get update process. Check login and try again."
            });
        });
});
router.post("/order", verifyStaff, (req, res) => {
    console.log("Get all orders: ", req.body);
    checkoutRepo
        .listOrders(req.body)
        .then(result => {
            if (result.orders) {
                res.json({
                    orders: result.orders,
                    totalItems: result.totalItems,
                    status: "TRUE",
                    message: "Get orders successfully."
                });
            } else
                res.json({
                    orders: [],
                    status: "FALSE",
                    message: "Have error in get orders process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                orders: [],
                status: "FALSE",
                message: "Have error in get orders process. Check login and try again."
            });
        });
});

router.post("/order/orderdetail", verifyStaff, (req, res) => {
    console.log("Get order details: ", req.body);
    checkoutRepo
        .getOrderDetail(req.body)
        .then(result => {
            if (result) {
                res.json({
                    order: result,
                    status: "TRUE",
                    message: "Get orderdetail successfully."
                });
            } else
                res.json({
                    order: null,
                    status: "FALSE",
                    message: "Have error in get orders process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                order: null,
                status: "FALSE",
                message: "Have error in get orders process. Check login and try again."
            });
        });
});
module.exports = router;
