angular.module('controllers', [])
.controller('ohdsiInformerCtrl', ['$scope', 'ohdsiService', 'fhirService', '$timeout', '$http', '$location',
  function($scope, ohdsiService, fhirService, $timeout, $http, $location) {

  $scope.outcome = {};
  $scope.treatment = {};
  $scope.patient = {
    id : 1
  };


  var getPatient = function(id) {
    fhirService.getPatient(id)
    .then(function(res) {
      console.log(res);
      $scope.patient = res;
      fhirService.getMedications(id)
        .then(function(res) {
          $scope.patient.medications = res;
          console.log(res);
        }, function(err) {
          console.log(err);
        });
      fhirService.getConditions(id)
        .then(function(res) {
          $scope.patient.conditions = res;
          console.log(res);
        }, function(err) {
          console.log(err);
        });
    }, function(err) {
      console.log('unabeld to read patient');
    });
  };

  var getUrlParameter = function getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : sParameterName[1];
          }
      }
  };

  var patientParam = getUrlParameter('patient');
  if (patientParam) {
    getPatient(patientParam);
  } else {
    getPatient(1);
  }

  $scope.medicationClicked = function(item) {

  };

  $scope.conditionClicked = function(item) {

  };
}]);
