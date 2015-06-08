(function(globals, $) {
    'use strict'

    function Scrollable(settings) {
        var lock = {};
        var self = this;

        lock.filterPath = function(string) {
            return string
                .replace(/^\//, '')
                .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
                .replace(/\/$/, '');
        };

        lock.scrollableElement = function() {
            for (var i = 0, argLength = arguments.length; i < argLength; i++) {
                var el = arguments[i],
                    $scrollElement = $(el);
                if ($scrollElement.scrollTop() > 0) {
                    return el;
                } else {
                    $scrollElement.scrollTop(1);
                    var isScrollable = $scrollElement.scrollTop() > 0;
                    $scrollElement.scrollTop(0);
                    if (isScrollable) {
                        return el;
                    }
                }
            }
            return [];
        };

        lock.eachAndApplyScroll = function(settings) {
            var locationPath = lock.filterPath(location.pathname);
            var scrollElem = lock.scrollableElement('html', 'body');

            $(settings.selector).each(function() {
                var thisPath = lock.filterPath(this.pathname) || locationPath;
                if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {

                    var target = $(this.hash);
                    if (target) {
                        var targetOffset = target.offset().top;
                        $(this).click(function(event) {
                            event.preventDefault();
                            $(scrollElem).animate({
                                scrollTop: targetOffset - 60
                            }, 1000, function() {
                                location.hash = target;
                            });
                        });
                    }
                }
            });
        };

        self.init = function() {
            lock.eachAndApplyScroll(settings);
            return self;
        };
    }

    globals.Scrollable    = Scrollable;
    globals.Scrollable.fn = Scrollable.prototype;
    globals.Scrollable.it = function(settings){
        return new Scrollable(settings).init();
    };

}(window, $));