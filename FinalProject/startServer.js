/**
 *
 *     UCSCx MEAN Stack Final Project  --  April 2016  --  Wade Woodson
 *     file:  startServer.js
 *
 *     ==> express/node code to drive the FlightBoard server
 *
 *     the server processes three data requests:  carriers, routes and flights
 *
 *     the carriers and routes routines are in the companion code file supportServer.js
 *          which is expected to be in this directory
 *
 *
 *
 *     the server is set up to listen on port 3000
 *
 *
 */


var fs = require('fs');
var express = require('express');
var app = express();
var supportServer = require('./supportServer');

/**
 *
 *      this function retrieves a single flight information file in JSON format.
 *      it cleans up the JSON and sends the result to the client
 *
 *      since I don't know a general way to cure the bad JSON files,
 *          this function does it the hard way for limited special cases.
 *      a use case might be that there was some particular systematic data corruption.
 *
 *
 * @param req
 * @param res
 */

var serveFlights = function(req, res){
    res.set('Access-Control-Allow-Origin','*');
    fs.readFile("./Files" + req.url, 'utf8',
        function (err, data) {
            if (err) {
                res.send("error getting flight " + req.url);
                return;
            } else {
                if (data.substring(0,3)==',,,')
                    data = '{' + data.substring(3);
                if (data.substring(0,1)==',')
                    data = '{' + data.substring(1);
                if (data.substr(-2,1) == ',')
                    data = data.substring(0,data.length-2) + '}\n';
                res.send((data));
            }
        }
    );
};


/**
 *
 *     this code manages routing of the requests based on the requested URL.
 *     it also starts the server.
 *
 */


app.get('/carriers', supportServer.fetchCarriersHandler);
app.get('/:carrier', supportServer.fetchRoutesHandler);
app.get('/:carrier/:flight', serveFlights);

var server = app.listen(3000);

