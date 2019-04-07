var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.list = () => kn.from("brand").select("*");

exports.adminList = async query => {
    const { keyword } = query.query;
    var brands = [];
    if (keyword)
        brands = await kn
            .from("brand")
            .select("*")
            .where("brand_name", "like", "%" + keyword + "%")
            .limit(query.limit)
            .offset(query.offset);
    brands = await kn
        .from("brand")
        .select("*")
        .limit(query.limit)
        .offset(query.offset);
    var size = await kn.from("brand").count("* as size");
    return {
        brands: brands,
        totalItems: size[0].size
    };
};

exports.update = brand => {
    var id = brand.id;
    delete brand.id;
    var res = kn
        .from("brand")
        .update(brand)
        .where("id", id);
    return res;
};

exports.add = brand =>
    kn
        .from("brand")
        .insert(brand)
        .returning("id");
// exports.single = uid =>
//     kn("accounts")
//         .select("uid", "username", "first_name", "last_name", "email", "phone", "role")
//         .where("uid", uid)
//         .first();

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
