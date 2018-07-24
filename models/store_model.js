const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const storeSchema = new Schema({

    id_user: String,
    status_pembayaran:String,
    status_pengiriman: String,
    tgl_store: String

});

const Store = mongoose.model('stores', storeSchema);

module.exports = Store;