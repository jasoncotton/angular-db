describe('angular-db.js', function () {
    var dbProvider,
        service,
        $rootScope,
        $q,
        testConfig = {
            server: 'TEST_',
            version: 2,
            schema: {
                test: {
                    key: { keyPath: 'id' }
                }
            }
        };

    beforeEach(function () {
        module('dbService');
    });

    beforeEach(function () {
        module(['dbProvider', function (_dbProvider_) {
            dbProvider = _dbProvider_;
            dbProvider.config(testConfig);
        }]);
    });

    beforeEach(function () {
        inject(['db', '$rootScope', '$q', function (_db_, _$rootScope_, _$q_) {
            service = _db_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        }])
    });

    describe('with custom configuration', function () {
        it('should accept configuration options', function () {
            expect(dbProvider).toBeDefined();
            expect(dbProvider.getOptions()).toBe(testConfig);
        });
    });

    describe('the interface', function () {
        var testObject = {
            id: 1,
            value: 123
        };
        describe('saving an object', function () {
            it('should save the object', function () {
                var testInterface = service('test'),
                    hasBeenRun = false,
                    promise;
                expect(testInterface).toBeDefined();

                promise = testInterface.putBatch([testObject]);
                expect(promise).toBeDefined();
                expect(promise.then).toBeDefined();

                promise.then(
                    function (response) {
                        console.log('response', response);
                        expect(response).toBeDefined();
                        hasBeenRun = true;
                    },
                    function (err) {
                        console.log('err', err);
                        expect(err).toBeUndefined();
                        hasBeenRun = true;
                    }
                );

                $rootScope.$digest();
                // expect(hasBeenRun).toBe(true);
            });
        });

    });

    it('should pass tests', function () {
        expect(true).toBe(true);
    });
});