var express = require('express');
var store_router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');
var Store = require('../models/store_model');
var User = require('../models/user_model');

var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
mongoose.connect(url, () => {
    console.log('Terhubung ke Route Store')
});

var MongoStore = require('connect-mongo')(session);

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
		Store.findOne({ user_id: req.body.user_id }, function(err, user) {
			
			if (user) {

				new Cart({

					id_store: store.data._id,
					id_user: store.id_user,
					nama_barang: req.body.nama_barang,
					harga: req.body.harga,
					tgl_cart: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
				
				}).save().then((data)=>{
					console.log('Data masuk cart: '+ data);
					res.send(data);
				})

 
			} else { 

				new Store({

					id_user: req.body.user_id,
					status_pembayaran: '',
					status_pengiriman: '',
					tgl_store: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
				
				}).save().then((store)=>{
					
					req.session.id_store = store._id ;
				})

				if(!req.session.id_store){
					console.log('tidak ada')
				} else {
					console.log(req.session.id_store)
				}
				// new Cart({

				// 	id_store: store.data._id, 
				// 	id_user: store.id_user,
				// 	nama_barang: req.body.nama_barang,
				// 	harga: req.body.harga,
				// 	tgl_cart: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
				
				// }).save().then((data)=>{
				// 	console.log('Data masuk cart store: '+ data);
				// 	res.send(data);
				// })
				


			}
		});

	} else {
		res.send('Data masih ada yang kosong')
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
				console.log('Data masuk: '+ data);
				res.send(data);
			}) 
		});

	} else {

		res.send('Data masih ada yang kosong')
 
	}
	
});

store_router.get('/session', (req, res) => {
	var data_session = req.session;
	console.log(req.session)
	res.send(data_session)
})
 
store_router.get('/logout/user', (req, res) => {

	// req.session.destroy((response)=>{
	// 	console.log(response)
	// 	// console.log(data)
	// })

	var session_userId = ()=>{
		req.session.userOid = req.session.userId
	};
	
	res.send(session_userId);
})

store_router.get('/:nama', function (req, res) {
	return res.send("<h1>Anda mengirim request GET /"+req.params.nama+"</h1>");
});

module.exports = store_router;
