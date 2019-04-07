var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    cors = require("cors"),
    dotenv = require("dotenv").config();

var app = express();
var productCtrl = require("./apiControllers/ProductController");
var checkoutCtrl = require("./apiControllers/CheckoutControllers");
var userCtrl = require("./apiControllers/userControllers");
var cartCtrl = require("./apiControllers/cartControllers");
var accountCtrl = require("./apiControllers/accountControllers");
var authCtrl = require("./apiControllers/authController");
// var otpCtrl = require("./apiControllers/otpVerificationController");

var verifyAccessToken = require("./repos/authRepo").verifyAccessToken;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        msg: "hello from nodejs express api"
    });
});

app.use("/product/", productCtrl);
app.use("/checkout/", checkoutCtrl);
app.use("/users/", userCtrl);
app.use("/cart/", cartCtrl);
app.use("/accounts/", verifyAccessToken, accountCtrl);
app.use("/auth/", authCtrl);
// app.use("/otp/", verifyAccessToken, otpCtrl);

var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Backend API is running on port ${port}`);
});
