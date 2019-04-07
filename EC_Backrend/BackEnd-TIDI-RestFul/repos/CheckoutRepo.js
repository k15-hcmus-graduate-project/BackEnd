var md5 = require("crypto-js/md5");
var kn = require("../fn/db");
var userRepo = require("../repos/userRepo");

exports.getCouponStatus = coupon =>
    kn("coupon")
        .select("*")
        .where("coupon_code", coupon)
        .first();

exports.getOrderDetail = async query => {
    var order = null;
    if (query) {
        order = await kn
            .from("orders")
            .select("*")
            .where("id", query.orderId)
            .first();
    }

    if (order) {
        console.log("gotten order: ", order);
        //get order details
        var detailsOrder = await kn
            .from("ordersdetail")
            .select("product_id")
            .where("orders_id", order.id);
        var products = [];
        if (detailsOrder) {
            detailsOrder.map(async item => {
                let product = await kn
                    .from("product")
                    .select("*")
                    .where("id", item.product_id)
                    .first();
                products.push(product);
            });
        }
        order.products = products;
        var history = await kn
            .from("orders_history")
            .select("*")
            .where("orders_id", order.id);
        order.history = history;
    }
    return order;
};

exports.insertOrder = async orderInfo => {
    console.log("orderInfo: ", orderInfo);
    var date = new Date();
    var insertOrder = await kn
        .from("orders")
        .insert({
            accounts_id: orderInfo.idAccount,
            fullName: orderInfo.fullName,
            phone: orderInfo.phone,
            email: orderInfo.email,
            address: orderInfo.address,
            total: orderInfo.finalTotal,
            coupon_id: orderInfo.idCoupon,
            status: "PENDING",
            note: orderInfo.note,
            active: true,
            date: date
        })
        .returning("id");

    console.log("id order: ", insertOrder);
    if (insertOrder) {
        const { products } = orderInfo;
        products.map(async item => {
            var insertDetails = await kn.from("ordersdetail").insert({
                orders_id: insertOrder,
                product_id: item.proID,
                amount: item.amount,
                original_price: item.price,
                final_price: item.price,
                active: true
            });
        });

        var FirstHisOrder = await kn
            .from("orders_history")
            .insert({ orders_id: insertOrder, status: "CHECKED", date_time: date, active: "TRUE" });
    }
    return insertOrder;
};
exports.updateHistory = query => {
    var date = new Date();
    return kn.from("orders_history").insert({ orders_id: query.orderId, status: query.status, date_time: date, active: "TRUE" });
};
exports.updateOrder = async query => {
    var id = query.orderId;
    delete query.orderId;
    var updateOrder = await kn
        .from("orders")
        .update(query)
        .where("id", id);
    if (updateOrder) {
        var date = new Date();
        return kn.from("orders_history").insert({ orders_id: id, status: query.status, date_time: date, active: "TRUE" });
    } else return null;
};

exports.listOrders = async query => {
    var orders = [];
    if (query) {
        orders = await kn
            .from("orders")
            .select("*")
            .limit(query.limit)
            .offset(query.offset);
    } else {
        orders = await kn.from("orders").select("*");
    }

    if (orders) {
        const arrSize = orders.length;
        // loop through orders list
        for (var i = 0; i < arrSize; i++) {
            //get user
            var user = await userRepo.single(orders[i].accounts_id);
            orders[i].user = user;
            //get order details
            var detailsOrder = await kn
                .from("ordersdetail")
                .select("product_id")
                .where("orders_id", orders[i].id);
            var products = [];
            if (detailsOrder) {
                detailsOrder.map(async item => {
                    let product = await kn
                        .from("product")
                        .select("*")
                        .where("id", item.product_id)
                        .first();
                    products.push(product);
                });
            }
            orders[i].products = products;
            var history = await kn
                .from("orders_history")
                .select("*")
                .where("orders_id", orders[i].id);
            orders[i].history = history;
        }
    }
    var size = await kn.from("orders").count("* as size");
    return {
        orders: orders,
        totalItems: size[0].size
    };
};
