import { Router } from "express";
import cartModel from "../models/carts.models.js"

const cartRouter = Router()


//GET. getCartById
cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        res.status(200).send({ resultado: 'OK', message: cart });
    } catch (error) {
        res.status(400).send({ error: `Error al consultar carrito: ${error}` });
    }
});


//POST. createCart
cartRouter.post('/', async (req, res) => {
	try {
		const respuesta = await cartModel.create({});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});


//POST. addProductToCart
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if(cart) {
            cart.products.push({id_prod: pid, quantity: quantity})
            const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
            res.status(200).send({resp: 'ok', message: respuesta})
        } else {
            res.status(404).send({resp: 'Not Found', message: respuesta});
        }
    } catch (error) {
        res.status(400).send({error: `Error al agregar producto: ${error}`});
    }
})


//PUT. updateCart
cartRouter.put('/:cid', async (req, res) => {
	const { cid } = req.params;
	const { updateProducts } = req.body;

	try {
		const cart = await cartModel.findById(cid);
		updateProducts.forEach(prod => {
			const productInCart = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod);
			if (productInCart) {
				productInCart.quantity += prod.quantity;
			} else {
				cart.products.push(prod);
			}
		});
		const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ resultado: 'OK', message: respuesta })
	} catch (error) {
		res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
	}
});


//PUT. updateProductQuantityInCart
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);
        if(cart) {
            const productInCart = cart.products.find(cartProd => cartProd.id_prod == pid);
            if(productInCart){
                productInCart.quantity = quantity;
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ resultado: 'OK', message: respuesta })
            } else {
                res.status(404).send({resp: 'Not Found', message: cart});
                return;
            }
        } else {
            res.status(404).send({resp: 'Not Found', message: cart});
        }
    } 
    catch (error) {
        res.status(400).send({error: `Error al actualizar producto: ${error}`});
    }
})


//DELETE. deleteProductFromCart
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        if(cart) {
            const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
            if(productIndex !== -1) {
                cart.products.splice(productIndex, 1)
            } else {
                res.status(404).send({resp: 'Not Found', message: cart});
                return;
            }
            const respuesta = await cartModel.findByIdAndDelete(cid, cart);
            res.status(200).send({resp: 'ok', message: respuesta})
        } else {
            res.status(404).send({resp: 'Not Found', message: respuesta});
        }
    } catch (error) {
        res.status(400).send({error: `Error al eliminar producto: ${error}`});
    }
})


//DELETE. clearCart
cartRouter.delete('/:cid', async (req, res) => {
	const { cid } = req.params;

	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		if(cart) {
            res.status(200).send({resp: 'ok', message: cart})
        } else {
            res.status(404).send({resp: 'Not Found', message: respuesta});
        }
	} catch (error) {
		res.status(400).send({error: `Error al vaciar carrito: ${error}`});
	}
});


export default cartRouter