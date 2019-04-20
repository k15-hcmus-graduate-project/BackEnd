var express = require("express");
var verifier = require("email-verify");

var industryRepo = require("../repos/IndustryRepo");
var brandRepo = require("../repos/BrandRepo");
var branchRepo = require("../repos/BranchRepo");
var productRepo = require("../repos/ProductRepo");

var authRepo = require("../repos/authRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;

var parseConfig = require("../fn/parse");
var Parse = parseConfig.Parse;
var client = parseConfig.LiveQueryClient;

var router = express.Router();

var subscription;

router.get("/industry", (req, res) => {
    industryRepo
        .listTree()
        .then(rows => {
            res.json({
                industry: rows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});
router.get("/", (req, res) => {
    industryRepo
        .list()
        .then(rows => {
            res.json({
                industry: rows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.get("/brand", (req, res) => {
    brandRepo
        .list()
        .then(rows => {
            res.json({
                brand: rows
            });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
        });
});

router.put("/viewer", async (req, res) => {
    var id = req.body.id;
    var parseQuery = new Parse.Query("product");
    parseQuery.equalTo("id", parseInt(id, 10));
    var parseObj = await parseQuery.first();
    parseObj.set("viewer", parseObj.get("viewer") - 1);
    parseObj.save().then(
        result => {
            console.log("Tru luong view thanh cong");
        },
        error => {
            console.log("Tru luong view that bai");
        }
    );
    client.unsubscribe(subscription);
});
router.post("/all", (req, res) => {
    console.log("get product with query: ", req.query);
    productRepo
        .listTree(req.query)
        .then(rows => {
            res.json({
                products: rows.products,
                totalItems: rows.totalItems
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post("/", (req, res) => {
    console.log(req.body);
    verifier.verify(req.body.email, function(err, info) {
        if (err || !info.success) {
            res.statusCode = 403;
            res.json({
                msg: `Invalid email!`
            });
        } else {
            console.log("email valid");
            userRepo
                .getUserByUsername(req.body.username)
                .then(row => {
                    if (row) {
                        res.statusCode = 403;
                        res.json({
                            msg: `Username is already used!`
                        });
                    } else {
                        userRepo.getUserByEmail(req.body.email).then(row => {
                            if (row) {
                                res.statusCode = 403;
                                res.json({
                                    msg: `Email is already used!`
                                });
                            } else {
                                userRepo.add(req.body).then(uid => {
                                    if (uid) {
                                        res.json({
                                            msg: `Added user!`
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
        }
    });
});

router.post("/login", (req, res) => {
    //check account login
    userRepo.login(req.body).then(row => {
        if (row) {
            var user_info = row;
            var access_token = authRepo.generateAccessToken(user_info);
            var refresh_token = authRepo.generateRefreshToken();
            authRepo
                .getRefreshToken(user_info.uid)
                .then(uid => {
                    if (uid) {
                        authRepo.updateRefreshToken(user_info.uid, refresh_token).then(uid => {
                            res.json({
                                auth: true,
                                user: user_info,
                                access_token: access_token,
                                refresh_token: refresh_token
                            });
                        });
                    } else {
                        authRepo.insertRefreshToken(user_info.uid, refresh_token).then(uid => {
                            res.json({
                                auth: true,
                                user: user_info,
                                access_token: access_token,
                                refresh_token: refresh_token
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

router.post("/one", (req, res) => {
    console.log(req.query);
    var id = +req.query.id;
    if (id) {
        productRepo
            .single(id)
            .then(row => {
                console.log(row);
                SyncProductWithBack4App(row);
                var parseQuery = new Parse.Query("product");
                parseQuery.equalTo("id", parseInt(id, 10));
                subscription = client.subscribe(parseQuery);

                subscription.on("update", object => {
                    row.amount = object.get("amount");
                    row.viewer = object.get("viewer");
                    console.log("Amount updated: " + row.amount);
                    console.log("Viewers: " + row.viewer);
                    //res.json(row);
                });

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

async function SyncProductWithBack4App(pro) {
    var parseQuery = new Parse.Query("product");
    parseQuery.equalTo("id", parseInt(pro.id, 10));
    var parseObj = await parseQuery.first();
    parseObj.set("amount", pro.amount);
    parseObj.set("viewer", parseObj.get("viewer") + 1);
    parseObj.save().then(
        result => {
            console.log("Syncing successfully");
        },
        error => {
            console.log(error.message);
        }
    );
}

module.exports = router;
