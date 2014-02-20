var survey = angular.module('survey', []);

survey.controller('ListCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.surveys =  {};

    $http.get('survey_api.php')
        .success(function(data, status, headers, config) {
            $scope.surveys = data;
        });        
}]);

survey.controller('SurveyCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.surveyModified = false;
    $scope.survey =  {};
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

    $scope.questionData =  [
        
        {'category' : 'Projekt',
         'questions' : [
             {
                 'id' : 'customer',
                 'title' : 'Kunde',
                 'description': 'Der Kunde für das Projekt. \'Intern\' für interne Projekte. \'Product\' für Produkte. ',
                 'type' : 'string',
             },
             {
                 'id' : 'projectName',
                 'title' : 'Projektname',
                 'description': 'Der Name des Projektes oder Produktes.',
                 'type' : 'string',
             },
             {
                 'id' : 'developmentCycle',
                 'title' : 'Entwicklungsphase',
                 'options' : {0: 'Prototyp/Vorprojekt', 1: 'Projektstart', 2: 'Aktive Entwicklung', 3: 'Finalisierung', 4: 'Wartung'},
             },
             {
                 'id' : 'surveyURI',
                 'title' : 'Uri der Erhebung',
                 'type' : 'label'
             },
             {
                 'id' : 'date',
                 'title' : 'Datum der Erhebung',
                 'type' : 'label'
             },
         ]},

        {'category' : 'Allgemein',
         'questions' : [
             {
                 'id' : 'commentsReviever',
                 'title' : 'Kommentar Reviewer',
                 'type' : 'text'
             },
             {
                 'id' : 'commentsTeam',
                 'title' : 'Kommentar und Ziele des Teams',
                 'type' : 'text'
             },
             {
                 'id' : 'locTotal',
                 'title' : 'LOC Produktivcode?',
                 'type' : 'integer'
             },
             {
                 'id' : 'locTests',
                 'title' : 'LOC Testcode?',
                 'type' : 'integer'
             }
         ]},

        {'category' : 'Unit Testing',
         'questions' : [
             {
                 'id' : 'utcc',
                 'title' : 'Unit-Test: Code Coverage?',
                 'type' : 'integer',
                 'unit' : '%',
             },
             {
                 'id' : 'utc',
                 'title' : 'Unit-Test: Anzahl Tests',
                 'type' : 'integer'
             },
             {
                 'id' : 'utIgnored',
                 'title' : 'Anzahl ignorierter/auskommentierter Unit-Tests',
                 'type' : 'integer'
             },
             {
                 'id' : 'utgreenbuilds',
                 'title' : 'Verhältnis rote zu grünen Builds?',
                 'unit' : '%',
                 'type' : 'integer'
             },
         ]},

        {'category' : 'Fachliche Tests / Integrations Tests',
         'questions' : [
             {
                 'id' : 'testSystemAvailable',
                 'title' : 'Gibt es ein Testsystem?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'testSystemAutomated',
                 'title' : 'Erfolgt die Installation auf dem Testsystem automatisiert?',
                 'options' : {0:'nein, manuell', 1:'teilweise automatisiert', 2:'ja, automatisiert'}, 
             },
             {
                 'id' : 'bugtrackerAvailable',
                 'title' : 'Gibt es einen Bugtracker?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'openBugCount',
                 'title' : 'Anzahl offener Bugs?',
                 'type' : 'integer'
             },
             {
                 'id' : 'testMethodManuell',
                 'title' : 'Wird fachlich manuell getestet?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'testMethodAutomated',
                 'title' : 'Wie wird fachlich automatisiert getestet?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'itc',
                 'title' : 'Anzahl automatisierter Testfälle?',
                 'type' : 'integer'
             },
             {
                 'id' : 'ittestruns',
                 'title' : 'Anzahl Testläufe pro Woche?',
                 'type' : 'integer'
             },
             {
                 'id' : 'ittestIgnored',
                 'title' : 'Anzahl aktuell ignorierter/auskommentierter Tests?',
                 'type' : 'integer'
             },
             {
                 'id' : 'ittesterror',
                 'title' : 'Anzahl aktuell fehlschlagender Tests?',
                 'type' : 'integer'
             },
         ]},

        {'category' : 'Statische Analyse',
         'questions' : [
             {
                 'id' : 'sonarAvailable',
                 'title' : 'Gibt es einen eingerichteten Sonar?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'sonarRc',
                 'title' : 'Rule Compliance?',
                 'unit' : '%',
                 'type' : 'integer'
             },
             {
                 'id' : 'sonarFindbugsFindings',
                 'title' : 'Findings von Findbugs (Anzahl)?',
                 'type' : 'integer'
             },

         ]},

        {'category' : 'Dokumentation',
         'questions' : [
             {
                 'id' : 'javadoc',
                 'title' : 'Ist der Code Dokumentiert (Javadoc)?',
                 'options' : {0: 'minimal dokumentiert', 1: 'mittelmäßig dokumentiert', 2: 'gut dokumentiert'}
             },
             {
                 'id' : 'otherDoku',
                 'title' : 'Wie ist die übergreifende Dokumentation?',
                 'options' : {0: 'nicht vorhanden', 1: 'schlecht', 2: 'mittelmäßig', 3: 'gut'}
             },
         ]},

        {'category' : 'Vorgehen',
         'questions' : [
             {
                 'id' : 'iterations',
                 'title' : 'Arbeitet das Team in kurzen Iterationen (z.B. Sprints)?',
                 'type' : 'boolean',
             },
             {
                 'id' : 'iterationsAcceptanceCriterias',
                 'title' : 'Gibt es klare Abnahmekriterien für die Iterationen?',
                 'type' : 'boolean',
             },
             {
                 'id' : 'reviews',
                 'title' : 'Macht das Team Reviews am Ende der Iterationen?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'dod',
                 'title' : 'Hat das Team eine DoD, die beachtet wird?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'retros',
                 'title' : 'Macht das Team regelmäßige Retros?',
                 'type' : 'boolean'
             },
             {
                 'id' : 'codereviews',
                 'title' : 'Wird der code gegenseitig gereviewed?',
                 'options' : {0: 'nie', 1: 'manchmal', 2: 'meistens', 3: 'immer'}
             },
             {
                 'id' : 'pairProgramming',
                 'title' : 'Wird Pair Programming gemacht?',
                 'type' : 'boolean'
             },
         ]},

        {'category' : 'Technical debt (Teamaussagen)',
         'questions' : [
             {
                 'id' : 'technicalDept',
                 'title' : 'Wie hoch ist der technical debt?',
                 'options' : {0: 'sehr hoch', 1: 'mittel', 2: 'gering'},
             },
             {
                 'id' : 'technicalDeptReduce',
                 'title' : 'Konnte in den letzen Sprints technical debt abgebaut werden?',
                 'options' : {0: 'nein, verschlechtert', 1: 'gleich geblieben', 2: 'ja, wurde abgebaut'},
             },
         ]},

    ]
}]);
