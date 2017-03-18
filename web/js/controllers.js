angular.module('controllers', [])
.controller('ohdsiInformerCtrl', ['$scope', 'ohdsiService', 'fhirService', '$timeout', '$http', '$location',
  function($scope, ohdsiService, fhirService, $timeout, $http, $location) {

  $scope.view = "main";

  $scope.outcome = {};
  $scope.treatment = {};
  $scope.comparator = {};
  $scope.patient = {
    id : 1
  };

  $scope.comparators = [
  ];

  $scope.setView = function (v) {
    $scope.view = v;
  };

  $scope.clear = function() {
    $scope.outcome = {};
    $scope.treatment = {};
    $scope.comparator = {};
    $scope.comparators = [];
    $scope.patFilter = "";
  };

  $scope.showTable = function(treatment, outcome, comparator) {
    $scope.setView('table');
    var evidence = ohdsiService.getEvidence(treatment, outcome, comparator);
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
    $scope.treatment.name = item.resource.medicationCodeableConcept.coding[0].display;
    $scope.treatment.code = item.resource.medicationCodeableConcept.coding[0].code;
    $scope.treatment.system = item.resource.medicationCodeableConcept.coding[0].system;
    $scope.patFilter = "";
    $scope.lookupComparator();
    $( "#outcomeName" ).focus();
  };

  $scope.conditionClicked = function(item) {
    console.log(item);
    $scope.outcome.name = item.resource.code.coding[0].display;
    $scope.outcome.code = item.resource.code.coding[0].code;
    $scope.outcome.system = item.resource.code.coding[0].system;
    $scope.patFilter = "";
    $scope.lookupComparator();
  };

  $scope.setTreatment = function(name, code) {
    $scope.treatment.name = name;
    $scope.treatment.code = code;
  }

  $scope.setOutcome = function(name, code) {
    $scope.outcome.name = name;
    $scope.outcome.code = code;
  }

  $scope.lookupComparator = function() {
    if ($scope.treatment.code && $scope.treatment.code.length > 0) {
        var obj = {};
        obj.CONCEPT_ID = [];
        obj.CONCEPT_ID.push(parseInt($scope.treatment.code, 10));
        obj.VOCABULARY_ID = ["ATC"];
        obj.CONCEPT_CLASS_ID = ["ATC 3rd","ATC 4th"];
        $.ajax({
          url:  "http://api.ohdsi.org/WebAPI/vocabulary/1PCT/relatedconcepts",
          dataType: "json",
          type : "POST",
          data: JSON.stringify(obj),
          contentType: "application/json; charset=utf-8",
          success: function( data ) {
            $scope.comparators = data;
            try {
              $scope.$apply();
            } catch (e) {
              console.log(e);
            }

          }
        });
    }
  };

  $( "#treatmentName" ).autocomplete({
    source: function (request, response) {
      var obj = {};
      obj.QUERY = request.term;
      obj.VOCABULARY_ID = ["RxNorm"];
      obj.CONCEPT_CLASS_ID = ['Ingredient', 'Brand Name'];

      $.ajax({
        url:  "http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/WebAPI/omop_v5/vocabulary/search/",
        dataType: "json",
        type : "POST",
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        success: function( data ) {
          var res = data.map(function (d) {
            var obj = {};
            obj.label = d.CONCEPT_NAME;
            obj.value = d.CONCEPT_ID + "";
            return obj;
          });
          response( res );
        }
      });
    },
      minLength: 3,
      select: function( event, ui ) {
          $('#treatmentName').val(ui.item.label);
          $scope.setTreatment(ui.item.label, ui.item.value);
          try {
            $scope.$apply();
          } catch (e) { console.log(e);}
          $scope.lookupComparator();
          $( "#outcomeName" ).focus();
          return false;
      }
    } );

    $( "#outcomeName" ).autocomplete({
      source: function (request, response) {
        var obj = {};
        obj.QUERY = request.term;
        obj.VOCABULARY_ID = ["SNOMED"];
        obj.CONCEPT_CLASS_ID  = ["Clinical Finding"];

        $.ajax({
          url:  "http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/WebAPI/omop_v5/vocabulary/search/",
          dataType: "json",
          type : "POST",
          data: JSON.stringify(obj),
          contentType: "application/json; charset=utf-8",
          success: function( data ) {
            var res = data.map(function (d) {
              var obj = {};
              obj.label = d.CONCEPT_NAME;
              obj.value = d.CONCEPT_ID + "";
              return obj;
            });
            response( res );
          }
        });
      },
        minLength: 3,
        select: function( event, ui ) {
            $('#outcomeName').val(ui.item.label);
            $scope.setOutcome(ui.item.label, ui.item.value);
            try {
              $scope.$apply();
            } catch (e) { console.log(e);}
            $scope.lookupComparator();
            return false;
        }
      } );
}]);
