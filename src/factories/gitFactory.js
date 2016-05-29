/* globals Firebase angular GitHub*/

export default {
    name: 'gitFactory',
    factory: (habConstants, $firebaseObject, $log, utilFactory, $http, base64) => {
        const gitApiUrl = 'https://api.github.com/';

        //git Obj for reference
        let git = null;

        let setGitDetails = (obj, repo, fireGitData) => {
            git = {
                obj: obj,
                repo: repo,
                fireGitData: fireGitData
            }
        };

        //curry a function
        let curry = (fn) => {
            let args = Array.prototype.slice.call(arguments, 1);
            return function () {
                let innerArgs = Array.prototype.slice.call(arguments);
                let finalArgs = args.concat(innerArgs);
                return fn.apply(null, finalArgs);
            };
        };

        //async finish
        let asyncFinish = (total, success) => {
            var cnt = 0;
            //TODO: Is Busy - start
            return function () {
                cnt++;
                if (cnt == total) {
                    //TODO: is busy finished
                    if (typeof success == "function") {
                        success();
                    }
                }
            }
        };

        //sync repo sequence
        let syncSeq = (success) => {
            let args = Array.prototype.slice.call(arguments, 1);
            let finish = asyncFinish(1, success);
            let l = args.length;
            let tmp = curry(args[l - 1], finish);

            for (var i = l - 2; i >= 0; --i) {
                tmp = curry(args[i], tmp);
            }

            tmp();
        };

        //async write
        let asyncWrite = (data, target, err, finish) => {
            if (git && git.repo) {
                git.repo.write(git.fireGitData.branch, target, data, "Writing Hatch A Blog data...",
                    function (e) {
                        if (e === null) {
                            //no error
                            if (finish) {
                                finish();
                            }
                        } else {
                            if (err) {
                                err();
                            }
                        }
                    });
            }
        };


        //async write fn
        let asyncWriteFile = (url, target, err, finish) => {
            $http({
                method: 'GET',
                url: url
            }).then((response) => {
                //success callback
                asyncWrite(response.data, target, err, finish)
            }, (error) => {
                //error callback
                err(error);
            });
        };


        //create git for blog
        let createGitForBlog = (user, blogDetails, callback) => {

            let errCreatingBlog = (err) => {
                $log.log('Error Writing File when initiating theme for blog: ' + err);
            };

            let userDirPrefix = 'blogs/' + user.meta.id + '/' + blogDetails['name'] + '/';
            let urlPrefix = 'themes/' + blogDetails['theme'] + '/';

            //get themeFiles list
            $http({
                method: 'GET',
                url: urlPrefix + 'themeFiles.json'
            }).then((response) => {
                if (response.status === 200) {
                    let rootFiles = response.data['root'];
                    let cssFiles = response.data['css'];
                    let jsFiles = response.data['js'];

                    debugger;

                    if (rootFiles.length > 0) {
                        rootFiles.map((fileName) => {
                            debugger;
                            asyncWriteFile((urlPrefix + fileName), (userDirPrefix + fileName), errCreatingBlog, () => {
                                $log.log('Successfully wrote root file.');
                            });
                        });
                    }

                    // if(cssFiles.length > 0) {
                    //     cssFiles.map((fileName) => {
                    //         asyncWriteFile((urlPrefix + fileName), (userDirPrefix + 'css/' + fileName), errCreatingBlog, () => {
                    //             $log.log('Successfully wrote css file.');
                    //         });
                    //     });
                    // }
                    //
                    // if(jsFiles.length > 0) {
                    //     jsFiles.map((fileName) => {
                    //         asyncWriteFile((urlPrefix + fileName), (userDirPrefix + 'js/' + fileName), errCreatingBlog, () => {
                    //             $log.log('Successfully wrote js file.');
                    //         });
                    //     });
                    // }

                    // var config = {
                    //     "name": user.meta.name,
                    //     "number_of_posts_per_page": 5,
                    //     "disqus_shortname": "",
                    //     "posts": [],
                    //     "pages": []
                    // };
                    //
                    // asyncWrite(JSON.stringify(config), 'main.json', errCreatingBlog, () => {
                    //     asyncWrite("", 'CNAME', errCreatingBlog, () => {
                    //         $log.log('Blog successfully initialised.');
                    //
                    //         if (callback) {
                    //             callback();
                    //         }
                    //     });
                    // });

                } else {
                    $log.log('Error could not read theme files for the themes directory.')
                }
            }, (error) => {
                $log.error('Error getting themes files - themeFiles.json' + error);
            });
        };


        //fireUpGit
        let fireUpGit = (isNewUser, userObj) => {

            let gitFireBaseRef = new Firebase(habConstants.firebaseUrl + "/habPrivate/git/");

            $firebaseObject(gitFireBaseRef).$loaded()
                .then((firebaseGitData) => {

                    //'common' will add the headder to every request.
                    $http.defaults.headers.common["Authorization"] = 'token ' + firebaseGitData.token;

                    //create git instance - fire up new instance
                    let gitObj = new Github({
                        username: firebaseGitData.userId,
                        token: firebaseGitData.token,
                        auth: firebaseGitData.authType,
                        repository: firebaseGitData.repoId,
                        branchName: firebaseGitData.branch
                    });

                    let gitRepo = gitObj.getRepo(firebaseGitData.userId, firebaseGitData.repoId);

                    setGitDetails(gitObj, gitRepo, firebaseGitData);


                    let userId = userObj.meta.id; //this will be the directory name

                    // var newUserConfig = {
                    //     "name": user.meta.name,
                    //     "number_of_posts_per_page": 5,
                    //     "disqus_shortname": "",
                    //     "posts": [],
                    //     "pages": []
                    // };

                    if (isNewUser) {
                        //Initialize user folder
                    } else {
                        //Navigate into user folder
                    }

                }).catch((error) => {
                //TODO: Proper error handling.
                $log.log('Could not read git details from fire-base: ' + error);
            });
        };


        //return        
        const service = {};
        service.createGitForBlog = createGitForBlog;
        service.fireUpGit = fireUpGit;
        return service;
    }
}