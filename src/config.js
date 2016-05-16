export default {
    func: ($stateProvider, $urlRouterProvider) => {
        'ngInject';

        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state('login', {
                url: "/login",
                template: "<hab-login></hab-login>"
            })
            .state('dashboard', {
                url: "/dashboard",
                template: "<hab-dashboard></hab-dashboard>"
            })
            .state('editor', {
                url: "/editor",
                template: "<hab-editor></hab-editor>"
            });
    }
}