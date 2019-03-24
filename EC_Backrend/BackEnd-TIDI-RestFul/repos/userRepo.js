var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.list = () => kn("users").select("uid", "username", "first_name", "last_name", "email", "phone", "role");

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

exports.getCartByAccAndPro = (idAcc, idPro) =>
    kn
        .from("cart")
        .select("*")
        .where("accounts_id", idAcc)
        .andWhere("product_id", idPro)
        .first();

exports.single = uid =>
    kn("accounts")
        .select("id", "username", "fullName", "email", "phone", "address", "permission")
        .where("id", uid)
        .first();

exports.getUserByUsername = async username => {
    let user = await kn("accounts")
        .select("id", "username", "phone", "address", "permission", "fullName", "email", "dateOfBirth")
        .where("username", username)
        .first();
    if (user) {
        user.status = true;
    }
    return user;
};

exports.getUserByEmail = email =>
    kn("accounts")
        .select("username", "phone", "address", "permission", "fullName", "email", "dateOfBirth")
        .where("email", email)
        .first();

exports.add = input => {
    input.permission = "ADMIN";
    input.password = md5(input.password).toString();
    return kn("accounts")
        .insert(input)
        .returning("id");
};

exports.delete = uid =>
    kn("users")
        .where("uid", uid)
        .del();

exports.update = (uid, input) =>
    kn("users")
        .where("uid", uid)
        .update(input);

exports.updateCart = (cartItem, amount) =>
    kn
        .from("cart")
        .update("amount", amount)
        .where("accounts_id", cartItem.accounts_id)
        .andWhere("product_id", cartItem.product_id);

exports.insertCart = (idAcc, idPro, amount) =>
    kn
        .from("cart")
        .insert({ accounts_id: idAcc, product_id: idPro, amount: amount })
        .returning("id");

exports.login = input => {
    var md5_pwd = md5(input.password).toString();
    return kn("accounts")
        .select("id", "username", "fullName", "email", "phone", "permission")
        .where({
            username: input.username,
            password: md5_pwd
        })
        .first();
};
