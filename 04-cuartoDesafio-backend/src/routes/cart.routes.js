import {Router} from 'express'
import { CartManager } from '../controllers/CartManager.js'


const routerCart = Router()
const cartManager = new CartManager("./src/models/cart.txt")


// Consulta completa
routerCart.get('/:cid', async (req, res) => {
    const { status, resp  } = await cartManager.getCart(parseInt(req.params.cid));
    res.status(status).send(resp);
})


// Cargar carrito
routerCart.post('/', async (req, res) => {
    const {status, resp} = await cartManager.addCart(req.body);
    res.status(status).send(resp);
})


// Cargar producto en un carrito
routerCart.post('/:cid/product/:pid', async (req, res) => {
    const {status, resp} = await cartManager.addProdCart(parseInt(req.params.cid), parseInt(req.params.pid));
    res.status(status).send(resp);
})

export default routerCart