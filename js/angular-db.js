(function () {
    angular.module('dbService', [])
        .provider('db', [function() {
            var self = this,
                options = null;

            this.config = function (_options) {
                options = _options;
            };

            this.getOptions = function () {
                return options;
            };

            this.$get = function ($rootScope, $q, $timeout) {
                var deferred = $q.defer(),
                    request = db.open(options), // TODO: this.options || default
                    server = null,
                    objectStore = null;

                request.then(
                    function onFulfilled(s) {
                        server = s;
                        deferred.resolve(s);
                        return s;
                    },
                    function onRejected(response) {
                        console.log('was rejected', response);
                    }
                );

                var execute = function execute(transactionFunction) {
                    if (server !== null) {
                        deferred = $q.defer();
                        $timeout(function () {
                            deferred.resolve(transactionFunction(server));
                        });
                    } else {
                        deferred.promise.then(
                            function (server) {
                                transactionFunction(server)
                            },
                            function onRejected(response) {
                                console.log('response was; ', response);
                            }
                        );
                    }
                    return deferred.promise;
                };

                function getWrapper(objectStore) {
                    return function get(key, value, onSuccess, onError) {
                        return execute(function (connection) {
                            connection[self.objectStore]
                                .query()
                                .filter(key, value)
                                .execute()
                                .then(function success(response) {
                                    return deferred.resolve(response);
                                }, function fail(response) {
                                    return deferred.reject(response);
                                }, function otherwise() {
                                    if (!$rootScope.$$phase) $rootScope.$apply();
                                });
                        });
                    };
                }

                function putBatchWrapper(objectStore) {
                    return function putBatch(array) {
                        var deferred = $q.defer();

                        request.then(
                            function onFulfilled(server) {
                                deferred.resolve(server[objectStore].update.apply(null, array));
                            },
                            function onRejected(response) {
                                console.log('response for rejected: ', response);
                                deferred.reject(response);
                                return response;
                            }
                        );
                        return deferred.promise;
                    };
                }

                function getBatchWrapper(objectStore) {
                    return execute(function(connection) {
                        connection[self.objectStore]
                            .query()
                            .filter()
                            .execute()
                            .done(function(array) {
                                if (typeof onSuccess === 'function') onSuccess(array);
                                if ( ! $rootScope.$$phase) $rootScope.$apply();
                            });
                    });
                }

                var service = function service(objectStore) {
                    self.objectStore = objectStore;
                    return {
                        get: getWrapper(objectStore),
                        putBatch: putBatchWrapper(objectStore),
                        getBatch: getBatchWrapper(objectStore)
                    }
                };

                return service;
            };
        }]);
}).call(this);