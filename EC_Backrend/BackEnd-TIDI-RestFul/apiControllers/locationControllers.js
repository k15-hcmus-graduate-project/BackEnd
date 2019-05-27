var express = require("express");
var locationRepo = require("../repos/locationRepo");

var router = express.Router();

router.get("/", (req, res) => {
    console.log("request get location: ");
    locationRepo
        .list()
        .then(addresses => {
            if (addresses) {
                console.log("addresses: ", addresses);
                res.json({
                    addresses: addresses,
                    status: "TRUE"
                });
            }
        })
        .catch(err => {
            res.json({
                addresses: null,
                status: "FALSE"
            });
        });
});

router.post("/", (req, res) => {
    console.log(req.body);
    locationRepo
        .post(req.body)
        .then(row => {
            res.json({
                status: "TRUE",
                message: "Insert location is successfull!"
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FALSE",
                message: "Insert location is failure!"
            });
        });
});

router.put("/", (req, res) => {
    console.log("Update location item with user: ", req.body);
    const { id, location, distance } = req.body;
    // const postion = JSON.stringify(location);
    locationRepo
        .updateLocation(id, JSON.stringify(location), distance)
        .then(row => {
            res.json({
                status: "TRUE",
                message: "Update location is successfull!"
            });
        })
        .catch(err => {
            res.json({
                status: "FALSE",
                message: "Update location is failure!"
            });
        });
});

router.put("/user", (req, res) => {
    console.log("Update location item with user: ", req.body);
    const { username, location } = req.body;
    // const postion = JSON.stringify(location);
    locationRepo
        .updateUserLocation(username, location)
        .then(row => {
            res.json({
                status: "TRUE",
                message: "Update location is successfull!"
            });
        })
        .catch(err => {
            res.json({
                status: "FALSE",
                message: "Update location is failure!"
            });
        });
});

router.get("/user", (req, res) => {
    // const postion = JSON.stringify(location);
    locationRepo
        .locationAccounts()
        .then(row => {
            res.json({
                data: row,
                status: "TRUE",
                message: "get user location is successfull!"
            });
        })
        .catch(err => {
            res.json({
                status: "FALSE",
                message: "get user location is failure!"
            });
        });
});
router.delete("/", (req, res) => {
    console.log("Delete cart item with user: ", req.body.id);
    locationRepo
        .delete(req.body.id)
        .then(row => {
            res.json({
                status: "TRUE",
                message: "Delete location is successful!"
            });
        })
        .catch(err => {
            res.json({
                status: "FALSE",
                message: "Insert location is failure!"
            });
        });
});
module.exports = router;
