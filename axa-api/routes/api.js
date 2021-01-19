var express = require("express");
var authRouter = require("./auth");
var policiesRouter = require('./policies');
var clientsRouter = require('./clients');

var app = express();

app.use("/login/", authRouter);
app.use('/policies/', policiesRouter);
app.use('/clients/', clientsRouter);

module.exports = app;