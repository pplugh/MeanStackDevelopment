/**
 *
 *     UCSCx MEAN Stack Final Project  --  April 2016  --  Wade Woodson
 *     file:  supportServer.js
 *
 *     ==> express/node code to support the FlightBoard server main, startServer.js
 *
 *     the routines here process two types of data requests:  carriers and routes
 *
 *     the carriers and routes routines are based on the recursive technique used in class.
 *
 *     since validation of the carrier and routes data requires multiple file system calls per request,
 *          the validation is managed through a recursive method.
 *
 *     for each type of request, the appropriate handler is called by the routing code in startServer.js.
 *     the handler then places a call to the proper recursive loader, passing itself as a callback parameter.
 *     once the loader is finished, it calls the handler back with the results.
 *     the handler then sends the processed data (or an error) to the client via $http
 *
 */

var fs = require('fs');

/**
 *      the handler is a callback fuction used in requesting and sending carrier information.
 *      it reads the carriers directory and recursively validates that the entries are directories.
 *
 * @param req
 * @param res
 */

function fetchCarriersHandler(req, res) {
    console.log("fetching carriers");
    loadCarrierList(function (err, data) {
        if (err) {
            res.send(err);
            return;
        } else {
            res.set('Access-Control-Allow-Origin','*');
            res.send(data);
            return;
        }
    })
}

/**
 *  the loader manages the recursion
 * @param callback
 *
 */

function loadCarrierList(callback) {
    fs.readdir("./Files/",
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            } else {
                var only_directories = [];
                (function iterator(index) {
                    if (index == data.length) {
                        callback(null, only_directories);
                    } else {
                        fs.stat("./Files/" + data[index],
                            function (err, stat) {
                                if (stat.isDirectory()) {
                                    only_directories.push(data[index]);
                                }
                                iterator(index + 1);
                            })
                    }
                })(0);
            }
        })
}


/**
 *      the handler is a callback fuction used in requesting and sending route information.
 *      it reads a single carrier directory and recursively validates that the entries are files.
 *
 * @param req
 * @param res
 */

function fetchRoutesHandler(req, res) {
    console.log("fetching routes for " + req.url);
    var carrierName = req.url.substr(1,req.url.length-1);

    loadRouteList(carrierName, function (err, data) {
        if (err) {
            res.send(err);
            return;

        } else {
            res.set('Access-Control-Allow-Origin','*');
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(data) + "\n");
            return;
        }
    })
};


/**
 *  the loader manages the recursion
 * @param callback
 *
 */

function loadRouteList(carriername, callback) {
    fs.readdir("./Files/" + carriername + "/",
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            } else {
                var path = "./Files/" + carriername + "/";
                var only_json_Files = [];
                (function iterator(index) {
                    if (index == data.length) {
                        callback(null, only_json_Files);
                    } else {
                        fs.stat(path + data[index],
                            function (err, stat) {
                                if (stat.isFile()) {
                                    only_json_Files.push(data[index].substr(0,data[index].length-5));
                                }
                                iterator(index + 1);
                            })
                    }
                })(0);

            }
        })
}

module.exports.fetchCarriersHandler = fetchCarriersHandler;
module.exports.fetchRoutesHandler = fetchRoutesHandler;

