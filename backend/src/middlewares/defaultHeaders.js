function defaultHeaders(_, response, next)
{
	response.set({
		"Strict-Transport-Security": "max-age=15768000; includeSubDomains; preload",
		"Referrer-Policy": "same-origin",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
		"X-XSS-Protection": "1",
		"Cache-Control": "max-age=2592000",
	});

	next();
}


module.exports = defaultHeaders;
