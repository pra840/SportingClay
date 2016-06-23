angular.module("mainModule", [])
  .controller("mainController", function ($scope, $http, jsonFilter)
  {
    var logResult = function (str, data, status, headers, config)
    {
      return str + "\n\n" +
        "data: " + data + "\n\n" +
        "status: " + status + "\n\n" +
        "headers: " + jsonFilter(headers()) + "\n\n" +
        "config: " + jsonFilter(config);
    };

    $scope.simpleGetCall = function (withSuccess) {
      var callURL = (withSuccess ? "http://192.168.185.159:8072/prama/shooter/" : "invalid-url");

    $scope.getCallJSON = function () {
      var params = {
        jsonObjParam: {
          param1: $scope.getJSONParam1,
          param2: $scope.getJSONParam2
        }
      };

      var config = {
        params: params
      };

      $http.get("http://192.168.185.159:8072/prama/shooter/", config)
        .success(function (data, status, headers, config)
        {
          // Since the data returned by the server is a JSON object in this case,
          // I use the json filter to output it as a string for debugging purposes.
          // The $http service automatically converts the response to a JavaScript
          // object whenever it sees that it looks like a JSON string.
          data = jsonFilter(data);

          $scope.getCallJSONResult = logResult("GET SUCCESS", data, status, headers, config);
        })
        .error(function (data, status, headers, config)
        {
          $scope.getCallJSONResult = logResult("GET ERROR", data, status, headers, config);
        });
    };

    $scope.getCallTimeout = function () {
      var params = {
        sleep: 3 // sleep for 3 seconds before responding
      };

      var config = {
        params: params,
        timeout: 1000 // wait at most 1 second for the response
      };

      $http.get("http://192.168.185.159:8072/prama/shooter/", config)
        .success(function (data, status, headers, config)
        {
          $scope.getCallTimeoutResult = logResult("GET SUCCESS", data, status, headers, config);
        })
        .error(function (data, status, headers, config)
        {
          $scope.getCallTimeoutResult = logResult("GET ERROR", data, status, headers, config);
        });
    };
  });