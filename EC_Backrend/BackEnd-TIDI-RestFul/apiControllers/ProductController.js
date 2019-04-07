var express = require("express");
var industryRepo = require("../repos/IndustryRepo");
var brandRepo = require("../repos/BrandRepo");
var categoryRepo = require("../repos/CategoryRepo");
var branchRepo = require("../repos/BranchRepo");
var productRepo = require("../repos/ProductRepo");
var verifyStaff = require("../repos/staffRepo").verifyStaff;

var router = express.Router();

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

router.post("/all", (req, res) => {
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

router.post("/one", (req, res) => {
    var id = +req.query.id;
    if (id) {
        productRepo
            .single(id)
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
                        console.log("get discount product success: ", rows.totalItems);
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
