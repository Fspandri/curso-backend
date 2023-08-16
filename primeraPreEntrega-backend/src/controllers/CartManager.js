import { promises as fs } from 'fs'


export class CartManager {

    constructor(path) {
        this.path = path
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    getCart = async (id) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const cart = carts.find(carritos => carritos.id === id)
        if(carts.length > 0){
            return{status: 200, resp: cart.products}
        } else {
            return{status: 400, resp: "No hay carritos cargados"}
        }
    }

    addCart = async (products) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const nuevoCart = {id: CartManager.incrementarID(), products: products}
        carts.push(nuevoCart)
        await fs.writeFile(this.path, JSON.stringify(carts))
        return{status: 200, resp: "Carrito creado correctamente"}
    }

    addProdCart = async (cid, pid) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const cart = carts.find(cart => cart.id === cid)

        if(!cart){
            return{status: 404, resp: "Carrito no existente"}
        }

        const productIndex = cart.products.findIndex(prod => prod.id === pid)
        
        if(productIndex){
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({id: pid, quantity: 1});
            
        }

        await fs.writeFile(this.path, JSON.stringify(carts))
        return{status: 200, resp: "Producto cargado correctamente"}
    }
}