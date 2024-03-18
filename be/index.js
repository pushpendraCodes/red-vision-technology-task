const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const { Books } = require("./models/Book");

const env = require("dotenv");
env.config();
const checkauth = require("./services/checkAuth");
const cors = require("cors");
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

const ProductRouter = require("./routes/Product");
const UserRouter = require("./routes/User");
const AuthRouter = require("./routes/Auth");
const OrderRouter = require("./routes/Order");
const CartRouter = require("./routes/Cart");

const { Order } = require("./models/Order");

app.use(express.static(path.resolve(__dirname, "build")));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello node js You are superb");
});

// let Bookss = [
//   {
//     author: "Chinua Achebe",
//     pages: 209,
//     year: 1958,
//     title: "Things Fall Apart",
//     description:
//       "Things Fall Apart is a novel written by Nigerian author Chinua Achebe...",
//     price: 12.99,
//     discountPercentage: 10,
//     rating: 4.7,
//     stock: 50,
//     category: "Fiction",
//     thumbnail: "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     images: [
//       "https://www.bookswagon.com/productimages/images200/676/9780143452676.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/111/9780670097111.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Hans Christian Andersen",
//     pages: 784,
//     year: 1836,
//     title: "Fairy tales",
//     description:
//       "Fairy tales is a collection of stories written by Hans Christian Andersen...",
//     price: 14.99,
//     discountPercentage: 15,
//     rating: 4.5,
//     stock: 100,
//     category: "Children's Literature",
//     thumbnail: "https://www.bookswagon.com/productimages/mainimages/268/9789390166268.jpg",
//     images: [
//       "https://www.bookswagon.com/productimages/mainimages/895/9781786330895.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Dante Alighieri",
//     pages: 928,
//     year: 1315,
//     title: "The Divine Comedy",
//     description:
//       "The Divine Comedy is a long Italian narrative poem by Dante Alighieri...",
//     price: 18.99,
//     discountPercentage: 5,
//     rating: 4.9,
//     stock: 80,
//     category: "Classics",
//     thumbnail: "https://www.bookswagon.com/productimages/images200/401/9789354895401.jpg",
//     images: [
//       "https://www.bookswagon.com/productimages/mainimages/895/9781786330895.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Albert Camus",
//     pages: 160,
//     year: -1700,
//     title: "The Epic Of Gilgamesh",
//     description:
//       "The Epic of Gilgamesh is an ancient Mesopotamian epic poem...",
//     price: 9.99,
//     discountPercentage: 20,
//     rating: 4.6,
//     stock: 30,
//     category: "Mythology",
//     thumbnail: "https://www.bookswagon.com/productimages/images200/697/9781989603697.jpg",
//     images: [
//       "https://www.bookswagon.com/productimages/images200/697/9781989603697.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Albert Camus",
//     pages: 176,
//     year: -600,
//     title: "The Book Of Job",
//     description:
//       "The Book of Job is a book in the Ketuvim section of the Hebrew Bible...",
//     price: 11.99,
//     discountPercentage: 0,
//     rating: 4.3,
//     stock: 20,
//     category: "Religious",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/389/9798454626389.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/389/9798454626389.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Albert Camus",
//     pages: 288,
//     year: 1200,
//     title: "One Thousand and One Nights",
//     description:
//       "One Thousand and One Nights is a collection of Middle Eastern and South Asian stories...",
//     price: 22.99,
//     discountPercentage: 10,
//     rating: 4.8,
//     stock: 60,
//     category: "Literature",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/237/9781526628237.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/237/9781526628237.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Albert Camus",
//     pages: 384,
//     year: 1350,
//     title: "Njál's Saga",
//     description: "Njál's Saga is an Icelandic saga...",
//     price: 17.99,
//     discountPercentage: 25,
//     rating: 4.4,
//     stock: 40,
//     category: "Saga",
//     thumbnail: "images/njals-saga.jpg",
//     images: ["images/njals-saga.jpg"],
//     deleted: false,
//   },
//   {
//     author: "Jane Austen",
//     pages: 226,
//     year: 1813,
//     title: "Pride and Prejudice",
//     description: "Pride and Prejudice is a romantic novel by Jane Austen...",
//     price: 13.99,
//     discountPercentage: 20,
//     rating: 4.9,
//     stock: 70,
//     category: "Romance",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/167/9780143464167.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/167/9780143464167.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Honoré de Balzac",
//     pages: 443,
//     year: 1835,
//     title: "Le Père Goriot",
//     description:
//       "Le Père Goriot is an 1835 novel by French novelist and playwright Honoré de Balzac...",
//     price: 16.99,
//     discountPercentage: 15,
//     rating: 4.6,
//     stock: 45,
//     category: "Literature",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/170/9780143459170.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/170/9780143459170.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Samuel Beckett",
//     pages: 256,
//     year: 1952,
//     title: "Molloy, Malone Dies, The Unnamable, the trilogy",
//     description:
//       "Molloy, Malone Dies, The Unnamable is a novel by Irish author Samuel Beckett...",
//     price: 11.99,
//     discountPercentage: 10,
//     rating: 4.7,
//     stock: 55,
//     category: "Modernism",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/212/9780143441212.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/212/9780143441212.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Giovanni Boccaccio",
//     pages: 1024,
//     year: 1351,
//     title: "The Decameron",
//     description:
//       "The Decameron is a collection of novellas by the 14th-century Italian author Giovanni Boccaccio...",
//     price: 19.99,
//     discountPercentage: 10,
//     rating: 4.8,
//     stock: 75,
//     category: "Classic Literature",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/617/9780143464617.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/617/9780143464617.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Jorge Luis Borges",
//     pages: 224,
//     year: 1965,
//     title: "Ficciones",
//     description:
//       "Ficciones is a collection of short stories by Argentine writer and poet Jorge Luis Borges...",
//     price: 14.99,
//     discountPercentage: 0,
//     rating: 4.5,
//     stock: 35,
//     category: "Short Stories",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/751/9780143452751.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/751/9780143452751.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Emily Brontë",
//     pages: 342,
//     year: 1847,
//     title: "Wuthering Heights",
//     description: "Wuthering Heights is Emily Brontë's only novel...",
//     price: 15.99,
//     discountPercentage: 10,
//     rating: 4.6,
//     stock: 65,
//     category: "Gothic Fiction",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/930/9789356999930.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/930/9789356999930.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Albert Camus",
//     pages: 185,
//     year: 1942,
//     title: "The Stranger",
//     description: "The Stranger is a novel by French author Albert Camus...",
//     price: 12.99,
//     discountPercentage: 10,
//     rating: 4.7,
//     stock: 60,
//     category: "Existentialism",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/098/9780143461098.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/098/9780143461098.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Paul Celan",
//     pages: 320,
//     year: 1952,
//     title: "Poems",
//     description: "A collection of poems by Romanian-born poet Paul Celan...",
//     price: 13.99,
//     discountPercentage: 0,
//     rating: 4.4,
//     stock: 40,
//     category: "Poetry",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/798/9780670098798.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/798/9780670098798.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Louis-Ferdinand Céline",
//     pages: 505,
//     year: 1932,
//     title: "Journey to the End of the Night",
//     description:
//       "Journey to the End of the Night is the first novel by Louis-Ferdinand Céline...",
//     price: 16.99,
//     discountPercentage: 10,
//     rating: 4.5,
//     stock: 50,
//     category: "Modernist Literature",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/751/9780143452751.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/751/9780143452751.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
//   {
//     author: "Miguel de Cervantes",
//     pages: 1056,
//     year: 1610,
//     title: "Don Quijote De La Mancha",
//     description:
//       "Don Quijote De La Mancha is a Spanish novel by Miguel de Cervantes...",
//     price: 20.99,
//     discountPercentage: 15,
//     rating: 4.9,
//     stock: 80,
//     category: "Classic Fiction",
//     thumbnail: "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/718/9780174402718.jpg",
//     images: [
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/mainimages/718/9780174402718.jpg",
//       "https://d2g9wbak88g7ch.cloudfront.net/productimages/images200/917/9798545169917.jpg",
//       "https://www.bookswagon.com/productimages/mainimages/368/9781501110368.jpg",
//     ],
//     deleted: false,
//   },
// ];

// app.post("/api/books", async (req, res) => {
//   try {
//     // Assuming the request body contains the array of book objects
//     const insertedBooks = await Books.insertMany(Bookss);
//     res.status(201).json(insertedBooks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.use("/books",checkauth, ProductRouter.router);
app.use("/user", checkauth, UserRouter.router);
app.use("/auth", AuthRouter.router);
app.use("/order", checkauth, OrderRouter.router);
app.use("/cart",checkauth, CartRouter.router);

// for bulk upload

// app.post("/upload", async (req, res) => {
//   try {
//     const products = req.body; // Assuming the request body contains an array of products

//     for (let i = 0; i < products.length; i++) {
//       delete products[i].id;
//       const product = new Product(products[i]);
//       await product.save();
//     }

//     res.json({ message: "Products uploaded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error uploading products" });
//     console.log(error);
//   }
// });




main().catch((err) => console.log(err));

async function main() {
  mongoose
    .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log("mongo_db connected");
    });
}

const htttpServer = http.createServer(app);
htttpServer.listen(port, () => {
  console.log("Server is running on port 4000");
});
