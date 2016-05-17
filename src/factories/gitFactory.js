/* globals Firebase angular GitHub*/

export default {
    name: 'gitFactory',
    factory: (habConstants, $firebaseObject, $log, utilFactory, $http, base64) => {
        const gitApiUrl = 'https://api.github.com/';

        //git Obj for reference
        let git = null;
        let gitRepo = null;

        let setGitDetails = (obj, repo) => {
            git = {
                obj: obj,
                repo: repo
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
            if(git && git.repo) {
                debugger;

                git.repo.writeFile('master', target, data, 'Some Message...', {
                    author: '',
                    commiter: 'hatchablog@gmail.com',
                    //encode: true
                }, (response) => {
                    debugger;
                });
            }
        };


        //async write fn
        let asyncWriteFile = (url, target, err, finish) => {
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(data) {
                asyncWrite(data, target, err, finish)
            }, function errorCallback(error) {
                err(error);
            });
        };


        //create git for blog
        let createGitForBlog = (user, blogDetails, callback) => {

            //let error = curry(errShow, null);
            $http.get('themes/basic/index.html')
                .success(function (data) {
                    var d = data;
                    var encodedStr = base64.encode(d);

                    asyncWrite(encodedStr, 'test_jey.html', () => {
                        debugger;
                    }, () => {
                        debugger;
                    });
                })
                .error(function () {
                    debugger;
                });

            //trigger the callback.
            if (callback) {
                callback();
            }

            // asyncWriteFile(getPathForTheme('basic', 'index.html'), 'index.html', (err) => { 
            //     $log.log(err); }, () => {
            //     asyncWriteFile(getPathForTheme('basic', 'main.css'), 'main.css', (err) => { $log.log(err); }, () => {
            //         asyncWriteFile(getPathForTheme('basic', 'main.js'), 'main.js', (err) => { $log.log(err); }, () => {
            //             asyncWrite(JSON.stringify(config), 'main.json', (err) => { $log.log(err); }, () => {
            //                 asyncWrite("", 'CNAME', (err) => { $log.log(err); }, () => {
            //                     $log.log('Blog successfully initialised.');
            //                 });
            //             });
            //         });
            //     });
            // });


            // let a1 = curry(asyncWriteFile, getPathForTheme('basic', 'index.html'), "index.html", error);
            // let a2 = curry(asyncWriteFile, getPathForTheme('basic', 'main.css'), "main.css", error);
            // let a3 = curry(asyncWriteFile, getPathForTheme('basic', 'main.js'), "main.js", error);

            // let a4 = curry(asyncWrite, JSON.stringify(config), "main.json", error);
            // let a5 = curry(asyncWrite, "", "CNAME", error);
            // syncSeq(function () {
            //     $log.log('Blog successfully initialised.');
            // }, a1, a2, a3, a4, a5);
        };


        //fireUpGit
        let fireUpGit = (isNewUser, userObj) => {

            let gitFireBaseRef = new Firebase(habConstants.firebaseUrl + "/habPrivate/git/");

            $firebaseObject(gitFireBaseRef).$loaded()
                .then((data) => {
                    //'common' will add the headder to every request.
                    $http.defaults.headers.common["Authorization"] = 'token ' + data.token;

                    //create git instance - fire up new instance
                    let gitObj = new GitHub({
                        username: data.user,
                        token: data.token,
                        auth: 'basic',
                        repository: 'hatchablog.github.io',
                        branchName: 'master'
                    });
                    let gitRepo = gitObj.getRepo(data.user, 'hatchablog.github.io');

                    setGitDetails(gitObj, gitRepo);

                    debugger;
                    
                    let userId = userObj.meta.id; //this will be the directory name
                    if (isNewUser) {
                        //Initialize user folder
                    } else {
                        //Navigate into user folder
                    }
                    
                })
                .catch((error) => {
                    //TODO: Proper error handling.
                    $log.log('Could not read git details from frirebase: ' + error);
                });
            
            
        };
        
      

        //return        
        const service = {};
        service.createGitForBlog = createGitForBlog;
        service.fireUpGit = fireUpGit;
        return service;
    }
}