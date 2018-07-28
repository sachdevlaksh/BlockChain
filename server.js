// Get dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors')

// Get our API routes
const kapy_api   = require('./server/routes/kapy_api');
const login_api  = require('./server/routes/login_api');
const verify_api = require('./server/routes/verify_api');


//Middle ware for CORS
app.use(cors());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our API routes based on application routes
app.use('/login', login_api);
app.use('/manageFarmerRecords', kapy_api);
app.use('/verify', verify_api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.post('/farmerRecordStatus', function(req,res){
	
//Call to chaincode
 
        //console.log("Name :- "+req.body.name);
         // Set the headers
        var headers = {
        'Content-Type':     'application/x-www-form-urlencoded'
        }
        //        console.log(headers);
        // Configure the request
        var options = {
        url: 'http://34.231.43.57:4000/users',
        method: 'POST',
        headers: headers,
        form: {'username': req.body.name, 'orgName': 'agent'}
        }
        //        console.log(options);
 
         request(options, function (error, response, body) {
                 //console.log(response);
                if (!error && response.statusCode == 200) {
                 // Print out the response body
                         var temp = JSON.parse(body);
                        token = temp.token;
}
});
      console.log("Number for reference Identifier number",req.body.id);
                        console.log("token",temp.token);
                                var headers = {
                                'authorization': 'Bearer '+temp.token,
                                'Content-Type': 'application/json'
 
                                }
                                var tempArgs=[];
                                tempArgs.push({'UName':'First University'});
                                //console.log("Testing the output",JSON.stringify(tempArgs));
                                var strfy = JSON.stringify(tempArgs);
 
 
                                                                        // Configure the request
                                                                        var options = {
                                                                                        url: 'http://34.231.43.57:4000/channels/mychannel/chaincodes/studentcc',
                                                                                        method: 'POST',
                                                                                        headers: headers,
                                                                                        body: {
                                                                                                        'fcn': 'create',
                                                                                                        'args': [req.body.id,JSON.stringify({'Name':req.body.name})]
                                                                                                        },
                                                                                         json:true
                                                                                        //form: {'fcn': 'create', 'args':strfy }
                                                                        }
 
                                //console.log("Req for options", options);
                                // Start the request
                                                              request(options, function (error, response, body) {
                                                                                                if (!error && response.statusCode == 200) {
                                                                                                                // Print out the response body
                                                                                //Code for illunoise code testing
                                                                                //var input = '%5B%22a%22%5D';
                                                                                 var input = [];
                                                                                 input.push('a');
 
 
                                                                                        var options = {
                                                                                                        url: 'http://34.231.43.57:4000/channels/mychannel/chaincodes/studentcc?peer=peer1&fcn=get&args=%5B%22'+req.body.id+'%22%5D',
                                                                                                        method: 'GET',
                                                                                                        headers: headers
																						}
                                                                                                    // console.log("Get command"+options);
                                                                                        request(options, function (error, response, body) {
                                                                                                                if (!error && response.statusCode == 200) {
                                                                                                                                // Print out the response body
                                                                                                                                                                                console.log("Response from GET  ",body)
 
                                                                                                                }
																							 var response = {
                                                                                                                                status  : 200,
                                                                                                                                message : 'Status updated.'
                                                                                                                }
                                                                                                                res.send(JSON.stringify(response));
                                                                                                        });
                                                                                                }

                                                                                });
                                                                               
 
});
                                //end of chain code
	

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3001';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));