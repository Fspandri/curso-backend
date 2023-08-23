import express from "express"
import { engine } from "express-handlebars"
import prodRouter from "./routes/productos.routes.js";
import routerCart from "./routes/cart.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import { ExpressHandlebars } from 'express-handlebars';
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

// **** Server ****//
const server = app.listen(PORT, () => {
  console.log(`Server on port {http://localhost:${PORT}}`);
});

const io = new Server(server)


// **** Middleware ****//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"))


// **** Routes ****//
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/api/products", prodRouter);
app.use('/api/carts', routerCart);
/***Handlebars***/
app.get("/static", (req, res) => {
  res.render("home",{})
})
app.get("/static/realTimeProducts", (req, res) => {
  res.render("realTimeProducts",{})
})

