import { Router } from 'express'
import { ProductManager, Producto } from '../controllers/ProductManager.js'

const productManager = new ProductManager('./src/models/productos.txt')

const routerProd = Router()

// Consulta completa
routerProd.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()
    if(limit){
        const products = prods.slice(0, limit)
        res.status(200).send(products)
    } else {
        res.status(200).send(prods)
    }
})

// Consulta por ID
routerProd.get('/:id', async (req, res) => {
    const { id } = req.params
    const { estado, respuesta } = await productManager.getProductById(parseInt(id))
    res.status(estado).send(respuesta)
})

// Crear producto
routerProd.post('/', async (req, res) => {
    const nuevoProducto = new Producto(req.body)
    const { estado, respuesta } = await productManager.addProduct(nuevoProducto)
    res.status(estado).send(respuesta)
})

// Modificar producto
routerProd.put('/:id', async (req, res) => {
    const { estado, respuesta } = await productManager.updateProduct(parseInt(req.params.id), req.body)
    res.status(estado).send(respuesta)
})

// Borrar producto
routerProd.delete('/:id', async (req, res) => {

    const { estado, respuesta } = await productManager.deleteProduct(req.params.id)
    res.status(estado).send(respuesta)
})

// Informe de ruta incorrecta
routerProd.get('*', (req, res) => {
    res.status(404).send("Error 404. Pagina no encontrada");
});

export default routerProd