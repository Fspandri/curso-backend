import { promises as fs } from 'fs'


export class ProductManager {

    constructor(path) {
        this.path = path
    }

    getProducts = async () => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return(products)
    }
    
    getProductById = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = products.find(producto => producto.id === id)
        if(prod) {
            return{estado: 200, respuesta: prod}
        } else {
            return{estado: 404, respuesta: "El producto no existe"}
        }
    }
    
    addProduct = async (product) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(products.find(producto => producto.id == product.id)) {
            return {estado: 400, respuesta: "Producto ya existente"}
        }
        products.push(product)
        await fs.writeFile(this.path, JSON.stringify(products))
        return {estado: 200, respuesta: "Producto cargado correctamente"}
    }
    
    updateProduct = async (id, {nombre, descripcion, precio, img, codigo, stock}) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        let indice = products.findIndex(prod => prod.id === id)
        if(indice != -1){
            products[indice].nombre = nombre
            products[indice].descripcion = descripcion
            products[indice].precio = precio
            products[indice].img = img
            products[indice].codigo = codigo
            products[indice].stock = stock
            
            await fs.writeFile(this.path, JSON.stringify(products))
            return {estado: 200, respuesta: "Producto modificado correctamente"}
        } else {
            return{estado: 404, respuesta: "El producto no existe"}
        }
    }
    
    deleteProduct = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prods = products.filter(prod => prod.id != id)
        if(prods){
            await fs.writeFile(this.path, JSON.stringify(prods))
            return {estado: 200, respuesta: "Producto borrado correctamente"}
        }else{
            return{estado: 404, respuesta: "El producto no existe"}
        }
    }
}




export class Producto {
    constructor({nombre, descripcion, precio, img, codigo, stock}) {
        this.nombre = nombre 
        this.descripcion = descripcion
        this.precio = precio
        this.img = img
        this.codigo = codigo
        this.stock = stock
        this.id = Producto.incrementarID()
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 3
        }
        return this.idIncrement
    }
}






