'use strict';
.
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cigar Schema
 */
var CigarSchema = new Schema({
	brand: {
		type: String,
		default: '',
		required: 'Please choose a cigar brand',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	vitola:{
		 type: string,
		 default: '',
		 trim: true,
		 required: 'Please Choose your prefered vitola'
	},
	picpath:{
		type: String,
		trim: true
	}
});

mongoose.model('Cigars', CigarSchema);