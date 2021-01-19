var http = require("http");
var socketioJwt = require("socketio-jwt");
var socketServer = require("socket.io");
var UserController = require("../controllers/UserController");
var CompanyController = require("../controllers/CompanyController");
var ActionsController = require("../controllers/ActionController");

const secret = process.env.JWT_SECRET;

const INITIALSTATE = "INITIALSTATE";
const CONNECTION = "connection";
const DISCONNECT = "disconnect";
const AUTHENTICATED = "authenticated";

var io;
var clients = [];

exports.connect = function(app, port) {
	var server = http.createServer(app);
	io = socketServer(server, {
		path: "/socket"
	});
		
	server.listen(port, ()=> {
		console.log(`++ Socket IO listening port: ${port}`);
	});
		
	io.sockets
		.on(CONNECTION, socketioJwt.authorize({
			secret: secret,
			timeout: 5000 // 5 seconds to send the authentication message
		}))

		.on(AUTHENTICATED, (socket) => {
			const user = socket.decoded_token;
			clients.push(socket);
			console.log(`hello! ${socket.decoded_token.email} - ${socket.id}`);

			// CompanyController.CompanyListIO(socket);
			CompanyController.CompanyListIO(user).then(companies => {
				UserController.AdminListIO(user).then(users => {
					ActionsController.ActionListIO(user).then(actions => {
						socket.emit(INITIALSTATE, {companies: companies, users: users, registers: actions});
					});
				});
			});

			socket.on(DISCONNECT, () => {
				clients.splice(clients.indexOf(socket), 1);
				console.log(`Disconnected - ${socket.id}`);
			});
		});
	
	return io;
};

exports.emit = function emit(event, ...args) {
	return io.emit(event, ...args);
};

exports.emit = function emit(companyid, event, ...args) {
	clients.forEach(socket => {
		if (socket.decoded_token.admin || String(socket.decoded_token.companyid) === String(companyid)){
			socket.emit(event, ...args);			
		}
	});
};