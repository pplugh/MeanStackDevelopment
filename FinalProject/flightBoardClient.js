/**
 *
 *     UCSCx MEAN Stack Final Project  --  April 2016  --  Wade Woodson
 *     file:  flightBoardCient.js  == angular module and support functions
 *
 *     Angular.js code to drive the FLightBoard client
 *
 *     the three angular methods are module/creation, one controller, and one filter.
 *
 *     the controller also contains the functions that determine the selected view
 *          and retrieve data from the server to match that view.
 *
 *     the server is expected to be at //localhost:3000/, as set in a controller constant.
 *
 *     the controller drives the view via the $scope.boardView state variable.
 *
 *     each state/view has an associated function below that retrieves the data from the server via http
 *          and fills the proper $scope variables.
 *     these functions are injected into the $scope and accessed by the navigation buttons on the html page.
 *
 *
 **/


angular

    .module("flightBoard", [])

    .controller("flightBoardController", function ($scope, $http) {
        $scope.showCarriers = showCarriers;
        $scope.showRoutes = showRoutes;
        $scope.showFlights = showFlights;
        $scope.serverURL = "http://localhost:3000/";
        $scope.boardView = "welcome";

        function showCarriers() {
            $scope.selectedCarrierIndex = 0;
            $scope.selectedRouteIndex = 0;
            $http.get($scope.serverURL + "carriers")
                .then(
                    function(resp) {
                        console.log(resp.data);
                        $scope.carriers = resp.data;
                        $scope.boardView = "carriers";
                    },
                    function(err) {
                        console.error('ERR', err);
                        errorPage(err);
                    }
                );
        };

        function showRoutes(index) {
            if (index >= 0) $scope.selectedCarrierIndex = index;
            targetUrl = $scope.serverURL + $scope.carriers[$scope.selectedCarrierIndex] +"/";
            $http.get(targetUrl)
                .then(
                    function(resp) {
                        console.log(resp.data);
                        $scope.routes = resp.data;
                        $scope.boardView = "routes";
                    },
                    function(err) {
                        console.error('ERR', err);
                        errorPage(err);
                    }
                );
        };

        function showFlights(index) {
            if (index>=0) $scope.selectedRouteIndex = index;
            targetUrl = $scope.serverURL + $scope.carriers[$scope.selectedCarrierIndex] +"/" + $scope.routes[index] + '.json';
            $http.get(targetUrl)
                .then(
                    function(resp) {
                        $scope.flights = resp.data;
                        $scope.numFlights = Object.keys($scope.flights).length;
                        $scope.boardView = "flights";
                    },
                    function(err) {
                        console.error('ERR', err);
                        errorPage(err);
                    }
                );
        };

        function errorPage(err) {
            $scope.boardView = 'error';
            $scope.errMsg = err;
        }

    })

    /**
     *      this angular filter simply translates the timestamp into a more readable string
     *      it is culled from a file in the MEANstack repo
     *
     **/

    .filter('dateToTimestamp', function () {
        return function (timestamp) {
            var chrono = new Date(timestamp * 1000);
            var chronoObject = chrono.getFullYear() +'/'+ ('0' + (chrono.getMonth() + 1)).slice(-2) +'/'+ ('0' + chrono.getDate()).slice(-2);
            return chronoObject;
        };
    });



