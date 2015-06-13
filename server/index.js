var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

var bodyParser = require('body-parser');
var cors = require('cors');

var forge = require('node-forge');

var port = 8081;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var pem = fs.readFileSync(
	path.join(
		path.dirname(
			fs.realpathSync(__filename)
		),
		'../keys/private.pem'
	),
	'utf8'
);

var privateKey = forge.pki.privateKeyFromPem(pem);

console.log(pem);

app.post('/example', function(req, res) {

	console.log('### INFO: Data received %j', req.body);

	// First decrypt the symetric key
	var decryptedSymetricKey = privateKey.decrypt(
		forge.util.hexToBytes(req.body.encryptedSymetricKeyHex)
	);

	console.log('### INFO: decryptedSymetricKey: %j', forge.util.bytesToHex(decryptedSymetricKey));

	// Now decipher the data
	var decipher = forge.cipher.createDecipher('AES-CBC', decryptedSymetricKey);
	var encryptedDataBytes = forge.util.hexToBytes(req.body.encryptedDataHex);
	var input = forge.util.createBuffer(encryptedDataBytes);
	decipher.start({iv:forge.util.hexToBytes(req.body.iv)});
	decipher.update(input);
	decipher.finish();

	console.log('### INFO: Deciphered: %j', decipher.output.toString('utf8'));

	res.json(JSON.parse(decipher.output.toString('utf8')));

});

var server = app.listen(port);

console.log('### INFO: Listening on port %j', port);