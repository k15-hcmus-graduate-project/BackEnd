var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.list = () => kn.select("*").from("address");
exports.locationAccounts = () => kn.select("username", "location").from("accounts");

exports.getById = id =>
    kn
        .from("address")
        .select("*")
        .where("id", id)
        .first();

exports.updateLocation = (id, location, distance) =>
    kn
        .from("address")
        .update({ location: location, distance: distance })
        .where("id", id);

exports.updateUserLocation = (username, location) =>
    kn
        .from("accounts")
        .update({ location: location })
        .where("username", username);

exports.delete = id =>
    kn
        .from("address")
        .del()
        .where("id", id);

exports.post = (address, location) =>
    kn
        .from("address")
        .insert({ address: address, location: location })
        .returning("id");
