export default {
    name: 'habLogin',
    component: (gitFactory, utilFactory, $log, $state, firebaseFactory) => {
        'ngInject';
        
        return {
            restrict: 'E',
            scope: {},
            bindToController: {},
            controller: function () {
                let vm = this;
                
                //actions
                //login
                vm.login = (provider) => {
                    //Call firebase login
                    firebaseFactory.login(
                        provider, //provider
                        { scope: 'email' }, //Scope for fetch on provider
                        (authData) => {
                            //Login Into own Git for HAB - this is handled in $auth call
                            //On successful authentication - go to dashboard - this is handled in $auth call
                        },
                        //on failure 
                        (authError) => {
                            $log.error("Authentication failed:", authError);
                        });
                }
            },
            controllerAs: 'vm',
            templateUrl: 'hab.login.tpl.html',
            link: (scope, element, attrs) => { }
        };
    }
}