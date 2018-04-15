'use strict';

angular.module('myApp.tweets', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tweets', {
    templateUrl: 'tweets/tweets.html',
    controller: 'TweetsCtrl'
  });
}])

.controller('TweetsCtrl', ['$scope', '$http', '$filter', '$q', 'NgTableParams', function($scope, $http, $filter, $q, NgTableParams) {

    $('nav li').removeClass('active');
    $('#mtweets').addClass('active');

    var start = moment().subtract(30, 'days');
    var end = moment();

    $('input[name="daterange"]').daterangepicker({
        startDate: start,
        endDate: end,
        maxDate: end,
        locale: {
            cancelLabel: 'Clear'
        }
    }, function(start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });

    if (window.data) {
        var tweets = response.data.tweets;
        for (var i=0; i<tweets.length; i++) {
            tweets[i].date = new Date(tweets[i].ts * 1000).toString().substr(4, 17);
            tweets[i].score2 = Math.round(tweets[i].score * 100) / 100;
            tweets[i].verdict2 = (tweets[i].score > 0.33 ? "Положительный" : tweets[i].score < -0.33 ? "Негативный" : "Нейтральный");
        }

        $scope.tableParams = new NgTableParams({page: 1, count: 10}, {dataset: tweets});
    } else {
        $scope.tableParams = new NgTableParams({page: 1, count: 10}, {dataset: []});
    }

    $scope.search = function (q, fromDate, toDate) {

        $('.loader').addClass('is-active');

        $http({
            method: 'GET',
            url: 'http://localhost:5000/tweets?q=' + q + '&fromDate=' + fromDate + '&toDate=' + toDate + '&count=100'
        }).then(function successCallback(response) {
            window.data = response.data;

            var tweets = response.data.tweets;
            for (var i=0; i<tweets.length; i++) {
                tweets[i].date = new Date(tweets[i].ts * 1000).toString().substr(4, 17);
                tweets[i].score2 = Math.round(tweets[i].score * 100) / 100;
                tweets[i].verdict2 = (tweets[i].score > 0.33 ? "Положительный" : tweets[i].score < -0.33 ? "Негативный" : "Нейтральный");
            }

            $scope.tableParams = new NgTableParams({page: 1, count: 10}, {dataset: tweets});
            $('table').show();
            $('.loader').removeClass('is-active');
        }, function errorCallback(response) {
            console.log("bad");
            $('table').hide();
            $('.loader').removeClass('is-active');
        });
    };

}]);

function search() {

    // get args
    var q = $('#query').val();
    var since = $('#daterange').data('daterangepicker').startDate._d;
    var until = $('#daterange').data('daterangepicker').endDate._d;

    var fromDate = since.toISOString().substr(0,10);
    var toDate = until.toISOString().substr(0, 10);

    console.log(q, fromDate, toDate);

    var scope = angular.element(document.getElementById("MainWrap")).scope();
    scope.$apply(function () {
        scope.search(q, fromDate, toDate);
    });

    scope.$parent.data = {};
}
