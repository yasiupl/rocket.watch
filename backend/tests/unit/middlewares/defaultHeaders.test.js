const httpMocks = require("node-mocks-http");

const defaultHeaders = require("middlewares/defaultHeaders");


test("calls next()", () => 
{
	const response = httpMocks.createResponse();
	const next = jest.fn();

	defaultHeaders(null, response, next);

	expect(next).toHaveBeenCalled();
});

test("applies default headers", () => 
{
	const response = httpMocks.createResponse();
	const next = () => null;

	defaultHeaders(null, response, next);

	expect(response._headers).toEqual({
		"strict-transport-security": "max-age=15768000; includeSubDomains; preload",
		"referrer-policy": "same-origin",
		"x-content-type-options": "nosniff",
		"x-frame-options": "SAMEORIGIN",
		"x-xss-protection": "1",
		"cache-control": "max-age=2592000",
	});
});
