var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.getCouponStatus = coupon =>
    kn("coupon")
        .select("*")
        .where("coupon_code", coupon)
        .first();

exports.order = async orderInfo => {
    console.log(orderInfo);
    // kn("coupon")
    //     .select("*")
    //     .where("coupon_code", coupon)
    //     .first();
}; // exports.getUserByEmail = email =>
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
