const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const storeSchema = new Schema({ 

    id_user: String,
    order: Array,
    payment: Array,
    tgl_order_all: String

});

const Store = mongoose.model('stores', storeSchema);

module.exports = Store;