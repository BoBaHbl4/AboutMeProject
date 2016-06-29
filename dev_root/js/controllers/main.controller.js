(function() {
    'use strict';

    MainCtrl.$inject = ["$scope", "$state", "$location", "$rootScope", "appConstant", "$translate", "cfpLoadingBar", "getService"];
    angular
        .module('frontender')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl (
        $scope,
        $state,
        $location,
        $rootScope,
        appConstant,
        $translate,
        cfpLoadingBar,
        getService) {

        console.log('Main controller');

        // Language definition
        //TODO https://angular-translate.github.io/docs/#/guide/11_custom-storages

        $scope.langIdCurrent = 'eng';
        $scope.langNameCurrent = 'English';
        $scope.locationPath = [];

        $scope.locationPath = $location.path().split("/");
        $scope.langIdCurrent = $scope.locationPath[1];
        angular.forEach($rootScope.langArray, function(value){
            if ($scope.langIdCurrent == value.langId) {
                console.log('Current language ' + '"' + $scope.langIdCurrent + '"');
                $scope.langNameCurrent = value.langName;
                $translate.use(value.langId);
                return $scope.langNameCurrent;
            }
        });

        // Set Url For Any "Data Get Service"
        var apiUrl = appConstant.API_URL;

        // Set language function
        $scope.changeLanguage = function(language) {

            $state.go($state.current.name, {language: language});
            angular.forEach($rootScope.langArray, function(value){
                if (language == value.langId) {
                    console.log('Switched to "' + value.langId + '"');
                    $scope.langNameCurrent = value.langName;
                    $translate.use(value.langId);
                    return $scope.langNameCurrent;
                }
            });

        }
        
        // Test request 
        getService.getDataItems(apiUrl)
            .then(
                function (getDataItemsResults) {
                    
                }
            )
            .catch(function (getDataItemsError) {
                console.log('service request error');
                console.log(getDataItemsError);
                return getDataItemsError;
            });

    }

})();