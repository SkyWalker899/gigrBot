'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
var admin = require("firebase-admin");
const port = process.env.PORT || 5000;
var serviceAccount = require("./keys.json");
const messager = require('./lib/message-generator');
const user = 'Jonathan';
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://gigzr-f2a9e.firebaseio.com"
});

var app = express();

app.all('*', function (req, res, next) {
    var origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function (request, response) {
    response.render('pages/index');
});

var db = admin.database();

app.get('/', (req, res) => {
	res.send('salut');
})

app.post('/checkId', function (req, res) {
	const body = req.body;
	console.log(req);
	const uid = body['messenger user id'];
	db.ref("owners/" + uid).once('value').then((snapshot) => {
		const user = snapshot.val() || 'undefined';
		if (user !== 'undefined') {
			const response = {
				"redirect_to_blocks": ["known_user"]
			}
			res.send(response);
		}
	})
});

app.post('/saveOwner', (req, res) => {
	const body = req.body;
	const uid = body['messenger user id'];
	const timeNow = Date.now();
	let allGigs;
	const gig = { location: body['gigr_address'], need: body['gigr_need'], quantity: body['gigr_qantity'], time: body['gigr_when'] };
	db.ref("owners/" + uid).once('value').then((snapshot) => {
		const owner = snapshot.val() || 'undefined';
		if (owner !== 'undefined') {
			allGigs = owner.gigs
			allGigs.push(gig);
			db.ref('owners/' + uid).update({
				gigs: allGigs
			})
		} else {
			let gigs = [];
			gigs.push(gig);
			db.ref("owners/" + uid).set({
				uid: uid,
				phone: body['gigr_phone'],
				restaurant: body['gigr_address'],
				gigs: gigs
			})
		}
	}, err => console.log(err));

})

app.post('/saveWorker', (req, res) => {
	const body = req.body;
	const uid = body['messenger user id'];
	db.ref("workers/" + uid).set({
		uid: uid,
		firstName: body['first name'],
		lastName: body['last name'],
		interest: body['worker_type'],
		phone: body['worker_phone'],
		preferedLocation: body['worker_location']
	});
})

app.post('/lastOrders', (req, res) => {
	const body = req.body;
	const uid = body['messenger user id'];
	db.ref("owners/" + uid).once('value').then((snapshot) => {
		const user = snapshot.val() || 'undefined';
		if (user !== 'undefined') {
			const gigLen = user.gigs.length - 1;
			const lastGig = user.gigs[gigLen];
			console.log(JSON.stringify(lastGig))
			const text = `Are you still looking for ${lastGig.need} in ${lastGig.location} ?`
			const buttons = [
				{
					"type": "show_block",
					"block_names": ["returning owner"],
					"title": "YES"
				},
				{
					"type": "show_block",
					"block_names": ["owner_different_need"],
					"title": "NO"
				}
			]
			const message = messager.generateMessageWithButtons(text, buttons);
			res.send(message);
		}
	})
})

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
})



