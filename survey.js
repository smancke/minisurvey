$(function () {
        $('body').popover({
            selector: '[data-toggle="popover"]',
            trigger: 'hover',
        });
    });

var survey = angular.module('survey', []);

survey.directive('contenteditable', function() {

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            // model -> view
            ctrl.$render = function() {
                elm.html(ctrl.$viewValue);
            };

            /**
             * handling the maxlength parameter
             */
            elm.bind('keyup', function(event) {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });
        }
    }
});

survey.controller('ListCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.surveys =  { };

    $http.get('survey_api.php')
        .success(function(data, status, headers, config) {
            $scope.surveys = data;
        });        
}]);

survey.controller('SurveyCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.surveyModified = false;
    $scope.survey =  {'comments':{} };
    $scope.ignoreNextWatch = false;

    $scope.loadUri = function(uri) {
        $http.get(uri)
            .success(function(data, status, headers, config) {
                $scope.survey = data;
                $scope.surveyModified = false;
            })
            .error(function(data, status, headers, config) {
                alert("error while loading "+status);
            });
    }

    var surveyuri = location.search.split('surveyuri=')[1];
    if (surveyuri) {
        $scope.loadUri(surveyuri);
    }
        
    $scope.$watch('survey', function(newValue, oldValue) {
        if ($scope.ignoreNextWatch) {
            $scope.ignoreNextWatch = false;
            return;
        }
        if (Object.keys(oldValue).length > 0 && newValue !== oldValue) {
            $scope.surveyModified = true;
        }
    }, true);        

    $scope.save = function() {
        if ($scope.survey.surveyURI) { // update
            $http.put($scope.survey.surveyURI, $scope.survey)
                .success(function(data, status, headers, config) {
                    $scope.surveyModified = false;
                })
                .error(function(data, status, headers, config) {
                    alert("error while saving "+status);
                });

        } else { // create new
            $http.post('survey_api.php', $scope.survey)
                .success(function(data, status, headers, config) {
                    $scope.ignoreNextWatch = true;
                    $scope.loadUri(headers('Location'));
                })
                .error(function(data, status, headers, config) {
                    alert("error while saving "+status);
                });
        }
    };

    $scope.questionData =  global_question_data;
}]);
