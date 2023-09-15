import 'dotenv/config' //Para usar variables de entorno
import express from "express";
import { engine } from 'express-handlebars'
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import mongoose from "mongoose";

import path from 'path'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import productModel from './models/products.models.js';


const app = express();
const PORT = 8080;


// Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server)


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas

app.engine('handlebars', engine()); //Defino que trabajo con handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views')) //Defino la ruta de las vistas


// Conexion BD
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("DB Conectada")
        await productModel.create([
            {
                title: 'Alfajor de chocolate',
                description: 'Alfajor de chocolate relleno de dulce de leche',
                price: 350,
                stock: 50,
                category: 'Alfajores',
                code: 'ALFAJOR001',
                thumbnails: [],
            },
            {
                title: 'Alfajor de dulce de leche',
                description: 'Alfajor relleno de dulce de leche',
                price: 250,
                stock: 50,
                category: 'Alfajores',
                code: 'ALFAJOR002',
                thumbnails: [],
            },
            {
                title: 'Alfajor de membrillo',
                description: 'Alfajor relleno de membrillo',
                price: 300,
                stock: 50,
                category: 'Alfajores',
                code: 'ALFAJOR003',
                thumbnails: [],
            },
            {
                title: 'Marquisse',
                description: 'Torta Marquisse',
                price: 8000,
                stock: 10,
                category: 'Tortas',
                code: 'TORTA001',
                thumbnails: [],
            },
            {
                title: 'Cheesecake de Frutos Rojos',
                description: 'Clasico cheesecake de frutos rojos',
                price: 7500,
                stock: 10,
                category: 'Tortas',
                code: 'TORTA002',
                thumbnails: [],
            },
            {
                title: 'Chocotorta',
                description: 'Chocotorta XL',
                price: 7800,
                stock: 15,
                category: 'Tortas',
                code: 'TORTA003',
                thumbnails: [],
            },
            {
                title: 'Cheesecake Oreo',
                description: 'Cheesecake de Oreo',
                price: 8500,
                stock: 10,
                category: 'Tortas',
                code: 'TORTA004',
                thumbnails: [],
            },
            {
                title: 'Cheesecake de dulce de leche',
                description: 'Cheesecake de dulce de leche y oreo',
                price: 8600,
                stock: 10,
                category: 'Tortas',
                code: 'TORTA005',
                thumbnails: [],
            },
            {
                title: 'Cuadrados de coco',
                description: 'Cuadrado de coco y dulce de leche',
                price: 500,
                stock: 20,
                category: 'Finger Food',
                code: 'FINGERF001',
                thumbnails: [],
            },
            {
                title: 'Mini Rogel',
                description: 'capas crocantes con dulce de leche',
                price: 900,
                stock: 15,
                category: 'Finger Food',
                code: 'FINGERF002',
                thumbnails: [],
            },
            {
                title: 'Brownies',
                description: 'Brownies de chocolate',
                price: 600,
                stock: 50,
                category: 'Finger Food',
                code: 'FINGERF003',
                thumbnails: [],
            },
            {
                title: 'Tarteleta de frutilla',
                description: 'Tarteleta con frutillas y crema',
                price: 600,
                stock: 25,
                category: 'Finger Food',
                code: 'FINGERF004',
                thumbnails: [],
            },
        ])
    })
    .catch((error) => console.log("Error de conexion a MongoDB Atlas ", error))


// Conexion Socket.io
io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', info => {
        console.log(info)
        socket.emit('respuesta', true)
    })

    socket.on('nuevoProducto', async (prod) => {
        await prodManager.addProduct(prod)

        const products = await prodManager.getProducts()
        socket.emit("products", products);

        socket.emit('mensajeProductoCreado', "Producto creado correctamente")
    })
})


// Routes
app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


// Handlebars
app.get('/static', async (req, res) => {
    const getProductos = await prodManager.getProducts()
    //Indico la plantilla a utilizar
    res.render('home', {
        rutaCSS: 'home.css',
        rutaJS: 'script.js',
        titulo: "Ver Productos",
        // productos: getProductos.resp,
        productos: getProductos,
        // hayProductos: getProductos.resp != "No hay productos cargados"
        hayProductos: getProductos != "No hay productos cargados"
    })
})

app.get('/static/realTimeProducts', (req, res) => {
    //Indico la plantilla a utilizar
    res.render('realTimeProducts', {
        rutaCSS: 'realTimeProducts.css',
        rutaJS: 'realTimeProducts.js',
        titulo: "Crear Producto",
    })
})