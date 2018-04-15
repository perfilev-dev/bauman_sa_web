'use strict';

angular.module('myApp.timeline', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeline', {
    templateUrl: 'timeline/timeline.html',
    controller: 'TimelineCtrl'
  });
}])

.controller('TimelineCtrl', ['$scope', function($scope) {

    $('nav li').removeClass('active');
    $('#mtimeline').addClass('active');

    console.log(window.data);

    var tweets = window.data.tweets,
        categories = {};

    for (var i=0; i<tweets.length; i++) {
        var category = categories[tweets[i].until];
        if (!category)
            category = categories[tweets[i].until] = {"pos": 0, "neu+": 0, "neu-": 0, "neg": 0};

        if (tweets[i].verdict === "positive") {
            category["pos"] += 1;
        } else if (tweets[i].verdict === "negative") {
            category["neg"] -= 1;
        } else if (tweets[i].score > 0) {
            category["neu+"] += 1;
        } else {
            category["neu-"] -= 1;
        }
    }

    var pos = [],
        n_p = [],
        n_n = [],
        neg = [],
        cats = [];

    for (var i=0; i<Object.keys(categories).length; i++) {
        var key = Object.keys(categories).sort()[i];
        var category = categories[key];
        cats.push(key);
        pos.push(category["pos"]);
        n_p.push(category["neu+"]);
        n_n.push(category["neu-"]);
        neg.push(category["neg"]);
    }

    console.log(cats);

    var n_cats = [];
    for (var i=0; i<cats.length; i++) {
        n_cats.push((new Date(1000*parseInt(cats[i]))).toISOString().substr(0, 10))
    }

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Полярность твитов во временной шкале'
        },
        xAxis: {
            categories: n_cats,
            reversed: false
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value);
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', дата ' + this.point.category + '</b><br/>' +
                    'Число твитов: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
            }
        },

        series: [{
            name: 'Отрицательные',
            color: '#D7665E',
            data: neg
        }, {
            name: 'Умеренно отрицательные',
            color: '#F4BDBA',
            data: n_n
        }, {
            name: 'Положительные',
            color: '#A9BD99',
            data: pos
        }, {
            name: 'Умеренно положительные',
            color: '#EEF4EC',
            data: n_p
        }]
    });

}]);