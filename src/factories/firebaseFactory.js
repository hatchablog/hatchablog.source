/* globals angular Github Firebase */

export default {
    name: 'firebaseFactory',
    factory: ($firebaseObject,
              $firebaseAuth,
              $log,
              $window,
              $firebaseArray,
              $state,
              observerFactory,
              gitFactory,
              habConstants) => {
        'ngInject';

        //log(`Full Name is ${firstName + ' ' + lastName}');
        const baseRef = new Firebase(habConstants.firebaseUrl);
        const baseAuthRef = $firebaseAuth(baseRef);

        //Bindables
        let currentUser = null;

        //get cached profile
        let getCachedProfile = (authData) => {
            if (!authData)
                return null;
            switch (authData.provider) {
                case "github":
                    return authData.github.cachedUserProfile;
                case "facebook":
                    return authData.facebook.cachedUserProfile;
                case "google":
                    return authData.google.cachedUserProfile;
                default:
                    return null;
            }
        };

        baseAuthRef.$onAuth((authData) => {
            let loadUserData = (user) => {
                //user $loaded occurs only the first time. - when login button is clicked.
                user.$loaded()
                    .then((data) => {

                        //And is logged in - go to dashboard
                        //This will make sure that user observer is registered.
                        $state.go('dashboard');

                        //Data does not have meta property - then new user
                        if (data.hasOwnProperty('meta')) {
                            //Not a new user
                            currentUser = user;
                            observerFactory.notify('user');
                            //Fire up git
                            gitFactory.fireUpGit(false, user); // isNewUser - false
                        } else {
                            //New user
                            user['meta'] = getCachedProfile(authData);
                            user.$save().then(() => {
                                currentUser = user;
                                observerFactory.notify('user');

                                //Fire up git
                                gitFactory.fireUpGit(true, user); // isNewUser - true
                            });
                        }

                    })
                    .catch((error) => {
                        $log.log(error);
                    });
            };

            //Called on successful authentication
            // By email
            // By oauth 
            // By any medium
            if (authData) {
                //Check if user profile exists
                let profilesRef = new Firebase(habConstants.firebaseUrl + "/profiles/" + authData.uid);
                var user = $firebaseObject(profilesRef);

                loadUserData(user);
            } else {
                $state.go('login');
            }
        });


        let goToEditor = (blog) => {
            //initialize etc
        }

        let deleteBlog = (blog) => {
            // 0) are you sure message?

            // 1) remove from blogs array
            currentUser['blogs'] = currentUser['blogs']
                .filter(function (b) {
                    return b.name !== blog.name;
                });
            
            currentUser.$save().then((data) => {
                observerFactory.notify('blogsListUpdated');
            });

            // 2) delete relevant directory from github
        }

        let downloadBlog = (blog) => {
            // 0) git hook to zip a given destination and download the repo.
        }

        let createBlog = (newBlog) => {
            if (currentUser.hasOwnProperty('blogs')) {
                //Blogs property already exists
            } else {
                //New user with no blogs init new array
                currentUser['blogs'] = [];
            }

            // Blog directory creation in Github
            //initialze the repository with the theme of choice
            gitFactory.createGitForBlog(currentUser, newBlog, (blogUrl) => {
                
                debugger;
                newBlog.blogUrl = blogUrl;
                
                //On successfully created blog
                currentUser['blogs'].pushIfNotExist(newBlog, (e) => {
                    return e.name === newBlog.name;
                });
                //Save user object to DB.
                currentUser.$save().then((data) => {
                    observerFactory.notify('blogsListUpdated');
                });
            });
        };

        let login = (mode, scope, cbSuccess, cbError) => {
            baseAuthRef.$authWithOAuthPopup(mode, scope).then((authData) => {
                cbSuccess(authData);
            }).catch((error) => {
                cbError(error);
            });
        }

        let logout = (callback) => {
            baseAuthRef.$unauth();
            if (callback) {
                callback();
            }
        }

        let isAuth = () => {
            var authData = baseAuthRef.$getAuth();
            return authData ? true : false;
        }

        //service to return
        const service = {};
        service.getUser = () => {
            return currentUser;
        };
        service.writeBlog = goToEditor;
        service.deleteBlog = deleteBlog;
        service.downloadBlog = downloadBlog;
        service.createBlog = createBlog;
        service.login = login;
        service.logout = logout;
        service.isAuth = isAuth;
        return service;
    }
}



 // // download the data from a Firebase reference into a (pseudo read-only) array
// // all server changes are applied in realtime
// $scope.messages = $firebaseArray(messagesRef);
// // create a query for the most recent 25 messages on the server
// var query = messagesRef.orderByChild("timestamp").limitToLast(25);
// // the $firebaseArray service properly handles database queries as well
// $scope.filteredMessages = $firebaseArray(query);

//Bindable object

//    let createUserByEmail = (profile) => {
//     debugger;
//     baseRef.createUser(profile, (error, userData) => {
//         if (error) {
//             switch (error.code) {
//                 //TODO: handle these cases.
//                 case "EMAIL_TAKEN":
//                     $log.error("EMAIL_TAKEN: The new user account cannot be created because the email is already in use.");
//                     break;
//                 case "INVALID_EMAIL":
//                     $log.error("INVALID_EMAIL: The specified email is not a valid email.");
//                     break;
//                 default:
//                     $log.error("Error creating user:", error);
//             }
//         } else {
//             $log.info("Successfully created user account with uid:", userData.uid);
//             createOrGetProfileForLoggedInUser(profile, userData);
//         }
//     });
// }