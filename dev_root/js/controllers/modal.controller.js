(function() {
    'use strict';
    angular
        .module('someApp')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function ModalInstanceCtrl (
        $scope,
        $uibModalInstance,
        accessNumbersService) {

        console.log('modal controller');

        $scope.service = accessNumbersService;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();