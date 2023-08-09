import express from 'express'
import { ProductManager } from './ProductManager.js'

const app = express();
const PORT = 4000;
const prodManager = new ProductManager()

app.use(express.urlencoded({ extended: true }));

// Ruta de inicio
app.get('/', (req, res) => {
    res.send("Bienvenidos!");
});

// Consulta completa con query params
app.get('/productos', async (req, res) => {
    const { limit } = req.query;
    const products = await prodManager.getProducts();
    limit ? res.send(products.slice(0,limit)) : res.send(products);
})

// Consulta por id
app.get('/productos/:id', async (req, res) => {
    const prod = await prodManager.getProductById(parseInt(req.params.id));
    prod ? res.send(prod) : res.send("Producto no encontrado");
});

// Informe de ruta incorrecta
app.get('*', (req, res) => {
    res.send("Error 404");
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});