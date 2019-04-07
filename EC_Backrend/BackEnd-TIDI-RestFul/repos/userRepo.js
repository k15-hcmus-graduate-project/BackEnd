var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.list = () =>
    kn("accounts").select("id", "gender", "active", "username", "phone", "address", "permission", "fullName", "email", "dateOfBirth");

exports.adminList = query =>
    kn
        .from("accounts")
        .select("id", "username", "gender", "active", "phone", "address", "permission", "fullName", "email", "dateOfBirth")
        .where("fullName", "like", "%" + query.query.keyword + "%")
        .orWhere("username", "like", "%" + query.query.keyword + "%")
        .offset(query.offset)
        .limit(query.limit);

exports.listCart = async id => {
    //get cart by id user
    var cart = await kn
        .from("cart")
        .select("*")
        .where("accounts_id", parseInt(id));

    //create list product
    let products = [];
    if (cart) {
        const size = cart.length; // get size of cart

        for (let i = 0; i < size; i++) {
            //get product in cart item
            var pro = await kn
                .from("product")
                .select("*")
                .where("id", parseInt(cart[i].product_id))
                .first();

            var cate = await kn
                .from("category")
                .select("*")
                .where("id", pro.category_id);
            pro.category = cate;

            var branch = await kn
                .from("branch")
                .select("*")
                .where("id", pro.branch_id);
            pro.branch = branch;

            var brand = await kn
                .from("brand")
                .select("*")
                .where("id", pro.brand_id);
            pro.brand = brand;

            var ind = await kn
                .from("industry")
                .select("*")
                .where("id", pro.industry_id);
            pro.industry = ind;
            pro.amount = cart[i].amount;
            products.push(pro);
        }
    }

    return products;
};

exports.single = uid =>
    kn("accounts")
        .select("id", "gender", "active", "username", "fullName", "email", "phone", "address", "permission")
        .where("id", uid)
        .first();

exports.getUserByUsername = async username => {
    let user = await kn("accounts")
        .select("id", "username", "active", "gender", "phone", "address", "permission", "fullName", "email", "dateOfBirth")
        .where("username", username)
        .first();
    if (user) {
        user.status = true;
    }
    return user;
};

exports.getUserByEmail = email =>
    kn("accounts")
        .select("username", "gender", "active", "phone", "address", "permission", "fullName", "email", "dateOfBirth")
        .where("email", email)
        .first();

exports.add = async input => {
    if (!input.permission) input.permission = "ADMIN";
    input.password = md5(input.password).toString();
    var res = await kn
        .from("accounts")
        .insert(input)
        .returning("id");
    return res;
};

// exports.delete = uid =>
//     kn("users")
//         .where("uid", uid)
//         .del();

exports.update = (uid, input) =>
    kn
        .from("accounts")
        .where("id", uid)
        .update(input);

// exports.deleteCart = id =>
//     kn
//         .from("cart")
//         .del()
//         .where("id", id);

// exports.insertCart = (idAcc, idPro, amount) =>
//     kn
//         .from("cart")
//         .insert({ accounts_id: idAcc, product_id: idPro, amount: amount })
//         .returning("id");

exports.login = input => {
    var md5_pwd = md5(input.password).toString();
    return kn("accounts")
        .select("id", "username", "active", "gender", "fullName", "email", "phone", "permission")
        .where({
            username: input.username,
            password: md5_pwd
        })
        .first();
};
