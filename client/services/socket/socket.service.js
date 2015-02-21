'use strict';


angular.module('qodex')
  .factory('Socket', function (socketFactory) {

    var ioSocket = io('', {
      path: '/socket.io'
    });

    var subscribes = [];

    var socket = socketFactory({ ioSocket: ioSocket });

    function idMap (items) {
      return items.map(function (e) { return e._id; });
    }

    return {

      emit: function (str) {
        socket.emit(str);
      },

      on: function (pattern, cb) {
        subscribes.push(pattern);
        socket.on(pattern, cb);
      },

      syncModel: function (model, items) {

        socket.on(model + ':save', function (doc) {
          var index = idMap(items).indexOf(doc._id);
          if (index === -1) {
            items.push(doc);
          } else {
            items.splice(index, 1, doc);
          }
        });

        socket.on(model + ':remove', function (doc) {
          var index = idMap(items).indexOf(doc._id);
          if (index !== -1) {
            items.splice(index, 1);
          }
        });

      },
      unsyncModel: function (model) {
        socket.removeAllListeners(model + ':save');
        socket.removeAllListeners(model + ':remove');
      },

      clean: function () {
        subscribes.forEach(function (sub) {
          socket.removeAllListeners(sub);
          console.log(sub)
        });
        subscribes = [];
      }
    };

  });
