'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const port = process.env.PORT || 5000;
const messager = require('./lib/message-generator');
const owner = require('./lib/owner');
const FBAPP = require('./lib/firebase.init');

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

app.get('/', (req, res) => {
	res.send('salut');
})

app.post('/checkId', function (req, res) {
	const body = req.body;
	const uid = body['messenger user id'];
	FBAPP.FireDB.ref("owners/" + uid).once('value').then((snapshot) => {
		const user = snapshot.val() || 'undefined';
		if (user !== 'undefined') {
			const response = {
				"redirect_to_blocks": ["known_user"]
			}
			res.send(response);
		} else {
			const response = {
				"redirect_to_blocks": ["INTRO"]
			}
			res.send(response);
		}
	})
});

app.post('/saveOwner', (req, res) => {
	const body = req.body;
	owner.updateOwnerGigs(body);
})

app.post('/saveWorker', (req, res) => {
	const body = req.body;
	const uid = body['messenger user id'];
	FBAPP.FireDB.ref("workers/" + uid).set({
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
	FBAPP.FireDB.ref("owners/" + uid).once('value').then((snapshot) => {
		const user = snapshot.val() || 'undefined';
		if (user !== 'undefined') {
			const gigLen = user.gigs.length - 1;
			const lastGig = user.gigs[gigLen];
			const text = `Avez vous toujours besoin de ${lastGig.need} a ${lastGig.location} ?`
			const buttons = [
				{
					"type": "show_block",
					"block_names": ["returning owner"],
					"title": "OUI"
				},
				{
					"type": "show_block",
					"block_names": ["owner_different_need"],
					"title": "NON"
				}
			]
			const message = messager.generateMessageWithButtons(text, buttons);
			res.send(message);
		}
	})
})

app.post('/updateOwner', (req, res) => {
	const body = req.body;
	owner.updateOwnerGigs(body);
})

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
})



