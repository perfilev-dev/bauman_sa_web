'use strict';

angular.module('myApp.tags', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tags', {
    templateUrl: 'tags/tags.html',
    controller: 'TagsCtrl'
  });
}])

.controller('TagsCtrl', ['$scope', function($scope) {

    $('nav li').removeClass('active');
    $('#mtags').addClass('active');

    var keywords = window.data.keywords,
        pos = [],
        neu = [],
        neg = [];

    for (var i=0; i<Object.keys(keywords.positive).length; i++) {
        var key = Object.keys(keywords.positive)[i];
        pos.push({name: key, weight: keywords.positive[key]});
    }

    for (var i=0; i<Object.keys(keywords.neutral).length; i++) {
        var key = Object.keys(keywords.neutral)[i];
        neu.push({name: key, weight: keywords.neutral[key]});
    }

    for (var i=0; i<Object.keys(keywords.negative).length; i++) {
        var key = Object.keys(keywords.negative)[i];
        neg.push({name: key, weight: keywords.negative[key]});
    }

    Highcharts.chart('negative', {
        series: [{
            type: 'wordcloud',
            data: neg,
            name: 'Occurrences'
        }],
        title: {
            text: 'Отрицательные'
        }
    });

    Highcharts.chart('neutral', {
        series: [{
            type: 'wordcloud',
            data: neu,
            name: 'Occurrences'
        }],
        title: {
            text: 'Нейтральные'
        }
    });

    Highcharts.chart('positive', {
        series: [{
            type: 'wordcloud',
            data: pos,
            name: 'Occurrences'
        }],
        title: {
            text: 'Положительные'
        }
    });

}]);