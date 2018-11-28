(function() {
    'use strict';
    angular
        .module('frontender')
        .run(runConfig);

    function runConfig($browser, $rootScope, $state, $stateParams) {

        console.log('Run config');

        $browser.baseHref = function () {
            return '/';
        };

        // Define project languages
        $rootScope.langArray = [
            {
                langName: 'English',
                langId: 'eng'
            },
            {
                langName: 'Русский',
                langId: 'ru'
            }
        ];
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

    }

})();