var request = require('request');
const apiResponse = require("../helpers/apiResponse");
const clients = require('../middlewares/clients');
const policies = require('../middlewares/policies');
const jwt = require("jsonwebtoken");

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	policies,
	clients,
	(req, res) => {
		try {
	    const {username, password} = req.body;
			const {status, data} = req.contentoClients;

			var found = data.find(item => item.name === username);
			if(found) {
				if(password === 's3cr3t') {
					let userData = {
						type: 'Bearer',
						expiresIn: process.env.JWT_TIMEOUT_DURATION,
					};
					//Prepare JWT token for authentication
					const jwtPayload = {
						id: found.id,
            name: found.name,
            email: found.email,
						role: found.role,
					};
					const jwtData = {
						expiresIn: process.env.JWT_TIMEOUT_DURATION,
					};
					const secret = process.env.JWT_SECRET;
					//Generated JWT token with Payload and secret.
					userData.token = jwt.sign(jwtPayload, secret, jwtData);
					console.log(jwtData);
					return apiResponse.successResponseWithData(res,"Login Success.", userData);
				} else {
					return apiResponse.unauthorizedResponse(res, 'Username or Password Not Found');
				}
			} else {
				return apiResponse.notFoundResponse(res, 'Username or Password Not Found');
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];