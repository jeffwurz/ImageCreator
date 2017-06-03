angular.module('ImageCreator', [ 'ngRoute' ]).config(function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/svg', {
        templateUrl: 'views/svg.html',
        controller: 'SVGCtrl'
      })
      .otherwise({
        redirectTo: '/svg'
      });
  });
