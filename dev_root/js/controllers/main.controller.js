(function() {
    'use strict';

    angular
        .module('someApp')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl (
        $scope,
        $filter,
        //cfpLoadingBar,
        appConstant,
        customerService,
        numbersService,
        planService,
        $location,
        $uibModal,
        $log) {

        console.log('Main controller');

        // Set Url For Any "Data Get Service"
        var apiUrl = appConstant.API_URL;

        // Get Url Parameters For "Customer Data Get Service"
        console.log($location.search());
        $scope.urlParams = $location.search();
        var dataParams = $scope.urlParams;

        // Url Variables Definition
        $scope.varUrlRequest = {
            getUrl: apiUrl,
            api:    'api/cust/',
            apiPost:    'api/employee/',
            custGet: 'getCustomer',
            custAuditPost: 'AddCustomerAudit',
            srvGet: 'srvAccessNumbers',
            custId: 'custId=',
            custPlanId: 'custPlanId=',
            userId: 'userId=',
            ticket: 'ticket=',
            custIdValue: dataParams.custId,
            userIdValue: dataParams.userId,
            ticketValue: dataParams.ticket
        };
        var urlParams = $scope.varUrlRequest;

        // Requests For "Customer Data Get Service"

        // Common Function For Calling "Customer Data Get Service"
        var serviceRequestData = function (resultsData) {

            // Check if we got list of objects from "Customer Data Get Service" request
            if (resultsData.length) {
                console.log('resultsData.data.length defined');

                for (var i = 0; i < resultsData.length; i++) {

                    $scope.customerProfileData      = resultsData[0];
                    $scope.customerLanguagesData    = resultsData[1];
                    $scope.customerAddressData      = resultsData[2];
                    $scope.customerAuditData        = resultsData[3];
                    $scope.customerPlansData        = resultsData[4];
                    $scope.customerRatesData        = resultsData[5];

                    $scope.customerServiceLDData    = resultsData[6];
                    $scope.customerServiceSDData    = resultsData[7];
                    $scope.customerServiceCCData    = resultsData[8];
                    $scope.customerServiceDDData    = resultsData[9];

                    $scope.customerProfile      = resultsData[0].data.result;
                    $scope.customerLanguages    = resultsData[1].data.result;
                    $scope.customerAddress      = resultsData[2].data.result;
                    $scope.customerAudit        = resultsData[3].data.result;
                    $scope.customerPlans        = resultsData[4].data.result;
                    $scope.customerRates        = resultsData[5].data.result;

                    $scope.customerServiceLD    = resultsData[6].data.result;
                    $scope.customerServiceSD    = resultsData[7].data.result;
                    $scope.customerServiceCC    = resultsData[8].data.result;
                    $scope.customerServiceDD    = resultsData[9].data.result;

                }

                // Get Plans Result Data by "Plans Destinations Data Get Service"
                customerGetPlansDest();

                // Define Classes For Market Theme
                $scope.themeClass= function(marketState){
                    if ( marketState === "PL" || marketState === "PU" ) {
                        return "market-pl";
                    }
                    if (marketState === "NC") {
                        return "market-nc";
                    }
                    if (marketState === "BT" || marketState === "BR") {
                        return "market-bt";
                    }
                    else {
                        return "market-default";
                    }
                };

                //var companyMarketId = $scope.customerProfile.companyMarketId;
                $scope.customerMarket = $filter('limitTo')($scope.customerProfile.companyMarketId, 2);

                // Url Variables Definition For "Numbers Data Get Service"
                $scope.varNumbersServiceUrlRequest = {
                    cmId: 'cmId=',
                    serviceId: 'serviceId=',
                    // Get Company Market Id
                    cmIdValue: $scope.customerProfile.companyMarketId,
                    serviceSdValue: 'SD',
                    serviceCcValue: 'CC',
                    serviceDdValue: 'DD'
                };
                var numberUrlParams = $scope.varNumbersServiceUrlRequest;

                // Requests For "Numbers Data Get Service"
                // (depends on parameters from "Customer Data Get Service")
                numbersService.getNumbersDataItems(urlParams, numberUrlParams).then(
                    function(resultsData) {
                        // This will execute when the get call completes.
                        console.log('return ServiceDataItems');

                        for (var i = 0; i < resultsData.length; i++) {

                            $scope.serviceSDData    = resultsData[0];
                            $scope.serviceCCData    = resultsData[1];
                            $scope.serviceDDData    = resultsData[2];

                            $scope.serviceSD    = resultsData[0].data.result;
                            $scope.serviceCC    = resultsData[1].data.result;
                            $scope.serviceDD    = resultsData[2].data.result;

                        }
                    }
                );
            }
            // Error response from "Customer Data Get Service" request
            else {
                $scope.errorCommon = resultsData;
            }

        };

        // Get Plans Result Data by "Plans Destinations Data Get Service"
        var customerGetPlansDest = function () {

            // Url Variable Definition For "Plan Destinations Data Get Service"
            $scope.varPlanServiceUrlRequest = {
                custPlanId: 'custPlanId='
            };
            var planUrlParams = $scope.varPlanServiceUrlRequest;

            for (var i = 0; i < $scope.customerPlans.length; i++) {

                // Get Plans Id Url Variables For Service
                var specificPlanId = $scope.customerPlans[i].id;
                // Pass Plans Data For Service
                var specificPlan = $scope.customerPlans[i];

                planService.getPlanDestinationsDataItems(urlParams, planUrlParams, specificPlanId, specificPlan).then(function(r) {
                    return r;
                });
            }

        };

        customerService.getCustomerDataItems(urlParams)
            .then(
                function (success) {
                    // This will execute when the get call completes.
                    console.log('Customer Data Get Service Success');
                    serviceRequestData(success);

                    // TODO For Tests Only!
                    //setTimeout(function(){
                    //    $(window).scrollTop(700);
                    //}, 500);
                }
            )
            .catch(function (error) {
                console.log('service request error');
                console.log(error);
                $scope.errorCommon = error;
                return error;
            });


        // Class For ServiceLD
        $scope.labelClass= function(statusState){
            if ( statusState === "BLOCKED" || statusState === "COLLECTION" || statusState === "FRAUD" ) {
                return "label-danger";
            }
            if (statusState === "WRONGNR") {
                return "label-warning";
            }
            if (statusState === "ACTIVE") {
                return "label-success";
            }
            else {
                return "label-default";
            }
        };

        // Modal Function
        // From variable "service" (in view template) — we are passing name of scope we need for modal data.
        $scope.openServiceModal = function (service) {

            $uibModal.open({
                templateUrl: '/views/partials/serviceAccessNumbersModal.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    accessNumbersService: function () {
                        return service;
                    }
                }
            });

        };

        // UserRates Filter Function
        var orderBy = $filter('orderBy');

        $scope.order = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.customerRates = orderBy($scope.customerRates, predicate, $scope.reverse);
        };

        // For refreshing data manually from url parameters
        $scope.$watch(
            function() {
                return $location.search();
            },
            function(newParams, oldParams) {
                // Checking if new parameters in url differ from old ones
                if (newParams != oldParams) {

                    //Setting new url parameters for $scope.varUrlRequest
                    urlParams.custIdValue = newParams.custId;
                    urlParams.userIdValue = newParams.userId;

                    // New Request In "Customer Data Get Service"
                    // (refreshing data cause we got new customer or user id in url)
                    customerService.getCustomerDataItems(urlParams).then(function(resultsData) {
                        console.log('service request');
                        serviceRequestData(resultsData);
                    });
                }
            }, true);

    }

})();