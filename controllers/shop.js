const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([row]) => {
      res.render("shop/product-list", {
        prods: row,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    // console.log(product);
    res.render("shop/product-details", {
      pageTitle: product.title,
      product: product,
      path: "/product-details",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCartProducts((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postDelete = (req, res, next) => {
  console.log("request from cart is", req.body.productId);
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    // console.log(`product received from find id is ${JSON.stringify(product)}`);
    const prodPrice = product.price;
    Cart.deleteProduct(prodId, prodPrice);
    res.redirect("/cart");
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log("added to cart ", prodId);
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("/cart");
    // res.render("shop/cart", { path: "/cart", pageTitle: "cart" });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
