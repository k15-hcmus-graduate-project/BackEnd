var md5 = require("crypto-js/md5");
var kn = require("../fn/db");
var lqc = require("../fn/liveQueryClient");

const Parse = lqc.Parse;
const client = lqc.LiveQueryClient;
const Product = Parse.Object.extend("product");

function GetPropertiesOfProduct(item) {
    item.id = item.get("id");
    item.product_name = item.get("product_name");
    item.price = item.get("price");
    item.amount = item.get("amount");
    item.category_id = item.get("category_id");
    item.branch_id = item.get("branch_id");
    item.brand_id = item.get("brand_id");
    item.industry_id = item.get("industry_id");
    item.active = item.get("active");
    item.images = item.get("images");
}

function GetPropertiesOfBranch(item) {
    item.id = item.get("id");
    item.branch_name = item.get("branch_name");
    item.active = item.get("active");
}

function GetPropertiesOfCategory(item) {
    item.id = item.get("id");
    item.category_name = item.get("category_name");
    item.active = item.get("active");
}

function GetPropertiesOfIndustry(item) {
    item.id = item.get("id");
    item.industry_name = item.get("industry_name");
    item.active = item.get("active");
}

function GetPropertiesOfBrand(item) {
    item.id = item.get("id");
    item.brand_name = item.get("brand_name");
    item.active = item.get("active");
}

exports.listTree = async query => {
    console.log(query); // read query
    let ind = null;
    let totalSize = 0;
    if (query.query) {
        console.log("get with query");
        console.log("query.query: " + query.query);
        const { industryId, branchId, categoryId, brandId, minPrice, maxPrice, keyword } = query.query;
        var parseQuery = new Parse.Query("product");
        if (industryId) {
            console.log("get by industry: ", industryId);
            parseQuery.equalTo("industry_id", parseInt(industryId, 10));
        }
        if (branchId) {
            console.log("get by branch: ", branchId);
            parseQuery.equalTo("branch_id", parseInt(branchId, 10));
        }
        if (categoryId) {
            console.log("get by category: ", categoryId);
            parseQuery.equalTo("category_id", parseInt(categoryId, 10));
        }
        if (brandId) {
            console.log("get by brand: ", brandId);
            parseQuery.equalTo("brand_id", parseInt(brandId, 10));
        }
        if (minPrice) {
            console.log("get by minPrice: ", minPrice);
            parseQuery.greaterThanOrEqualTo("price", parseInt(minPrice, 10));
        }
        if (maxPrice) {
            console.log("get by minPrice: ", maxPrice);
            parseQuery.lessThanOrEqualTo("price", parseInt(maxPrice, 10));
        }
        if (keyword) {
            console.log("get by keyword: ", keyword);
            parseQuery.fullText("product_name", keyword);
        }
        parseQuery.limit(parseInt(query.limit, 10));
        parseQuery.skip(parseInt(query.offset, 10));
        
        ind = await parseQuery.find();
        for (var item of ind) {
            //get data for each attribute of each item
            GetPropertiesOfProduct(item);
        }
    } else {
        console.log("get full");
        var parseQuery = new Parse.Query("product");
        let temp = await parseQuery.find();
        totalSize = temp.length;
        parseQuery.limit(parseInt(query.limit, 10));
        parseQuery.skip(parseInt(query.offset, 10));
        ind = await parseQuery.find();
        for (var item of ind) {
            //get data for each attribute of each item
            GetPropertiesOfProduct(item);
        }
    }

    var res = {};
    let ind_copy = ind;
    console.log("so luong san phamm:  ", ind.length);
    console.log("get field relative ");
    const size = ind.length;
    var promiseArr = [];
    for (let i = 0; i < size; i++) {
        
        promiseArr.push(new Promise((resolve, reject) => {
                var parseQuery = new Parse.Query("category");
                parseQuery.equalTo("id", parseInt(ind[i].category_id));
                parseQuery.first().then (
                    result => {
                        GetPropertiesOfCategory(result);
                        var b = new Object();
                        b.id = result.id; b.category_name = result.category_name; b.active = result.active;
                        ind_copy[i].category = b;
                        console.log("getting category successfully");
                        resolve(result);
                    },
                    error => {
                        console.log('Error getting category: ' + error.message);
                        reject(error);
                    }
                );
            })
        );
        promiseArr.push( new Promise((resolve, reject) => {
                var parseQuery = new Parse.Query("branch");
                parseQuery.equalTo("id", parseInt(ind[i].branch_id));
                parseQuery.first().then(
                    result => {
                        GetPropertiesOfBranch(result);
                        var c = new Object();
                        c.id = result.id; c.branch_name = result.branch_name; c.active = result.active;
                        ind_copy[i].branch = c;
                        console.log("getting branch successfully");
                        resolve(result);
                    },
                    error => {
                        console.log('Error getting branch: ' + error.message);
                        reject(error);
                    }
                );
            })
        );
        
        promiseArr.push( new Promise((resolve, reject) => {
                var parseQuery = new Parse.Query("industry");
                parseQuery.equalTo("id", parseInt(ind[i].industry_id));
                parseQuery.first().then(
                    (result) => {
                        GetPropertiesOfIndustry(result);
                        var d = new Object();
                        d.id = result.id; d.industry_name = result.industry_name; d.active = result.active;
                        ind_copy[i].industry = d;
                        console.log("getting industry successfully");
                        resolve(result);
                    },
                    (error) => {
                        console.log('Error getting industry: ' + error.message);
                        reject(error);
                    }
                );
            })
        );
        
        promiseArr.push( new Promise((resolve, reject) => {
                var parseQuery = new Parse.Query("brand");
                parseQuery.equalTo("id", parseInt(ind[i].brand_id));
                parseQuery.first().then(
                    (result) => {
                        GetPropertiesOfBrand(result);
                        var e = new Object();
                        e.id = result.id; e.brand_name = result.brand_name; e.active = result.active;
                        ind_copy[i].brand = e;
                        console.log("getting brand successfully");
                        resolve(result);
                    },
                    (error) => {
                        console.log('Error getting brand: ' + error.message);
                        reject(error);
                    }
                );
            })
        );
    }
    Promise.all(promiseArr).then(
        values => {
            res.products = ind_copy;
            console.log('-------------- ind_copy ----------------');
            for (let item of ind_copy) {
                console.log(item);
            }
            res.totalItems = totalSize;
            return res;
        }, reason => {
            console.log(reason);
        }
    );
};

exports.single = async uid => {
    var parseQuery = new Parse.Query("product");
    parseQuery.equalTo("id", parseInt(uid));
    let pro = await parseQuery.first();
    GetPropertiesOfProduct(pro);

    if (pro) {
        parseQuery = new Parse.Query("category");
        parseQuery.equalTo("id", pro.category_id);
        let cate = new Object();
        parseQuery.first().then(
            (result) => {
                GetPropertiesOfCategory(result);
                cate.id = result.id;
                pro.category = cate;
            },
            (error) => {
                console.log("Error getting category: " + error.message);
            }
        );
        

        parseQuery = new Parse.Query("branch");
        parseQuery.equalTo("id", pro.branch_id);
        let branch = await parseQuery.first();
        GetPropertiesOfBranch(branch);
        pro.branch = branch;

        parseQuery = new Parse.Query("industry");
        parseQuery.equalTo("id", pro.industry_id);
        let industry = await parseQuery.first();
        GetPropertiesOfIndustry(industry);
        pro.industry = industry;

        parseQuery = new Parse.Query("brand");
        parseQuery.equalTo("id", pro.brand_id);
        let brand = await parseQuery.first();
        GetPropertiesOfBrand(brand);
        pro.brand = brand;
        pro.status = 200;
        return pro;
    }
    pro.status = 500;
    return pro;
};
// exports.getUserByUsername = username =>
//     kn("accounts")
//         .select("username", "permission", "fullName", "email", "dateOfBirth")
//         .where("username", username)
//         .first();

// exports.getUserByEmail = email =>
//     kn("accounts")
//         .select("username", "permission", "fullName", "email", "dateOfBirth")
//         .where("email", email)
//         .first();

// exports.add = input => {
//     input.permission = "ADMIN";
//     input.password = md5(input.password).toString();
//     return kn("accounts")
//         .insert(input)
//         .returning("id");
// };

// exports.delete = uid =>
//     kn("users")
//         .where("uid", uid)
//         .del();

// exports.update = (uid, input) =>
//     kn("users")
//         .where("uid", uid)
//         .update(input);

// exports.login = input => {
//     var md5_pwd = md5(input.password).toString();
//     return kn("users")
//         .select("uid", "username", "first_name", "last_name", "email", "phone", "role")
//         .where({
//             username: input.username,
//             password: md5_pwd
//         })
//         .first();
// };
