angular.module('controllers', [])
.controller('ohdsiInformerCtrl', ['$scope', 'ohdsiService', '$timeout', '$http', '$location',
  function($scope, ohdsiService, $timeout, $http, $location) {

  $scope.patient = {
    nameLast : "Thomas",
    nameFirst : "Louie",
    sex : "Male",
    age : "53"
  };
}]);
