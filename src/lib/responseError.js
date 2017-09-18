function ResponseError(message, response) {
	let error = Error.call(this, message);

	this.name = 'ResponseError';
	this.message = error.message;
	// getter for more optimizy goodness
	Object.defineProperty(this, 'stack', {
		get: function() {
			return error.stack
		},
		configurable: true // so you can change it if you want
	});

	this.response = response;
}
ResponseError.prototype = Object.create(Error.prototype);
ResponseError.prototype.constructor = ResponseError;

export default ResponseError;