

const apiResponse = require("../helpers/apiResponse");
var policies = require('../middlewares/policies');
var auth = require('../middleWares/auth');

/**
 * Policies list.
 *
 *
 * @returns {Object}
 */
exports.policiesList = [
  auth,
  policies,
	(req, res) => {
    const { role, id } = req.user;
    const {status, data} = req.contentoPolicies;
    const limit = req.params.limit || 10;

    if (status === 200 || status === 304) {
      if(role === 'admin'){
        apiResponse.successResponseWithData(res, "ok", data);
      } else {
        const userPolicy = data.filter(item => item.clientId === id);
        apiResponse.successResponseWithData(res, "ok", userPolicy);
      }
    } else {
      apiResponse.ErrorResponse(res, "Error.")
    }
}];

/**
 * Policies list.
 *
 *  @param {string}      id
 * 
 * @returns {Object}
 */
exports.policiesGet = [
  auth,
  policies,
	(req, res) => {
    const id = req.params.id;
    const {status, data} = req.contentoPolicies;

    var found = data.find(item => item.id === id);

    if (status === 200 || status === 304) {

      apiResponse.successResponseWithData(res, "ok", found);
    } else {
      apiResponse.ErrorResponse(res, "Error.")
    }
}];