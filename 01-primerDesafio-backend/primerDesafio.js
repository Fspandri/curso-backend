class ProductManager {
    constructor() {
        this.productos = []
    }

    getProducts() {
        return this.productos
    }

    getProductById (id) {
        let producto = this.productos.find(prod => prod.id == id)
        
        if (producto) {
            return producto
        }
        return "Not Found"
    }

    addProduct (producto) {
        if (this.productos.find(prod=> prod.codigo == producto.codigo)) {
            return "Producto ya presente con este codigo"
        }

        if(producto.codigo != "" || producto.stock >= 0) {
            this.productos.push(producto)
        } else {
            return "No se puede cargar un producto vacio"
        }
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

const producto1 = new Producto("lapiz", "negro", 100, "", 78965, 10)
const producto2 = new Producto("lapicera", "azul", 200, "", 78895, 10)

const productManager = new ProductManager()

productManager.addProduct(producto1)
productManager.addProduct(producto2)

console.log(productManager.getProducts())
console.log(productManager.getProductById(2))