var express = require("express");
var verifier = require("email-verify");
var industryRepo = require("../repos/IndustryRepo");
var brandRepo = require("../repos/BrandRepo");
var branchRepo = require("../repos/BranchRepo");
var categoryRepo = require("../repos/CategoryRepo");
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
    console.log("update decrease viewer: ", req.body);
    var id = req.body.id;
    var parseQuery = new Parse.Query("product");
    await parseQuery.equalTo("id", parseInt(id, 10));
    parseQuery
        .first()
        .then(async object => {
            const deViewer = parseInt(object.get("viewer"), 10) - 1;
            object.set("viewer", deViewer);
            object.save().then(
                result => {
                    console.log("Tru luong view thanh cong: ", result.get("viewer"));
                },
                error => {
                    console.log("Tru luong view that bai: ", err);
                }
            );
        })
        .catch(err => {
            console.log("Tru luong view that bai: ", err);
        });

    // client.unsubscribe(subscription);
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
const sleep = ms => new Promise(r => setTimeout(() => r(), ms));

router.post("/one", (req, res) => {
    var id = +req.query.id;
    if (id) {
        productRepo
            .single(id) // get product by id
            .then(async row => {
                // get ọnect product
                await sleep(1200);
                SyncProductWithBack4App(row); // đồng bộ dữ liệu số người view lên back4app, đây là luồng riêng
                res.json(row);
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.end("View error log on console");
            });
    } else {
        res.statusCode = 404;
        res.end("Not Found, product id is not valid, please check your product.");
    }
});

const SyncProductWithBack4App = pro => {
    var parseQuery = new Parse.Query("product"); // get query conn ti product class
    parseQuery.equalTo("id", parseInt(pro.id, 10)); // get product having id = proId
    if (parseQuery) {
        parseQuery
            .first()
            .then(async object => {
                object.set("amount", pro.amount); // đồng bộ số lượng dưới mysql với back4app
                const inViewer = parseInt(object.get("viewer", 10));
                console.log("get current view: ", inViewer);
                // tăng số lượng người đang xem lên 1
                object.set("viewer", inViewer + 1);
                object
                    .save()
                    .then(result => {
                        console.log("Syncing successfully, now viewer: ", result.get("viewer"));
                    })
                    .catch(err => {
                        console.log("Sync Error", err);
                    });
            })
            .catch(err1 => {
                console.log("Sync Error", err1);
            });
    }
};

router.post("/admin/add", verifyStaff, (req, res) => {
    console.log("Admin add product: ", req.body);
    if (req.body) {
        productRepo
            .add(req.body)
            .then(row => {
                if (row) {
                    res.json({
                        status: "TRUE",
                        message: "Insert product successfully with id" + row
                    });
                } else {
                    res.json({
                        status: "FALSE",
                        message: "Insert product failed."
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: "FALSE",
                    message: "Insert product failed."
                });
            });
    } else {
        res.json({
            status: "FALSE",
            message: "Cannot add product. Check your data and try again."
        });
    }
});

router.post("/admin", verifyStaff, (req, res) => {
    productRepo
        .listForAdmin(req.body)
        .then(rows => {
            if (rows.products) {
                productRepo
                    .getDisAndCoupon(rows.products)
                    .then(products => {
                        // console.log("get discount product success: ", rows.totalItems);
                        res.json({
                            products: products,
                            totalItems: rows.totalItems,
                            status: "TRUE",
                            message: "Get products successfully"
                        });
                    })
                    .catch(err1 => {
                        console.log("Have error: ", err1);
                        res.json({
                            products: [],
                            status: "FALSE",
                            message: "Have error in get prducts process. Check login and try again."
                        });
                    });
            } else {
                res.json({
                    products: [],
                    status: "FALSE",
                    message: "Have error in get prducts process. Check login and try again."
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                products: [],
                status: "FALSE",
                message: "Have error in get prducts process. Check login and try again."
            });
        });
});

router.put("/admin", verifyStaff, (req, res) => {
    console.log("update admin product: ", req.body);
    productRepo
        .updateProductAdmin(req.body)
        .then(effect => {
            console.log("result after admin update product: ", effect);
            if (effect) {
                res.json({
                    status: "TRUE",
                    message: "Update product by admin successfully."
                });
            } else {
                res.json({
                    status: "FALSE",
                    message: "Update product by admin failed."
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Cannot update product by admin!! Check login and try again."
            });
        });
});
router.post("/admin/brand", verifyStaff, (req, res) => {
    console.log("Admin get all brand: ", req.body);
    brandRepo
        .list()
        .then(brands => {
            if (brands) {
                res.json({
                    brands: brands,
                    totalItems: brands.length,
                    status: "TRUE",
                    message: "Get brands successfully."
                });
            } else
                res.json({
                    brands: [],
                    status: "FALSE",
                    message: "Have error in get brands process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                brands: [],
                status: "FALSE",
                message: "Have error in get brands process. Check login and try again."
            });
        });
});

router.post("/admin/brand/brand", verifyStaff, (req, res) => {
    console.log("Admin get all brand for brand page: ", req.body);
    brandRepo
        .adminList(req.body)
        .then(result => {
            console.log("get brand brand for admin page: ", result);
            if (result) {
                res.json({
                    brands: result.brands,
                    totalItems: result.totalItems,
                    status: "TRUE",
                    message: "Get brands successfully."
                });
            } else
                res.json({
                    brands: [],
                    status: "FALSE",
                    message: "Have error in get brands process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                brands: [],
                status: "FALSE",
                message: "Have error in get brands process. Check login and try again."
            });
        });
});
router.post("/admin/brand/add", verifyStaff, (req, res) => {
    console.log("Admin insert new brand: ", req.body);
    brandRepo
        .add(req.body)
        .then(id => {
            if (id) {
                res.json({
                    status: "TRUE",
                    message: "Add brands successfully."
                });
            } else
                res.json({
                    status: "FALSE",
                    message: "Have error in add brands process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Have error in add brands process. Check login and try again."
            });
        });
});
router.put("/admin/brand", verifyStaff, (req, res) => {
    console.log("Admin update brand: ", req.body);
    brandRepo
        .update(req.body)
        .then(effect => {
            if (effect) {
                res.json({
                    status: "TRUE",
                    message: "Update brands successfully."
                });
            } else
                res.json({
                    status: "FALSE",
                    message: "Have error in update brands process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Have error in update brands process. Check login and try again."
            });
        });
});

router.post("/admin/industry", verifyStaff, (req, res) => {
    // console.log("Admin get all industry: ", req.body);
    industryRepo
        .list()
        .then(industries => {
            if (industries) {
                res.json({
                    industries: industries,
                    totalItems: industries.length,
                    status: "TRUE",
                    message: "Get industries successfully"
                });
            } else
                res.json({
                    industries: [],
                    status: "FALSE",
                    message: "Have error in get industries process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                industries: [],
                status: "FALSE",
                message: "Have error in get industries process. Check login and try again."
            });
        });
});

router.post("/admin/branch", verifyStaff, (req, res) => {
    // console.log("Admin get all industry: ", req.body);
    branchRepo
        .list()
        .then(branches => {
            if (branches) {
                res.json({
                    branches: branches,
                    totalItems: branches.length,
                    status: "TRUE",
                    message: "Get branch successfully"
                });
            } else
                res.json({
                    branches: [],
                    status: "FALSE",
                    message: "Have error in get branch process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                branches: [],
                status: "FALSE",
                message: "Have error in get branch process. Check login and try again."
            });
        });
});

router.post("/admin/category", verifyStaff, (req, res) => {
    // console.log("Admin get all industry: ", req.body);
    categoryRepo
        .list()
        .then(categories => {
            if (categories) {
                res.json({
                    categories: categories,
                    totalItems: categories.length,
                    status: "TRUE",
                    message: "Get category successfully"
                });
            } else
                res.json({
                    categories: [],
                    status: "FALSE",
                    message: "Have error in get category process. Check login and try again."
                });
        })
        .catch(err => {
            console.log(err);
            res.json({
                categories: [],
                status: "FALSE",
                message: "Have error in get category process. Check login and try again."
            });
        });
});
module.exports = router;
