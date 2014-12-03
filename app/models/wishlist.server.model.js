'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wishlist Schema
 */
var WishlistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Wishlist name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Wishlist', WishlistSchema);