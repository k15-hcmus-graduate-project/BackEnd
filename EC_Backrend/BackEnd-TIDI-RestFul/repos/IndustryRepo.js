var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.list = () => kn.from("industry").select("*");

exports.listTree = async () => {
    var ind = await kn.from("industry").select("*");

    let ind_copy = ind;

    for (let i = 0; i < ind.length; i++) {
        var b = await kn
            .from("branch")
            .select("*")
            .where("industry_id", ind[i].id);
        for (let j = 0; j < b.length; j++) {
            var c = await kn
                .from("category")
                .select("*")
                .where("branch_id", b[j].id);
            b[j].categories = c;
        }
        ind_copy[i].branches = b;
    }
    return ind_copy;
};

// .innerJoin("branch", "industry.id", "branch.industry_id");

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
