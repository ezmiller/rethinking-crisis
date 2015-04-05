/**
* Author: Ethan Miller (CodeCuts)
* scripts.js
*/
/*jslint browser: true*/
/*global $, console, Modernizr*/

(function () {
    'use strict';

    var page = function() {
        var self = {};

        self.initialize = function() {
            this.checkFallBacks();
        };

        self.checkFallBacks = function() {
            if (!Modernizr.cssvhunit) {
                $('.intro').height(this.getScreenSize().y);
            }
        };

        self.getScreenSize = function () {
            return {
                'x': $(window).width(),
                'y': $(window).height()
            };
        };

        return self;
    };

    window.onload = function() {
        var view = page();
        view.initialize();
    };

}());