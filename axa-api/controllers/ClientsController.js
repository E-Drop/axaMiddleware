
var request = require('request');
var apiResponse = require("../helpers/apiResponse");
var auth = require('../middleWares/auth');
var clients = require('../middlewares/clients');
var policies = require('../middlewares/policies');

/**
 * clients list.
 *
 *
 * @returns {Object}
 */
exports.clientsList = [
  auth,
  policies,
  clients,
	(req, res) => {
    const {status, data} = req.contentoClients;

    if (status === 401) {
      apiResponse.unauthorizedResponse(res, "Not autoritzed.")
    } else if (status === 200 || status === 304) {
      apiResponse.successResponseWithData(res, "ok", data);
    } else {
      apiResponse.ErrorResponse(res, "Error.")
    }

}];

exports.clientsGet = [
  auth,
  clients,
	(req, res) => {
    const id = req.params.id;
    const {status, data} = req.contentoClients;

    var found = data.find(item => item.id === id);

    if (status === 200 || status === 304) {

      apiResponse.successResponseWithData(res, "ok", found);
    } else {
      apiResponse.ErrorResponse(res, "Error.")
    }
}];

exports.clientsPolicy = [
  auth,
  policies,
	(req, res) => {
    const id = req.params.id;
    const {status, data} = req.contentoPolicies;

    var found = data.filter(item => item.clientId === id);

    if (status === 200 || status === 304) {

      apiResponse.successResponseWithData(res, "ok", found);
    } else {
      apiResponse.ErrorResponse(res, "Error.")
    }
}
];