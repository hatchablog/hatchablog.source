export default {
    name: 'habEditor',
    component: ($log) => {
        'ngInject'
        
        return {
            restrict: 'E',
            scope: {},
            bindToController: {},
            controller: function () { 
                //bindables
                let vm = this;
                
                
            },
            controllerAs: 'ctrl',
            templateUrl: 'hab.editor.tpl.html',
            link: (scope, element, attrs) => { }
        };
    }
}