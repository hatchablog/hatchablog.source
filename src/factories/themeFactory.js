export default {
    name: 'themeFactory',
    factory: ($log, $http, $q) => {
        "ngInject";

        //register an observer
        let getFilesForTheme = function(themeName) {
            var defer = $q.defer();            
            var themeDirectory = 'themes/' + basic + '/index.html';
            
            $http.get(themeDirectory)
                .success(function(data) {
                    angular.extend(_this, data);
                    defer.resolve();
                })
                .error(function() {
                    defer.reject('could not find someFile.json');
                });
            return defer.promise;
        }

        myModule.service('myService', function($http, $q) {
            var _this = this;

            this.promiseToHaveData = function() {

            }
        });


        
        service.test = test;
        return service;
    }
}