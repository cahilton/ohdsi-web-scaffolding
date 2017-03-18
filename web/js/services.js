function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
angular.module('services', [])
.service('ohdsiService', ['$http', '$q', function($http, $q){
    var self = this;
    this.getEvidence = function(targetId, outcomeId, comparatorId) {
        var deferred = $q.defer();
        var baseUrl = 'http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com/informer-api/depression_results';
        outcomeId = '2556';
        $http.get(baseUrl + /*+'?targetID=' + targetId +*/ "&outcomeID=" + outcomeId /*+ "&comparatorId=" + comparatorId*/)
            .then(function(res) {
                deferred.resolve(res.data.entry);
            }, function(err) {
                console.log(response);
                deferred.reject(response);
            });

        return deferred.promise;
    };
}])
.service('fhirService', ['$http', '$q', function($http, $q){
  var self = this;
  this.getConditions = function(patientId) {
    var deferred = $q.defer();
    $http.get('http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/gt-fhir-webapp/base/Condition?patient=' + patientId)
    .then(function(res) {
      deferred.resolve(res.data.entry);
    }, function(err) {
      console.log(response);
      deferred.reject(repsonse);
    });

    return deferred.promise;
  };

  this.getMedications = function(patientId) {
    var deferred = $q.defer();
    $http.get('http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/gt-fhir-webapp/base/MedicationDispense?patient=' + patientId)
    .then(function(res) {
      deferred.resolve(res.data.entry);
    }, function(err) {
      console.log(response);
      deferred.reject(repsonse);
    });
    return deferred.promise;
  };

  this.getPatient = function(patientId) {
    var deferred = $q.defer();
    $http.get('http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/gt-fhir-webapp/base/Patient/' + patientId)
    .then(function(res) {
      var d = res;
      d.id = patientId;
      if (d.data) {
        var birthDate = Date.parse(d.data.birthDate);
        d.age = self.getAge(birthDate);
        d.nameLast = toTitleCase(d.data.name[0].family[0]);
        d.nameFirst = toTitleCase(d.data.name[0].given[0]);
        d.sex = toTitleCase(d.data.gender);
      }
      deferred.resolve(d);
    }, function(err) {
      console.log(response);
      deferred.reject(repsonse);
    });
    return deferred.promise;
  };

  this.getAge = function(birthDate) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }


}]);
