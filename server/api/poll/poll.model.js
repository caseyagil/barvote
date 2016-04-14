'use strict';

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

 var PollSchema = new Schema({
   creator: String,
   title: String,
   answers: [{
     value: String,
     votes: Number
   }]
 }, {
   versionKey: false
 });

 module.exports = mongoose.model('Poll', PollSchema);
