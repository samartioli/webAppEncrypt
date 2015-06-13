angular.module('webAppEncrypt', [])
	.controller('encryptController', function($http) {

		var ec = this;
		ec.data = {
			a: 123,
			b: 'qwe'
		};

		var pem = '-----BEGIN PUBLIC KEY-----' +
			'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtOQI76l6FzuH9Qq/tnzE' +
			'XLgvQNpmkCNp6hy3HdV+q+eV5fCW55+iCKyygfc4w5VS5c84KhTZFmADcq2LwoVL' +
			'eyRtPan13KtrG18vEYt9qEeX9A1bJ2PMCzdNNb4dU/3bw+rC8S3gdn5uxg2dWfv7' +
			'OVu6Ew2UgbzuA8SWlqRGfg3qgxThhYK3re0XN7QJuTfroOAHE2DD7Nn7s5stXe9k' +
			'aNfRqJd+BUeYLcnWbb7tcbnokKZxIkYcFef6/89paorAP/T1jBrl7YNhSH33T1QC' +
			'+mdmZGqATIUMRPTcaLW6D4unTdWjW0hetCco4sqdifzW8uMayFMi8yH7GyvUMDCp' +
			'pwIDAQAB' +
			'-----END PUBLIC KEY-----'
		;

		var publicKey = forge.pki.publicKeyFromPem(pem);

		// Generate a random symetric key and initialization vector
		var symetricKey = forge.random.getBytesSync(16);
		console.log('### INFO: symetricKey is: ' + forge.util.bytesToHex(symetricKey));

		var iv = forge.random.getBytesSync(16);
		console.log('### INFO: iv is: ' + forge.util.bytesToHex(iv));

		// Encrypt symetric key with public key
		var encryptedSymetricKeyHex = forge.util.bytesToHex(
			publicKey.encrypt(symetricKey)
		);

		ec.encryptAndSend = function() {

			console.log('### INFO: Form Data is:');
			console.log(ec.data);

			var cipher = forge.cipher.createCipher('AES-CBC', symetricKey);
			cipher.start({iv:iv});

			// Stringify the form data object and then push it throught the cipher
			cipher.update(
				forge.util.createBuffer(JSON.stringify(ec.data))
			);

			cipher.finish();

			// Attach cipher to the window in case we want to look at it in the console
			window.cipher = cipher;

			var encryptedDataHex = forge.util.bytesToHex(cipher.output.getBytes());

			var toSend = {	
				encryptedDataHex: encryptedDataHex,
				encryptedSymetricKeyHex: encryptedSymetricKeyHex,
				iv: forge.util.bytesToHex(iv)
			}

			console.log('About to send: ');
			console.log(toSend);

			$http.post('http://localhost:8081/example', toSend)
				.success(function(data, status, headers, config) {
					console.log('### INFO: Logging below the json object we received from server.');
					console.log('### INFO: This should be identical to the Form Data object above.');
					console.log(data);
				})
				.error(function(data, status, headers, config) {
					console.log(status);
				})
			;

		}

	});