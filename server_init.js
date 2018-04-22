`use strict`;

const express = require('express');
const fileUpload = require('express-fileupload');
const log = require('./server_logger');
const http = require('http');

const app = express();
const httpServer = http.Server(app);

const initialize = () => {
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/index.html');
	});

	app.get('/question', (req, res) => {
		res.sendFile(__dirname + '/question.html');
	});

	log.logEntry("Initialized express server.");

	app.use(express.static('content'));

	log.logEntry("Initialized content management module.");
};

const initializeUpload = () => {
	app.use(fileUpload());

	app.post('/upload', (req, res) => {
		if (!req.files) {
			return res.status(400).send('File upload failure: ')
		}

		const fileName = req.files.fileName;

		fileName.mv(__dirname + '/content/' + fileName.name, err => {
			if (err) {
				return res.status(500).send(err);
			}

			res.send('File upload success');
		});
	});

	log.logEntry("Initialized content upload module.");
};

const launchServer = () => {
	httpServer.listen(3000, () => {
		log.logEntry("Server listening on post 3000.");
	});
};

module.exports = { initialize, initializeUpload, launchServer, httpServer };