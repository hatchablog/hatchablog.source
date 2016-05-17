export default {
    func: ($rootScope,
           firebaseFactory,
           $state) => {
        'ngInject';
        
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams, options) {
                if (!firebaseFactory.isAuth && toState.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            });
    }
}