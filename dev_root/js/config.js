(function() {
    'use strict';
    angular
        .module('someApp')
        .config(config);

    function config(
        $stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

        console.log('Config');

        // Loading Bar
        cfpLoadingBarProvider.spinnerTemplate = '' +
            '<div class="page-spinner"><i class="fa fa-spinner fa-pulse page-spinner-icon text-primary"></i></div>';

        $urlRouterProvider.otherwise('customer-page');

        $stateProvider
            .state('root',{
                url: '',
                abstract: true,
                views: {
                    'header': {
                        templateUrl: '../../build/views/header.html'
                    },
                    'data-content':{
                        templateUrl: '../../build/views/data-content.html'
                    },
                    'footer':{
                        templateUrl: '../../build/views/footer.html'
                    }
                }
            })
            .state('root.home', {
                //url: 'customer-page/?custId&userId',
                url: '/customer-page?custId&userId',
                controller: 'MainController',
                //url: '/:testId',
                views: {
                    'container@': {
                        templateUrl: '../../build/views/index.html'
                    },
                    'customer-profile-info':{
                        templateUrl: '../../build/views/customer-profile-info.html'
                    },
                    'customer-languages':{
                        templateUrl: '../../build/views/customer-languages.html'
                    },
                    'customer-address':{
                        templateUrl: '../../build/views/customer-address.html'
                    },
                    'customer-current-plans':{
                        templateUrl: '../../build/views/customer-plans.html'
                    },
                    'customer-service-ld':{
                        templateUrl: '../../build/views/customer-services-ld.html'
                    },
                    'customer-service-sd':{
                        templateUrl: '../../build/views/customer-services-sd.html'
                    },
                    'customer-service-cc':{
                        templateUrl: '../../build/views/customer-services-cc.html'
                    },
                    'customer-service-dd':{
                        templateUrl: '../../build/views/customer-services-dd.html'
                    },
                    'customer-audit':{
                        templateUrl: '../../build/views/customer-audit.html'
                    },
                    'customer-destinations':{
                        templateUrl: '../../build/views/customer-destinations.html'
                    }
                }
            })
            .state('error', {
                abstract: true,
                url: '',
                controller: 'MainController',
                views: {
                    'error': {
                        templateUrl: '../../build/views/error_status.html'
                    }
                }
            })
            .state('error.status', {
                url: '/error',
                controller: 'MainController',
                views: {
                    'container@': {
                        templateUrl: '../../build/views/error.html'
                    },
                    'error': {
                        templateUrl: '../../build/views/error_status.html',
                        controller: 'MainController'
                    }
                }
            })
        ;
    }

})();