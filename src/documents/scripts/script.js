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
            this.attach();
            this.checkFallBacks();
            this.initializeVideoPlayers();
        };

        self.attach = function() {

            var resize = debounce(function() {
                var videos;
                this.setupSpeakerBios();
                videos = this.getVideoPlayers();
                $.each(videos, function(k,video) {
                    video.setVideoSize();
                });
            }.bind(this), 200);
            window.addEventListener('resize', resize);

            $('.scrollTo').on('click', function(e) {
                e.preventDefault();
                smoothScroll($(window), $($(e.currentTarget).attr('href')).offset().top, 200);
            });

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

        self.isMobile = function() {
            var screenSize = this.getScreenSize();
            return screenSize.x <= 400;
        };

        self.isTablet = function() {
            var screenSize = this.getScreenSize();
            return screenSize.x > 400 && screenSize.x <= 750;
        };

        self.isDesktop = function() {
            var screenSize = this.getScreenSize();
            return screenSize.x > 1000;
        };

        self.initializeVideoPlayers = function() {
            var self = this;
            var videos = this.getVideoPlayers();
            $.each(videos, function(key,video) {
                video.initializePlayer();
                video.initializeControls();
            });
        };

        self.getVideoPlayers = function() {
            var self = this,
                players = [];
            $.each(document.getElementsByClassName('lecture-video'), function(key,elem){
                var video = elem.childNodes[1],
                    controls = {
                        'playBtn': elem.querySelector('#play-pause'),
                        'muteBtn':  elem.querySelector('#mute'),
                        'fullScnBtn':  elem.querySelector('#full-screen'),
                        'seekBar':  elem.querySelector('#seek-bar'),
                        'volumeBar':  elem.querySelector('#volume-bar')
                    };
                players.push({
                    player: video, 
                    controls: controls,
                    initializeControls: initializeControls,
                    initializePlayer: initializePlayer,
                    setVideoSize: setVideoSize,
                    page: self
                });
            });
            return players;
        };

        function initializeControls() {
            this.controls.playBtn.addEventListener('click', togglePlayVideo.bind(this));
            this.controls.muteBtn.addEventListener('click', toggleMuteVideo.bind(this));
            this.controls.seekBar.addEventListener('click', videoSeek.bind(this));
            this.controls.volumeBar.addEventListener('change', setVideoVolume.bind(this));
        }

        function initializePlayer() {
            this.player.preload = 'auto'; // starts video preload.
            if (this.page.isMobile()) {
                // Remove 'type' attr for mobile so that vids will work.
                // http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/
                $.each(this.player.querySelectorAll('source'), function(k,elem) {
                    $(elem).removeAttr('type');
                });
            }
            this.setVideoSize();
            $('.lecture-video').css('opacity', 1);
        }

        function setVideoSize() {
            var playerWidth = $(this.player).width();
            $(this.player).height(playerWidth/1.77);
            $(this.player).parent().height(playerWidth/1.77);
            $(this.player).css('background-size', '100% 100%');
        }

        function togglePlayVideo(e) {
            e.preventDefault();
            var player = this.player;
            if (player.paused == true) {
                player.play();
                this.controls.playBtn.innerHTML = "Pause";
            } else {
                player.pause();
                this.controls.playBtn.innerHTML = "Play";
            }
        };

        function toggleMuteVideo(e) {
            e.preventDefault();
            var player = this.player;
            if (player.muted == false) {
                player.muted = true;
                this.controls.muteBtn.innerHTML = "Unmute";
            } else {
                player.muted = false;
                this.controls.muteBtn.innherHTML = "Mute";
            }
        }

        function videoSeek(e) {
            e.preventDefault();
            var time = this.player.duration * (this.controls.seekBar.value / 100);
            this.player.currentTime = time;
        }

        function setVideoVolume(e) {
            e.preventDefault();
            this.player.volume = this.controls.volumeBar.value;
        }

         // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
              var last = Date.now() - timestamp;

              if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
              } else {
                timeout = null;
                if (!immediate) {
                  result = func.apply(context, args);
                  if (!timeout) context = args = null;
                }
              }
            };

            return function() {
              context = this;
              args = arguments;
              timestamp = Date.now();
              var callNow = immediate && !timeout;
              if (!timeout) timeout = setTimeout(later, wait);
              if (callNow) {
                result = func.apply(context, args);
                context = args = null;
              }

              return result;
            };
        };

        function smoothScroll(el, to, duration) {
            if (duration < 0) {
                return;
            }
            var difference = to - $(window).scrollTop();
            var perTick = difference / duration * 10;
            this.scrollToTimerCache = setTimeout(function() {
                if (!isNaN(parseInt(perTick, 10))) {
                    window.scrollTo(0, $(window).scrollTop() + perTick);
                    smoothScroll(el, to, duration - 10);
                }
            }.bind(this), 10);
        }

        return self;
    };

    window.onload = function() {

        var view = page();
        window.view = view;
        view.initialize();

    };

}());