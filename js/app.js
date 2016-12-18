//module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);
//routes
weatherApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
});
//services
weatherApp.service('cityService', function() {
    this.city = " ";  
});
//controllers
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
       cityService.city = $scope.city; 
    });
}]);
weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=6255455781a86b57945e3b989b99c378", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    $scope.convertToCelcius = function(degC) {
        return Math.round(degC - 273.15);  
    }
    $scope.convertToDate = function(dt) { 
        return new Date(dt * 1000);
    };  
}]);
//directives
weatherApp.directive("weatherReport", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/weatherReport.html',
       replace: true,
       scope: {
           weatherDay: "=",
           convertToStandard: "&",
           convertToDate: "&",
           dateFormat: "@"
       }
   }
});