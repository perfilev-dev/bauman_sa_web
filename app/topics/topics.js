'use strict';

angular.module('myApp.topics', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/topics', {
    templateUrl: 'topics/topics.html',
    controller: 'TopicsCtrl'
  });
}])

.controller('TopicsCtrl', ['$scope', function($scope) {

    $('nav li').removeClass('active');
    $('#mtopics').addClass('active');

    var clusters = [],
        pos = [],
        neg = [],
        neu = [];

    var topics = window.data.topics,
        tweets = window.data.tweets;

    console.log(topics);
    console.log(tweets);

    var totalSize = 0;
    for (var i=0; i<topics.length; i++) {
        clusters.push({});
        clusters[i].size = topics[i].ids.length;
        totalSize += clusters[i].size;
    }

    // test if (x,y) in rect
    function isInRect(x, y, x1, y1, x2, y2) {
        return x1 <= x && x2 >= x && y1 <= y && y2 >= y;
    }

    var ids = [];
    for (var i=0; i<clusters.length; i++) {
        clusters[i].S = clusters[i].size/totalSize/4;
        clusters[i].a = Math.sqrt(clusters[i].S);

        var success = false;
        var x11, y11, x12, y12, x13, y13, x14, y14;
        var offset = Math.floor(Math.random()*100);
        for (var j=0; j<100; j++) {
            var x = Math.floor(((offset + j) % 100) % 10) / 10,
                y = Math.floor(((offset + j) % 100) / 10) / 10;

            console.log("[" + i + "] Test (" + x + ", " + y + ")");

            // rect.
            x11 = x;
            y11 = y;
            x12 = x + clusters[i].a;
            y12 = y;
            x13 = x;
            y13 = y + clusters[i].a;
            x14 = x + clusters[i].a;
            y14 = y + clusters[i].a;

            if (i === 0) {
                success = true;
                console.log("i = 0");
            }

            if ((x11 > 1) || (y11 > 1) || (x12 > 1) || (y12 > 1) || (x13 > 1) || (y13 > 1) || (x14 > 1) || (y14 > 1)) {
                console.log("out of borders");
                continue;
            }

            for (var k=0; k<i; k++) {
                var x21 = clusters[k].x1,
                    y21 = clusters[k].y1,
                    x22 = clusters[k].x2,
                    y22 = clusters[k].y2,
                    x23 = clusters[k].x3,
                    y23 = clusters[k].y3,
                    x24 = clusters[k].x4,
                    y24 = clusters[k].y4;

                if (isInRect(x11, y11, x21, y21, x24, y24) ||
                    isInRect(x12, y12, x21, y21, x24, y24) ||
                    isInRect(x13, y13, x21, y21, x24, y24) ||
                    isInRect(x14, y14, x21, y21, x24, y24) ||
                    isInRect(x21, y21, x11, y11, x14, y14) ||
                    isInRect(x22, y22, x11, y11, x14, y14) ||
                    isInRect(x23, y23, x11, y11, x14, y14) ||
                    isInRect(x24, y24, x11, y11, x14, y14)) {
                    console.log("intersection");
                    continue;
                }

                success = true;
                break;
            }

            if (success)
                break;
        }

        if (!success)
            console.warn("bad bad bad!");

        clusters[i].x1 = x11;
        clusters[i].y1 = y11;
        clusters[i].x2 = x12;
        clusters[i].y2 = y12;
        clusters[i].x3 = x13;
        clusters[i].y3 = y13;
        clusters[i].x4 = x14;
        clusters[i].y4 = y14;

        // ...
        for (var j=0; j<topics[i].ids.length; j++) {
            var id = topics[i].ids[j];
            ids.push(id);
            var x = x11 + Math.random() * clusters[i].a;
            var y = y11 + Math.random() * clusters[i].a;
            for (var k=0; k<tweets.length; k++) {
                if (tweets[k].id === id) {
                    if (tweets[k].verdict === "positive") {
                        pos.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Положительный", x: x,  y: y})
                    } else if (tweets[k].verdict === "neutral") {
                        neu.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Нейтральный", x: x,  y: y})
                    } else if (tweets[k].verdict === "negative") {
                        neg.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Отрицательный", x: x,  y: y})
                    }
                    break;
                }
            }
        }
    }

    for (var k=0; k<tweets.length; k++) {
        var x = -1 + Math.random();
        var y = Math.random();
        if (ids.indexOf(tweets[k].id) < 0) {
            if (tweets[k].verdict === "positive") {
                pos.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Положительный", x: x,  y: y})
            } else if (tweets[k].verdict === "neutral") {
                neu.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Нейтральный", x: x,  y: y})
            } else if (tweets[k].verdict === "negative") {
                neg.push({name: tweets[k].text, x2: Math.round(tweets[k].score * 100) / 100, verdict: "Отрицательный", x: x,  y: y})
            }
        }
    }

    console.log(clusters);

    var dots = [];

    var addRect = function(chart) {
        $('.rect').remove();

        var xScale = chart.plotBox.width / (chart.xAxis[0].max - chart.xAxis[0].min),
            yScale = chart.plotBox.height / (chart.yAxis[0].max - chart.yAxis[0].min);

        for (var i=0; i<clusters.length; i++) {
            var x = clusters[i].x3, // top left corner
                y = clusters[i].y3, //
                w = clusters[i].a,  // width
                h = clusters[i].a;  // height in coords...

            dots.push([x, y]);
            dots.push([x+w, y+h]);

            // convert...
            w *= xScale;
            h *= yScale;

            chart.renderer.rect(chart.xAxis[0].toPixels(x), chart.yAxis[0].toPixels(y), w, h, 1)
                .attr({
                    'stroke-width' : 1,
                    'stroke' : '#3fa9f5',
                    'fill' : 'none'
                })
                .add();

            // add title?
            var text = chart.renderer.text(topics[i].keywords.join(", "))
                .css({
                    fontSize: '13px',
                    color: '#666666'
                })
                .add();

            var textBBox = text.getBBox();
            x = chart.xAxis[0].toPixels(x) + w/2 - (textBBox.width  * 0.5);
            y = chart.yAxis[0].toPixels(y) - textBBox.height;
            console.log(x, y);
            text.attr({x: x, y: y});
        }
    };

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            events: {
                redraw: function() {
                    addRect(this);
                },
                load: function() {
                    addRect(this);
                }
            }
        },
        title: {
            text: 'Кластеризация по темам'
        },
        xAxis: {
            min: -1,
            max: 1,
            title: {
                enabled: false,
                text: 'Полярность'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            lineColor: 'transparent',
            gridLineColor: 'transparent',
            lineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },
            minorTickLength: 0,
            tickLength: 0
        },
        yAxis: {
            min: 0,
            max: 1,
            title: {
                enabled: false,
                text: 'Кол-во репостов'
            },
            gridLineColor: 'transparent',
            labels: {
                enabled: false
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
                    pointFormat: '<b>{point.name}</b><br/>{point.verdict} ({point.x2})'
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