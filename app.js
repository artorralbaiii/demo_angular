(function () {

    var app = angular.module('eventApp', ['ngRoute']);

    app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .when('/register', {
                templateUrl: 'views/register.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    }]);

    app.controller('HomeController', ['$scope', 'dataservice', function ($scope, dataservice) {
        $scope.eventData = {};
        $scope.events = [];
        $scope.showForm = false;
        $scope.toggleLabel = 'Add an event';

        var tempEvent = {};
        var currentIndex = null;

        dataservice.getEvents()
            .then(function (data) {
                $scope.events = data;
            });

        $scope.saveData = function () {
            angular.copy($scope.eventData, tempEvent);
            if (currentIndex !== null) {
                // $scope.events[currentIndex] = tempEvent;
                dataservice.updateEvent($scope.eventData)
                    .then(function (data) {
                        $scope.events[currentIndex] = data;
                    });
            } else {
                // $scope.events.push(tempEvent);
                dataservice.createEvent($scope.eventData)
                    .then(function (data) {
                        $scope.events.push(data);
                    });
            }

            $scope.eventData = {};
            tempEvent = {};
            currentIndex = null;
        }

        $scope.removeEvent = function (e) {
            dataservice.deleteEvent(e._id)
                .then(function (data) {
                    if (data._id) {
                        $scope.events.splice($scope.events.indexOf(e), 1);
                        currentIndex = null;
                        $scope.eventData = {};
                    }
                });
        }

        $scope.toggleForm = function () {
            $scope.showForm = !$scope.showForm;
            $scope.toggleLabel = ($scope.showForm ? 'Cancel' : 'Add an event')
            $scope.eventData = {};
            currentIndex = null;
        }

        $scope.updateEvent = function (e) {
            currentIndex = $scope.events.indexOf(e);
            $scope.eventData = e;
            $scope.showForm = true;
            $scope.toggleLabel = 'Cancel';
        }

    }]);

    app.factory('dataservice', ['$http', '$log', function ($http, $log) {
        var service = {};

        service.createEvent = function (data) {
            return $http.post('https://torralaj-events.mybluemix.net/api/events', data)
                .then(function (data) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }

        service.deleteEvent = function (id) {
            return $http.delete('https://torralaj-events.mybluemix.net/api/events/' + id)
                .then(function (data) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }

        service.getEvents = function () {
            return $http.get('https://torralaj-events.mybluemix.net/api/events')
                .then(function (data) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }

        service.updateEvent = function (data) {
            return $http.put('https://torralaj-events.mybluemix.net/api/events/' + data._id, data)
                .then(function (data) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }

        return service;
    }]);

})();