const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const barangSchema = new Schema({ 
  nama_barang: String,
  harga: String,
  img: String,
  img_url: String
});

const Barang = mongoose.model('barangs', barangSchema);
// It will create a ‘Users’ collection!
module.exports = Barang;