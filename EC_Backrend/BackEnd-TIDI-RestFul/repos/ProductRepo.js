var md5 = require("crypto-js/md5");
var kn = require("../fn/db");

exports.listTree = async query => {
    console.log(query); // read query
    let ind = null;
    let totalSize = 0;
    if (query.query) {
        console.log("get with query");
        const { industryId, branchId, categoryId, brandId, minPrice, maxPrice, keyword } = query.query;
        ind = await kn
            .from("product")
            .select("*")
            .where(async function() {
                if (industryId) {
                    console.log("get by industry: ", industryId);
                    await this.where("product.industry_id", "=", parseInt(industryId, 10));
                }
            })
            .andWhere(async function() {
                if (branchId) {
                    console.log("get by branch: ", branchId);
                    await this.where("product.branch_id", "=", parseInt(branchId, 10));
                }
            })
            .andWhere(async function() {
                if (categoryId) {
                    console.log("get by category: ", categoryId);
                    await this.where("product.category_id", "=", parseInt(categoryId, 10));
                }
            })
            .andWhere(async function() {
                if (brandId) {
                    console.log("get by brand: ", brandId);
                    await this.where("product.brand_id", "=", parseInt(brandId, 10));
                }
            })
            .andWhere(async function() {
                if (minPrice) {
                    console.log("get by minPrice: ", minPrice);
                    await this.where("product.price", ">", parseInt(minPrice, 10));
                }
            })
            .andWhere(async function() {
                if (maxPrice) {
                    console.log("get by maxPrice: ", maxPrice);
                    await this.where("product.price", "<", parseInt(maxPrice, 10));
                }
            })
            .andWhere(async function() {
                if (keyword) {
                    console.log("get by keyword: ", keyword);
                    await this.where("product.product_name", "like", "%" + keyword + "%");
                }
            })
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
        totalSize = ind.length;
    } else {
        console.log("get full");
        let temp = await kn.from("product").select("*");
        totalSize = temp.length;
        ind = await kn
            .from("product")
            .select("*")
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
    }

    var res = {};
    let ind_copy = ind;
    console.log("so luong san phamm:  ", ind.length);
    console.log("get field relative ");
    const size = ind.length;
    for (let i = 0; i < size; i++) {
        var b = await kn
            .from("category")
            .select("*")
            .where("id", parseInt(ind[i].category_id))
            .first();
        ind_copy[i].category = b;

        var c = await kn
            .from("branch")
            .select("*")
            .where("id", parseInt(ind[i].branch_id))
            .first();
        ind_copy[i].branch = c;

        var d = await kn
            .from("industry")
            .select("*")
            .where("id", parseInt(ind[i].industry_id))
            .first();
        ind_copy[i].industry = d;

        var f = await kn
            .from("brand")
            .select("*")
            .where("id", parseInt(ind[i].brand_id))
            .first();
        ind_copy[i].brand = f;
    }
    res.products = ind_copy;
    res.totalItems = totalSize;

    return res;
};

exports.listStores = () => kn.select("*").from("address");

exports.history = data =>
    kn
        .select("*")
        .from("ordersdetail")
        .where("product_id", data.id);

exports.insertStore = data =>
    kn
        .from("address")
        .insert({ name: data.store_name, address: data.store_address })
        .returning("id");

exports.listForAdmin = async query => {
    let ind = null;
    let totalSize = 0;
    if (query.query) {
        console.log("get with query");
        const { industryId, branchId, categoryId, brandId, minPrice, maxPrice, keyword } = query.query;
        ind = await kn
            .from("product")
            .select("*")
            .where(async function() {
                if (industryId) {
                    console.log("get by industry: ", industryId);
                    await this.where("product.industry_id", "=", parseInt(industryId, 10));
                }
            })
            .andWhere(async function() {
                if (branchId) {
                    console.log("get by branch: ", branchId);
                    await this.where("product.branch_id", "=", parseInt(branchId, 10));
                }
            })
            .andWhere(async function() {
                if (categoryId) {
                    console.log("get by category: ", categoryId);
                    await this.where("product.category_id", "=", parseInt(categoryId, 10));
                }
            })
            .andWhere(async function() {
                if (brandId) {
                    console.log("get by brand: ", brandId);
                    await this.where("product.brand_id", "=", parseInt(brandId, 10));
                }
            })
            .andWhere(async function() {
                if (minPrice) {
                    console.log("get by minPrice: ", minPrice);
                    await this.where("product.price", ">", parseInt(minPrice, 10));
                }
            })
            .andWhere(async function() {
                if (maxPrice) {
                    console.log("get by maxPrice: ", maxPrice);
                    await this.where("product.price", "<", parseInt(maxPrice, 10));
                }
            })
            .andWhere(async function() {
                if (keyword) {
                    console.log("get by keyword: ", keyword);
                    await this.where("product.product_name", "like", "%" + keyword + "%");
                }
            })
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
        totalSize = ind.length;
    } else {
        console.log("get full");
        let temp = await kn.from("product").select("*");
        totalSize = temp.length;
        ind = await kn
            .from("product")
            .select("*")
            .limit(parseInt(query.limit, 10))
            .offset(parseInt(query.offset, 10));
    }
    var getTotalPros = await kn.from("product").count("* as size");
    var res = {};
    let ind_copy = ind;
    const size = ind.length;
    for (let i = 0; i < size; i++) {
        var b = await kn
            .from("category")
            .select("*")
            .where("id", parseInt(ind[i].category_id))
            .first();
        ind_copy[i].category = b;

        var c = await kn
            .from("branch")
            .select("*")
            .where("id", parseInt(ind[i].branch_id))
            .first();
        ind_copy[i].branch = c;

        var d = await kn
            .from("industry")
            .select("*")
            .where("id", parseInt(ind[i].industry_id))
            .first();
        ind_copy[i].industry = d;

        var f = await kn
            .from("brand")
            .select("*")
            .where("id", parseInt(ind[i].brand_id))
            .first();
        ind_copy[i].brand = f;
    }
    res.products = ind_copy;
    res.totalItems = getTotalPros[0].size;

    return res;
};

exports.single = async uid => {
    let pro = await kn
        .from("product")
        .select("*")
        .where("id", parseInt(uid))
        .first();

    if (pro) {
        let cate = await kn
            .from("category")
            .select("*")
            .where("id", pro.category_id);
        pro.category = cate;

        let branch = await kn
            .from("branch")
            .select("*")
            .where("id", pro.branch_id);
        pro.branch = branch;

        let industry = await kn
            .from("industry")
            .select("*")
            .where("id", pro.industry_id);
        pro.industry = industry;

        let brand = await kn
            .from("brand")
            .select("*")
            .where("id", pro.brand_id);

        pro.brand = brand;
        pro.status = 200;
        return pro;
    }
    pro.status = 500;
    return pro;
};

exports.getDisAndCoupon = async products => {
    const size = products.length;
    for (var i = 0; i < size; i++) {
        let discounts = await kn
            .from("discount")
            .select("*")
            .where("product_id", parseInt(products[i].id));
        products[i].discount = discounts;
        let coupons = await kn
            .from("cou_pro")
            .select("*")
            .where("product_id", parseInt(products[i].id));
        products[i].coupon = coupons;
    }
    return products;
};

exports.updateProductAdmin = product => {
    if (product) {
        var id = product.id;
        delete product.id;
    }
    var res = kn
        .from("product")
        .update(product)
        .where("id", id);
    return res;
};

exports.updateProductAdminParse = (parseQuery, product) => {
    parseQuery
        .first()
        .then(object => {
            console.log("get product parse admin update: ", object);
            const {
                product_name,
                industry_id,
                branch_id,
                category_id,
                brand_id,
                price,
                images,
                description,
                longDescription,
                amount,
                stock,
                active,
                last_updated,
                updated_by
            } = product;
            product_name ? object.set("product_name", product_name) : null;
            industry_id ? object.set("industry_id", industry_id) : null;
            branch_id ? object.set("branch_id", branch_id) : null;
            category_id ? object.set("category_id", category_id) : null;
            brand_id ? object.set("brand_id", brand_id) : null;
            price ? object.set("price", price) : null;
            images ? object.set("images", images) : null;
            description ? object.set("description", description) : null;
            longDescription ? object.set("longDescription", longDescription) : null;
            amount ? object.set("amount", amount) : null;
            stock ? object.set("stock", stock) : null;
            active ? object.set("active", active) : null;
            last_updated ? object.set("last_updated", last_updated) : null;
            updated_by ? object.set("updated_by", updated_by) : null;
            object.set("update", "true");
            object
                .save()
                .then(res => {
                    console.log("update product admin on parse successful");
                    return 1;
                })
                .catch(err => {
                    console.log("cannot udpate product admin on parse: ", err);
                    return 0;
                });
        })
        .catch(errParse => {
            console.log("error connect parse server: ", errParse);
            return 0;
        });
    return 0;
};
exports.add = product =>
    kn
        .from("product")
        .insert(product)
        .returning("id");
