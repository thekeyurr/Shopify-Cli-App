// @ts-check
// server side working file
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";


import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";


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
  console.log('countData=========>', countData);
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

    console.log("response==============", response);

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
})


// app.get('/api/checkouts/5a7d68affe475df29ac00a8429d3a022', async(_req, res)=>{
//   try {
//     // const checkout = new shopify.api.rest.Checkout({session: res.locals.shopify.session});
//     // checkout.token = "5a7d68affe475df29ac00a8429d3a022";
//     // await checkout.complete({});

//     //   res.status(200).send(checkout);

//     //   console.log("checkout=======",checkout);

//     const response = await shopify.api.rest.Checkout.find({
//       session: res.locals.shopify.session,
//       token: "5a7d68affe475df29ac00a8429d3a022",
//     });

//     console.log("checkout=========", response); 

//     res.status(200).send(response);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// })

app.get("/api/checkouts", async (_req, res) => {
  try {

    const token = "5a7d68affe475df29ac00a8429d3a022";
    console.log("Fetching checkout with token:", token);

    const response = await shopify.api.rest.Checkout.find({
      session: res.locals.shopify.session,
      token: token,
    });

    console.log("checkout================", await response);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});




app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
