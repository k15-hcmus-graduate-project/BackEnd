var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.listTree = async query => {
    console.log(query); // read query
    let ind = null;
    let totalSize = 0;
    if (query.query) {
        console.log("get with query");
        const { industryId, branchId, categoryId, brandId, minPrice, maxPrice, keyword } = query.query;
        ind = await kn
            .from("product")
            .select("*")
            .where(async function() {
                if (industryId) {
                    console.log("get by industry: ", industryId);
                    await this.where("product.industry_id", "=", parseInt(industryId, 10));
                }
            })
            .andWhere(async function() {
                if (branchId) {
                    console.log("get by branch: ", branchId);
                    await this.where("product.branch_id", "=", parseInt(branchId, 10));
                }
            })
            .andWhere(async function() {
                if (categoryId) {
                    console.log("get by category: ", categoryId);
                    await this.where("product.category_id", "=", parseInt(categoryId, 10));
                }
            })
            .andWhere(async function() {
                if (brandId) {
                    console.log("get by brand: ", brandId);
                    await this.where("product.brand_id", "=", parseInt(brandId, 10));
                }
            })
            .andWhere(async function() {
                if (minPrice) {
                    console.log("get by minPrice: ", minPrice);
                    await this.where("product.price", ">", parseInt(minPrice, 10));
                }
            })
            .andWhere(async function() {
                if (maxPrice) {
                    console.log("get by maxPrice: ", maxPrice);
                    await this.where("product.price", "<", parseInt(maxPrice, 10));
                }
            })
            .andWhere(async function() {
                if (keyword) {
                    console.log("get by keyword: ", keyword);
                    await this.where("product.product_name", "like", "%" + keyword + "%");
                }
            })
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
        totalSize = ind.length;
    } else {
        console.log("get full");
        let temp = await kn.from("product").select("*");
        totalSize = temp.length;
        ind = await kn
            .from("product")
            .select("*")
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
    }

    var res = {};
    let ind_copy = ind;
    console.log("so luong san phamm:  ", ind.length);
    console.log("get field relative ");
    const size = ind.length;
    for (let i = 0; i < size; i++) {
        var b = await kn
            .from("category")
            .select("*")
            .where("id", parseInt(ind[i].category_id))
            .first();
        ind_copy[i].category = b;

        var c = await kn
            .from("branch")
            .select("*")
            .where("id", parseInt(ind[i].branch_id))
            .first();
        ind_copy[i].branch = c;

        var d = await kn
            .from("industry")
            .select("*")
            .where("id", parseInt(ind[i].industry_id))
            .first();
        ind_copy[i].industry = d;

        var f = await kn
            .from("brand")
            .select("*")
            .where("id", parseInt(ind[i].brand_id))
            .first();
        ind_copy[i].brand = f;
    }
    res.products = ind_copy;
    res.totalItems = totalSize;

    return res;
};

exports.single = async uid => {
    let pro = await kn
        .from("product")
        .select("*")
        .where("id", parseInt(uid))
        .first();

    if (pro) {
        let cate = await kn
            .from("category")
            .select("*")
            .where("id", pro.category_id);
        pro.category = cate;

        let branch = await kn
            .from("branch")
            .select("*")
            .where("id", pro.branch_id);
        pro.branch = branch;

        let industry = await kn
            .from("industry")
            .select("*")
            .where("id", pro.industry_id);
        pro.industry = industry;

        let brand = await kn
            .from("brand")
            .select("*")
            .where("id", pro.brand_id);

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
