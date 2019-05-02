/* Hello World Api

Dependencies
*/

var http = require('http'),
    url = require('url'),
    StringDecoder = require('string_decoder').StringDecoder; //string_decoder is a library, .StringDecoder is the function
    

//Instantiate the HTTP server
var port = 3000;
var httpServer = http.createServer(function(req, res){
    Server(req, res);   
});

//start the http server
httpServer.listen(port, function(){
    console.log("the server is listening on port ");
});




// all the server logic for both the http and https server
var Server = function(req, res){
    //Get the URL and parse it
    var parsedUrl = url.parse(req.url, true); // req is what user asking, with true we call the query string module, url is an object w
                                                //including parsing metadata                                              
    //Get the path
    var path = parsedUrl.pathname; //pathname is the key, which come form parsedurl, untrimmed
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get the query string as an object
    var queryStringObject = parsedUrl.query;

    //Get the HTTP Method
    var method = req.method.toLowerCase();

    //get the headers as an object
    var headers = req.headers;

    //get the payload , if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data); //as data streaming in, the request object imits the data event,  decoded in utf-8, append the result to buffer, => large string which recieved will streaming part by part
    });
    req.on('end', function(){
        buffer += decoder.end();

        //Choose the handler this request should go to, if one is not found use the notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

            
        //Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath, 
            'queryStringObject' : queryStringObject, 
            'method' : method, 
            'headers' : headers,
            'payload' : buffer
        };

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
             //use tha status code called back by the handler, or default to 200
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
             //use the payload called back by the handler or default to an empty object
             payload = typeof(payload) == 'object' ? payload : {};

             //convert the payload to a string
             //var payloadString = JSON.stringify(payload);

             //return the response
             res.setHeader('Content-Type', 'application/json');
             res.writeHead(statusCode);
             res.end("hello world");

             //log the request path
             console.log('Returning this response', statusCode, /*payloadString*/);

        });

    
    });
}

//define the handlers
var handlers = {};

handlers.hello = function(data,callback){
    callback(406,{'name':'Hello World, Welcome to NODEJS-Assignment1...'});
};

handlers.sample = function(data, callback){
    callback(406, {'name' : 'sample handler'});
};

//Not found handler
handlers.notFound = function(data, callback){
    callback(404);

};
//define a request router
var router = {
    'sample' : handlers.sample,
    'hello' : handlers.hello
  };