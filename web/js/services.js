function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
angular.module('services', [])
.service('ohdsiService', ['$http', '$q', function($http, $q){
    var self = this;
    this.getEvidence = function(targetId, outcomeId, codes) {
        var deferred = $q.defer();
        var res = [];
        for (var i in codes) {
          var url = "http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com/informer-api/irs?"
            + 'condition_concept_id='+ outcomeId
            + '&drug_concept_id=' + codes[i];
          $http.get(url)
              .then(function(resp) {
                  //console.log(resp);
                  if (resp.data && resp.data.length > 0) {
                    res.push(resp.data[0]);
                  }
                  if ((+i) === (codes.length - 1) && res.length > 0) {
                    deferred.resolve(res);
                  }
              }, function(err) {
              });


        }
        return deferred.promise;
        // var baseUrl = 'http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com/informer-api/depression_results';
        // //$http.get(baseUrl + '?outcomeid=' + outcomeId +'&targetid=' + targetid + "&comparatorId=" + comparatorId)
        // $http.get(baseUrl + '?outcomeid='+ outcomeId +
        //   '&targetid=' + targetId + '&comparatorid=' + comparatorId)
        //     .then(function(res) {
        //         console.log(res);
        //         deferred.resolve(res.data.entry);
        //     }, function(err) {
        //         console.log(err);
        //         deferred.reject(err);
        //     });
        // return deferred.promise;
    };

    this.getIncidentRate = function(targetId) {
        var deferred = $q.defer();
        var baseUrl = 'http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com/informer-api/irs';
        $http.get(baseUrl + '?condition_concept_id=' + targetId)
            .then(function(res) {
                console.log(res);
                deferred.resolve(res.data.entry);
            }, function(err) {
                console.log(err);
                deferred.reject(err);
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
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise;
  };

  this.getMedications = function(patientId) {
    var deferred = $q.defer();
    $http.get('http://ec2-54-70-205-229.us-west-2.compute.amazonaws.com:8080/gt-fhir-webapp/base/MedicationDispense?patient=' + patientId)
    .then(function(res) {
      deferred.resolve(res.data.entry);
    }, function(err) {
      console.log(err);
      deferred.reject(err);
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
      console.log(err);
      deferred.reject(err);
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
