import { promises as fs } from 'fs'


export class ProductManager {

    constructor() {
        this.path = "./src/productos.txt"
    }

    getProducts = async () => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return(products)
    }
    
    getProductById = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = products.find(producto => producto.id === id)
        if(prod) {
            return(prod)
        } else {
            console.log("El producto no existe")
        }
    }
    
    addProduct = async (product) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(products.find(producto => producto.id == product.id)) {
            return "Producto ya agregado"
        }
        products.push(product)
        await fs.writeFile(this.path, JSON.stringify(products))
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
        } else {
            console.log("Producto no encontrado")
        }
    }
    
    deleteProduct = async (id) => {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prods = products.filter(prod => prod.id != id)
        await fs.writeFile(this.path, JSON.stringify(prods))
    }
}




class Producto {
    constructor(nombre, descripcion, precio, img, codigo, stock) {
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
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}




const pruebaFunciones = async () => {
    await productManager.addProduct(producto1)
    await productManager.addProduct(producto2)
    await productManager.getProductById(producto2.id)
    await productManager.updateProduct(producto2.id, {nombre: "alfajor", descripcion: "coco", precio: "3500", img: "", codigo: 234678, stock: 15})
    await productManager.getProducts()
}

const producto1 = new Producto("brownie", "chocolate", 4000, "", 464829, 15)
const producto2 = new Producto("chocotorta", "oreo", 5000, "", 543524, 15)

const productManager = new ProductManager()

pruebaFunciones();





