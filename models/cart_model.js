const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const cartSchema = new Schema({ 

    id_store: String,
    id_user: String,
    nama_barang: String,
    harga: String,
    tgl_cart: String

});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;