import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [{
            id_prod: {
                type: Schema.Types.ObjectId, //es de tipo Id autogenerado de MongoDB
                ref: 'products', //hace referencia a la coleccion productos
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        default: function() {
            return []
        }
    }
})


//Esto hace que por defecto cada vez que haga un "findOne" en mi modelo, va a aplicar "populate" 
cartSchema.pre('findOne', function() {
    this.populate('products.id_prod')
})


const cartModel = model('carts', cartSchema);
export default cartModel;