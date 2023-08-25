// @ts-check
// server side working file
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";


import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
// import { useAuthenticatedFetch } from "./frontend/hooks/useAuthenticatedFetch.js";





const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());


app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});


app.get("/api/collections/433787502876", async (_req, res) => {
  try {
    const response = await shopify.api.rest.Collection.find({
      session: res.locals.shopify.session, 
      id: 433787502876,
    });

    // console.log("response==============", response);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/orders', async (_req, res)=>{
  try {
    const response = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: "any",
    });

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.get('/api/customers', async(_req, res)=>{

  try {
    const response = await shopify.api.rest.Customer.find({
      session: res.locals.shopify.session,
      id: 7144007401756,
    });

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});



// app.get("/api/cart", async (_req, res) => {
//   const apiKey = "0a4c1a1e9af392b3248c290bf81a201f";
//   const apiSecret = "b53ec29e8b7271793cc419411fdfaf62";
//   const storeUrl = "https://onepulsedemo.myshopify.com"; // Replace with your actual store URL

//   const authHeader = btoa(`${apiKey}:${apiSecret}`);
//   const apiUrl = `${storeUrl}/carts.json`; // Corrected endpoint URL

//   const headers = {
//     Authorization: `Basic ${authHeader}`,
//   };

//   try {
//     const response = await fetch(apiUrl, { headers });
//     const cartData = await response.json();
//     res.status(200).send({ cartData });
//     console.log("cartData=======", cartData);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({ error: "Failed to retrieve cart data" });
//   }
// });







app.get('/api/checkouts/c4deaf5f16ea597987b4eb616cb52d29', async(_req, res)=>{


    const response = await shopify.api.rest.Checkout.find({
      session: res.locals.shopify.session,
      token: "c4deaf5f16ea597987b4eb616cb52d29",
    });

    console.log("response==========", response);

    res.status(200).send(response);
  
});





app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);