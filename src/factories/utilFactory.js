export default {
    name: 'utilFactory',
    factory: ($http, $log) => {
        'ngInject';
  
        //Groups an array by any property or properties
        //TODO: make a gist of this awesomeness
        let groupBy = (array, f) => {
            let groups = {};
            array.forEach((o) => {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map((group) => {
                return groups[group];
            })
        }
        
        //return
        const service = {};
        service.groupBy = groupBy;
        return service;
    }
}