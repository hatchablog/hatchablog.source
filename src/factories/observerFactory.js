

export default {
    name: 'observerFactory',
    factory: ($log) => {
        "ngInject";

        //Observers
        //Array of observers
        let observers = [];



        //de-register observer
        // TODO:

        //Notify
        //call the call back when the specified property has been changed
        let notify = (callbackKey) => {
            if (observers !== null && observers.length > 0) {
                observers.map((observer) => {
                    if (observer.key == callbackKey && typeof (observer.callback) === 'function') {
                        observer.callback();
                    }
                })
            }
        }

        //register an observer
        let register = function(key, callback) {
            observers.push({
                key: key,
                callback: callback
            });
        }
        
        
        const service = {};
        service.register = register;
        service.notify = notify;
        return service;
    }
}