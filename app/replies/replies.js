'use strict';

angular.module('myApp.replies', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/replies', {
    templateUrl: 'replies/replies.html',
    controller: 'RepliesCtrl'
  });
}])

.controller('RepliesCtrl', ['$scope', function($scope) {

    $('nav li').removeClass('active');
    $('#mreplies').addClass('active');

    var neg = [],
        neu = [],
        pos = [];

    var tweets = window.data.tweets;
    for (var i=0; i<tweets.length; i++) {
        if (tweets[i].verdict == "negative") {
            neg.push({name: tweets[i].text, x2: Math.round(tweets[i].score * 100) / 100, verdict: "Отрицательный", x: tweets[i].score,  y: tweets[i].reply_count})
        } else if (tweets[i].verdict == "neutral") {
            neu.push({name: tweets[i].text, x2: Math.round(tweets[i].score * 100) / 100, verdict: "Нейтральный", x: tweets[i].score,  y: tweets[i].reply_count})
        } else if (tweets[i].verdict == "positive") {
            pos.push({name: tweets[i].text, x2: Math.round(tweets[i].score * 100) / 100, verdict: "Положительный", x: tweets[i].score,  y: tweets[i].reply_count})
        }
    }

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Количество ответов в зависимости от полярности'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Полярность'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Кол-во ответов'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b><br/>{point.verdict} ({point.x2})<br/>Число ответов: {point.y}'
                }
            }
        },
        series: [{
            name: 'Положительные',
            color: 'rgba(83, 220, 83, .5)',
            data: pos
        }, {
            name: 'Нейтральные',
            color: 'rgba(83, 83, 83, .5)',
            data: neu
        }, {
            name: 'Отрицательные',
            color: 'rgba(220, 83, 83, .5)',
            data: neg
        }]
    });

}]);