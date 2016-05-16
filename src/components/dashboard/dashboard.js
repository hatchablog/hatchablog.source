export default {
    name: 'habDashboard',
    templates: {
        'dashboard.tpl.html': require('./dashboard.tpl.html')
    },
    component: ($log, gitFactory, utilFactory, firebaseFactory, $state, $timeout, observerFactory) => {
        'ngInject';

        return {
            restrict: 'E',
            scope: {},
            bindToController: {},
            controller: function ($scope) {

                //bindables
                let vm = this;
                vm.user = null;
                //user has - meta (name, picture) - blogs 

                //get user
                let loggedInUser = firebaseFactory.getUser();
                if (loggedInUser !== null) {
                    let u = firebaseFactory.getUser();
                    vm.user = u;
                } else {
                    //no user - therefore - register an observer
                    observerFactory.register('user', () => {
                        let u = firebaseFactory.getUser();
                        vm.user = u;
                    });
                }

                //blogs
                observerFactory.register('blogsListUpdated', () => {
                    //this is two way bound - un necesary to register an observer
                });


                //actions
                //TODO: Form validation
                // 1) Minimum length of name
                // 2) Validation of items that make a blog
                // 3) check if another blog with the same name exists
                // 4) ng-messages for validation
                //feedback message
                vm.isFormSubmittable = false;
                vm.creatingMessage = 'Choose Blog Name and Theme.';
                //create new blog
                vm.onBlogNameEntered = (name) => {
                    if (vm.user && vm.user.blogs && vm.user.blogs.length) {
                        vm.user.blogs.map((blog) => {
                            if (blog.name.toLowerCase() === name) {
                                vm.creatingMessage = 'A blog with the same name already exists. Choose another name.';
                                vm.isFormSubmittable = false;
                            }
                            else {
                                vm.isFormSubmittable = true;
                            }
                        });
                    }
                }
                vm.createBlog = (blog) => {
                    //Clone the directory of themes in git
                    
                    
                    //If successfuly call the firebase factory to create a blog object
                    
                    //If failed then give an error
                    
                    //Also put a busy indicator on to wait for it.
                    firebaseFactory.createBlog(blog);
                }
                //go to editor - blog
                vm.goToEditor = (blog) => {
                    firebaseFactory.goToEditor(blog);
                }
                // delete blog 
                vm.deleteBlog = (blog) => {
                    firebaseFactory.deleteBlog(blog);
                }
                //download blog
                vm.downloadBlog = (blog) => {
                    firebaseFactory.downloadBlog(blog);
                }
                //logout
                vm.logout = function () {
                    firebaseFactory.logout(() => {
                        $state.go('login');
                    });
                } 
            },
            controllerAs: 'vm',
            templateUrl: 'hab.dashboard.tpl.html',
            link: (scope, element, attrs) => {

            }
        };
    }
}