(function() {
    'use strict';
    angular
        .module('frontender')
        .factory('getService', getService);

    function getService($http, $q, $state, $timeout) {

        // "Data Get Service"
        console.log('Data Get Service Starts');

        return {

            getDataItems: function (apiUrl){
                
                console.log('Data Get Service Exec');
                
                // Set common url variable for request
                var requestUrlParams = apiUrl;

                return $http.get(
                        // Get Request For Customer Profile First
                        requestUrlParams
                    )
                    .then(
                        function (results) {
                            console.log('Results')
                        }
                    )
                    .catch(
                        function (error) {
                            console.log('Error true');

                            // Route to error state if we got error response from server (sample)
                            $state.go('root.error');
                            if (error.status == 404) {
                                console.log(error.status);
                            }
                            return error;
                        }
                    );
            }
        };
    }

})();