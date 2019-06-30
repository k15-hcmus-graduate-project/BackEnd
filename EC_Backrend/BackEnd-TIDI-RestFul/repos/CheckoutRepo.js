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

exports.insertOrder = async (orderInfo, Parse) => {
    console.log("orderInfo: ", Parse);
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
        await kn
            .from("orders")
            .update({ uid: insertOrder })
            .where("id", insertOrder);

        var date = new Date();
        const { products } = orderInfo;
        products.map(async item => {
            console.log("pro item: ", item);
            var insertDetails = await kn.from("ordersdetail").insert({
                orders_id: insertOrder,
                product_id: item.proID,
                amount: item.amount,
                original_price: item.price,
                final_price: item.price,
                active: true,
                store: item.store,
                created_date: date
            });

            // update product sold number
            var sold = await kn
                .from("product")
                .select("sold")
                .where("id", item.proID)
                .first();

            console.log("sold: ", sold.sold);
            const vl = parseInt(sold.sold, 10) + item.amount;
            console.log("vl update: ", vl);
            var resUpdate = await kn
                .from("product")
                .update({ sold: vl })
                .where("id", item.proID);

            var stock = await kn
                .from("product")
                .select("amount")
                .where("id", item.proID)
                .first();
            let amountToUpdate = parseInt(stock.amount, 10) - item.amount;
            stock = await kn
                .from("product")
                .update({ amount: amountToUpdate })
                .where("id", item.proID);
            console.log("amount pro after insert: ", stock);
            var parseQuery = new Parse.Query("product");
            await parseQuery.equalTo("id", item.proID);
            if (parseQuery) {
                parseQuery.first().then(object => {
                    object.set("amount", amountToUpdate);
                    object.set("changeAmount", true);
                    object
                        .save()
                        .then(resPro => {
                            console.log("update amount pro parse successful.");
                        })
                        .catch(errPro => {
                            console.log("update pro amount parse fail.");
                        });
                });
            }
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

exports.updateOrderAdminParseServer = async (parseQuery, id, data) => {
    console.log("data to update order parse: ", id, data, parseQuery);
    await parseQuery
        .first()
        .then(async object => {
            object.set("status", data.status);
            await object
                .save()
                .then(result => {
                    return true;
                    console.log("save order admin successful");
                })
                .catch(err => {
                    return false;
                    console.log("cannot save to parse");
                });
        })
        .catch(err => {
            console.log("cannot connect to parse server to save order admin.");
            return false;
        });
    return true;
};

exports.insertOrderParseAdmin = async (parseQuery, id, data) => {
    console.log("insert data to parse: ", id[0], data);

    parseQuery.set("uid", parseInt(id[0], 10));
    parseQuery.set("username", data.username);
    parseQuery.set("status", "PENDING");
    parseQuery
        .save()
        .then(res => {
            console.log("save order success: ", res);
        })
        .catch(err => {
            console.log("cannot save order parse: ", err);
        });
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
