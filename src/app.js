/* globals Firebase angular*/

// check if an element exists in array using a comparer function comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
}; 

// adds an element to the array if it does not already exist using a comparer function
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

import angular from 'angular';
import angularuirouter from 'angular-ui-router';
import firebase from 'firebase';
import angularfire from 'angularfire';

import base64 from 'angular-utf8-base64';

import observerFactory from './factories/observerFactory';
import firebaseFactory from './factories/firebaseFactory';
import gitFactory from './factories/gitFactory';
import utilFactory from './factories/utilFactory';

import habLoginComponent from './components/login/login';
import habDashboardComponent from './components/dashboard/dashboard';
import habEditorComponent from './components/editor/editor';

import config from './config';
import run from './run';

const deps = [
    'ui.router',
    'utf8-base64',
    'firebase'
];

angular.module('hab', deps)
//Constants
    .constant("habConstants", {
        firebaseUrl: 'https://crackling-inferno-47.firebaseio.com'
    })
//Factories
    .factory(observerFactory.name, observerFactory.factory)
    .factory(firebaseFactory.name, firebaseFactory.factory)
    .factory(gitFactory.name, gitFactory.factory)
    .factory(utilFactory.name, utilFactory.factory)
//Components
    .directive(habLoginComponent.name, habLoginComponent.component)
    .directive(habDashboardComponent.name, habDashboardComponent.component)
    .directive(habEditorComponent.name, habEditorComponent.component)
//Config
    .config(config.func)
//Run
    .run(run.func);