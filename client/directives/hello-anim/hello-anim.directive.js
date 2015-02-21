'use strict';

angular.module('qodex')
  .directive('helloAnim', function () {
    return {
      restrict: 'EA',
      link: function (scope, element) {


        var smiley = element.find('i')[0];
        var text = element.find('div')[3];
        var container = element.find('div')[2];

        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var t1 = new TimelineMax({});

        t1
          .from(smiley, 1, {
            x: -x,
            ease: Back.easeOut,
            rotation: -720
          })
          .from(text, 1, {
            opacity: 0
          })
          .to(smiley, 0, {
            x: 0
          })
          .to(container, .5, {
            ease: Back.easeIn,
            scale:.1,
            opacity: 0
          });

      }
    };
  });
