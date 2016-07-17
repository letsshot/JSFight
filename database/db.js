var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/JSFight');
var Schema = mongoose.Schema;
var playerScheMa = new Schema({
    name: String,
    password: String,
	gameNumber: Number,
	winNumber: Number
});
exports.player = db.model('players', playerScheMa);