'use strict';

/**
 * Instantiate a new Github object.
 *
 * @param {Object} config An object containing the username, password, type of auth, and the repository to use.
 *
 * @constructor
 */
function Github(config) {
    var githubApi = new Github({
        username: config.username,
        token: config.token,
        auth: config.auth,
        repository: config.repository,
        branchName: 'master'
    });

    this.repository = githubApi.getRepo(config.username, config.repository);
}

/**
 * Update a file of the repository (or create a new if it didn't exist). The method returns a Promise that,
 * when resolved returns the repository object. This is the same as the <code>repository</code> property of the
 * <code>data</code> parameter.
 *
 * @param {Object} data An object containing the data to update (or create) the new file. The object must contain
 * the following properties:
 * - {string} <code>branchName</code>: The name of the branch in which the file should be updated (or create)
 * - {string} <code>commitTitle</code>: The commit message for the change
 * - {string} <code>content</code>: The content of the file
 * - {string} <code>filename</code>: The path of the file to update (or create)
 * - {Object} <code>repository</code>: The object representing the repository to update
 *
 * @returns {Promise}
 */
Github.prototype.saveFile = function (data) {
    return new Promise(function (resolve, reject) {
        data.repository.write(
            data.branchName,
            data.filename,
            data.content,
            data.commitTitle,
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.repository);
                }
            }
        );
    });
};

module.exports = Github;