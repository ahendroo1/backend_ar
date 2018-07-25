var express = require('express');
var store_router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');
var Store = require('../models/store_model');
var User = require('../models/user_model');
var Cart = require('../models/cart_model');

var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
mongoose.connect(url, () => {
    console.log('Terhubung ke Route Store')
});

var MongoStore = require('connect-mongo')(session);
var d = new Date();

store_router.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
})); 

store_router.use(bodyParser.json());
store_router.use(cors())

// url : api/login/
store_router.get('/', function (req, res) {

	// User.find((err, user)=>{
	// 	res.send(user);
	// })

	res.send('store')
});


store_router.post('/cart', (req, res) => {

	if (req.body.user_id !== null) {
		// console.log(data_find.length)
		User.findOne({ _id: req.body.user_id }, (err, user) => {
			Store.find({id_user: req.body.user_id, status_transaksi: 0}, (err, store_show) => {
				
				if (store_show.length > 0) {
					// console.log(store_show[0]._id)
					new Cart({
	
						id_store: store_show[0]._id,
						id_user: store_show[0].id_user,
						nama_barang: req.body.nama_barang,
						harga: req.body.harga,
						jumbel: req.body.jumlah_beli,
						total_harga: req.body.harga*req.body.jumlah_beli,
						img_url: req.body.img_url,
						tgl_cart: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
					
					}).save().then((data_cart)=>{
						
						Store.findOne({_id:store_show[0]._id}, (err, store_cari) => {
							if(store_cari){
								return res.send(store_cari);
							}else{
								return res.send(err)
							}
						})
					})
	 
				} else {
	
					new Store({
	
						id_user: req.body.user_id,
						status_pembayaran: 0,
						status_pengiriman: 0,
						status_transaksi: 0,
						total_bayar: 0,
						tgl_store: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),

					}).save().then((cart)=>{

						if(cart){
							new Cart({
	
								id_store: cart._id,
								id_user: cart.id_user,
								nama_barang: req.body.nama_barang,
								harga: req.body.harga,
								jumbel: req.body.jumlah_beli,
								total_harga: req.body.harga*req.body.jumlah_beli,
								img_url: req.body.img_url,
								tgl_cart: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
							
							}).save().then((data)=>{
								Cart.find({id_store: data.id_store}, (err, send_cart) => {
										
									// console.log('Data cart: '+ data);
									res.send(cart);
								})
							})

						} else {
							res.send('Gagal Tambah Keranjang')
						}
						// req.session.id_store = store._id ;
					})
	
				}
			})
			
		});

	} else {
		res.send('Data masih ada yang kosong')
	}
	
})

store_router.get('/data/cart/:id_store', (req, res) => {
	Cart.find({id_store: req.params.id_store }, (err, data_cart) => {
		// console.log(data_cart)
		res.send(data_cart)
	})
})
store_router.get('/data/order/:id_user', (req, res) => {
	Store.find({id_user: req.params.id_user}, (err, data_order) => {
		// console.log(data_order)
		res.send(data_order)
	})
})

store_router.get('/cart/delete/:_id', (req, res)=>{
	if(req.params._id){
		Cart.deleteOne({ _id: req.params._id }, (err, res_delete) => {
			if (res_delete) {
				res.send(res_delete)
			} else {
				res.send(err)
			}
		});

	} else {
		res.send('tidak ada data')
	}

})
 
store_router.post('/', (req, res) => {

	if (req.body.logemail && req.body.logpassword) {
		 
		User.findOne({ email: req.body.logemail }, (err, user) => {
			if (user) {

				if(bcrypt.compareSync(req.body.logpassword, user.password)){

                    return res.send(user);
                    
				} else {

					return res.send(err);
				}
				
			} else {
                
				return res.send(err)
			}
		});
	} 
})

store_router.post('/register', function(req, res){

	if (req.body.email && req.body.username && req.body.password ) {
		// console.log(data_find.length)

		User.findOne({ email: req.body.email }, function(err, user) {
			if (user) {
				return res.send(user);
			}

			var salt = bcrypt.genSaltSync(10);
			new User({
				username: req.body.username,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password, salt),
				status: 0
			}).save().then((data)=>{
				// console.log('Data masuk: '+ data);
				res.send(data);
			}) 
		});

	} else {

		res.send('Data masih ada yang kosong')
 
	}
	
});

store_router.get('/:nama', function (req, res) {
	return res.send("<h1>Anda mengirim request GET /"+req.params.nama+"</h1>");
});

module.exports = store_router;
