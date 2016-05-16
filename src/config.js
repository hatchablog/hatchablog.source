export default {

    func: ($stateProvider,
           $urlRouterProvider,
           $httpProvider,
           habConstants,
           gitFactory,
           $firebaseObject,
           $log) => {
        'ngInject';

        let gitFireBaseRef = new Firebase(habConstants.firebaseUrl + "/habPrivate/git/");

        $firebaseObject(gitFireBaseRef).$loaded()
            .then((data) => {

                //'common' will add the headder to every request.
                $httpProvider.defaults.headers.common["Authorization"] = 'token ' + data.token;

                //create git instance - fire up new instance
                let gitObj = new GitHub({
                    username: data.user,
                    token: data.token,
                    auth: 'basic',
                    repository: 'hatchablog.github.io',
                    branchName: 'master'
                });
                let gitRepo = gitObj.getRepo(data.user, 'hatchablog.github.io');

                gitFactory.setGitDetails(gitObj, gitRepo);
            })
            .catch((error) => {
                $log.log('Could not read git details from frirebase: ' + error);
            });

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