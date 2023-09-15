import { Router } from "express";
import productModel from "../models/products.models.js"

const productRouter = Router()


//GET. getAllProducts
productRouter.get('/', async (req,res) => {
    const { limit, page, sort, category, status } = req.query;
    
    let sortOption = null;
    if (sort === 'asc') {
        sortOption = 'price';
    } else if (sort === 'desc') {
        sortOption = '-price';
    }

    const options = {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort: sortOption,
    };

    const query = {};
    category && (query.category = category);
    status && (query.status = status);

try {
    const prods = await productModel.paginate(query, options);
    res.status(200).send({ resultado: 'OK', message: prods });
} catch (error) {
    res.status(400).send({ error: `Error al consultar productos: ${error}` });
}
});


//GET getProductsById
productRouter.get('/:id', async (req,res) => {
    const {id} = req.params;

    try {
        const prod = await productModel.findById(id);
        if(prod){
            res.status(200).send({resp: 'OK', message: prod});
        }else{
            res.status(404).send({resp: 'Not Found', message: prod}); //Producto va a devolver null
        }
    } catch (error) {
        res.status(400).send({error: `Error al consultar producto: ${error}`});
    }
})


//POST. createProduct
productRouter.post('/', async (req,res) => {
    const {title, description, stock, code, price, category} = req.body;

    try {
        const respuesta = await productModel.create({
            title, description, stock, code, price, category
        })
        res.status(200).send({resp: 'OK', message: respuesta});
    } catch (error) {
        res.status(400).send({error: `Error al crear producto: ${error}`});
    }
})


//UPDATE. updateProductById
productRouter.put('/:id', async (req,res) => {
    const {id} = req.params;
    const {title, description, stock, code, price, category, status} = req.body;

    try {
        const respuesta = await productModel.findByIdAndUpdate(id, {title, description, stock, code, price, category, status});
        if(prod){
            res.status(200).send({resultado: 'OK', message: respuesta});
        }else{
            res.status(404).send({resultado: 'Not Found', message: respuesta}); //Producto va a devolver null
        }
    } catch (error) {
        res.status(400).send({error: `Error al actualizar producto: ${error}`});
    }
})


//DELETE. delete.ProductById
productRouter.delete('/:id', async (req,res) => {
    const {id} = req.params;

    try {
        const respuesta = await productModel.findByIdAndDelete(id);
        if(prod){
            res.status(200).send({resultado: 'OK', message: respuesta});
        }else{
            res.status(404).send({resultado: 'Not Found', message: respuesta}); //Producto va a devolver null
        }
    } catch (error) {
        res.status(400).send({error: `Error al eliminar producto: ${error}`});
    }
})


export default productRouter