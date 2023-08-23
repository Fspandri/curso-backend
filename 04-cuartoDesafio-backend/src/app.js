import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io";
import prodRouter from "./routes/productos.routes.js";
import routerCart from "./routes/cart.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import { ProductManager } from './controllers/ProductManager.js'

const productManager = new ProductManager('./src/models/productos.txt')

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

// **** Conexion de Socket.io ****//
io.on ("connection", socket => {
	console.log("Conexión con Socket.io");

  socket.on("load", async () => {
		const products = await productManager.getProducts();
		socket.emit("productos", products);
	});

	socket.on("nuevoProducto", async (producto) => {
		const resp = productManager.addProduct(producto);
    console.log(resp.resp)
    console.log(resp.status)
    socket.emit('mensajeProductoCreado', "Producto creado correctamente")
	});
  })

// **** Routes ****//
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/api/products", prodRouter);
app.use('/api/carts', routerCart);
/***Handlebars***/
app.get("/static", async (req, res) => {
  const productos = await productManager.getProducts()
  console.log(productos)
  res.render("home",{
    rutaJs: "home",
    rutaCSS: "home.css",
    titulo: "Home",
    productos: productos})
})
app.get("/static/realTimeProducts", (req, res) => {
  res.render("realTimeProducts",{
  rutaJs: "realTimeProducts",
  titulo: "Nuevo Producto",
})
})

