var lambdaLocal = require("lambda-local");


var http = require("http");
http.createServer(function(request,response){

	var body = [];
	request.on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function() {
		fireRequest(Buffer.concat(body).toString(), response);
	});
}).listen(8080);


function fireRequest(body, response) {
	var event = JSON.parse(body);
	lambdaLocal.execute({event:event, lambdaPath:'./index.js'}).then(function(data) {
		console.log("lambdalocal sagt:", data);
		response.writeHeader(200, {"Content-Type": "application/json"});
		response.write(JSON.stringify(data));
		response.end();
	}).catch(function(e){
		console.log(e)
		response.writeHeader(500, {"Content-Type": "text/plain"});
		response.end("Error while processing req")
	})
}