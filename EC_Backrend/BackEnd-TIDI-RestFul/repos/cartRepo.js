var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

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

exports.delete = id =>
    kn
        .from("cart")
        .del()
        .where("id", id);

exports.delByAccount = idAccount =>
    kn
        .from("cart")
        .del()
        .where("accounts_id", idAccount);

exports.insertCart = (idAcc, idPro, amount) =>
    kn
        .from("cart")
        .insert({ accounts_id: idAcc, product_id: idPro, amount: amount })
        .returning("id");
