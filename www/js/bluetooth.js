var bluetoothWrapper = {
    initialize: function() {
      var q = $.Deferred();
      var paramsObj = {request:true};
      bluetoothle.initialize(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, paramsObj);

      return q.promise();
    }, 

    startScan: function(options) {
      var q = $.Deferred();

      var watchId = bluetoothle.startScan(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    },

    stopScan: function() {
      var q = $.Deferred();
      
      bluetoothle.stopScan(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    connect: function(options) {
      var q = $.Deferred();

      var watchId = bluetoothle.connect(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    },

    reconnect: function(options) {
      var q = $.Deferred();

      var watchId = bluetoothle.reconnect(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    },

    disconnect: function(options) {
      var q = $.Deferred();

      var watchId = bluetoothle.disconnect(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    }, 

    close: function(options) {
      var q = $.Deferred();
      
      bluetoothle.close(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise();
    }, 

    discover: function(options) {
      var q = $.Deferred();
      
      bluetoothle.discover(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise();
    },

    discoverIos: function(paramsObj) {
      var q = $.Deferred();
      console.log("Test")
      bluetoothle.services(function(result1) {
        var obj = {"address":result1.address, "serviceUuid": "6e400001-b5a3-f393-e0a9-e50e24dcca9e"}
        console.log(result1)
          bluetoothle.characteristics(function(result2) {
            console.log(result2)
            q.resolve(result2)
          }, function(err) {
            console.log(err)
            q.reject(err);
          }, obj);

          bluetoothWrapper.initialize().then(function(obj){
          },
          function(err){

          })

      }, function(err) {
        console.log(err)
        q.reject(err);
      }, paramsObj);

      return q.promise();
    },

    read: function(options) {
      var q = $.Deferred();

      bluetoothle.read(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise();
    },

    subscribe: function (options) {
      var q = $.Deferred();

      var watchId = bluetoothle.subscribe(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    },

    unsubscribe: function (options) {
      var q = $.Deferred();

      bluetoothle.unsubscribe(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise();
    },

    write: function (options) {
      var q = $.Deferred();

      var watchId = bluetoothle.write(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise()
      }
    },

    isInitialized: function () {
      var q = $.Deferred();

      bluetoothle.isInitialized(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    isEnabled: function () {
      var q = $.Deferred();

      bluetoothle.isEnabled(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    isScanning: function () {
      var q = $.Deferred();

      bluetoothle.isScanning(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    isConnected: function () {
      var q = $.Deferred();

      bluetoothle.isConnected(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    isDiscovered: function () {
      var q = $.Deferred();

      bluetoothle.isDiscovered(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      });

      return q.promise();
    },

    bytesToEncodedString: function(bytes) {
     return btoa(String.fromCharCode.apply(null, bytes));
    },

    convertToBytes: function(string) {
      var bytes = new ArrayBuffer(string.length * 2);
      var bytesUint16 = new Uint16Array(bytes);
      for (var i = 0; i < string.length; i++) {
        bytesUint16[i] = string.charCodeAt(i);
      }
      return new Uint8Array(bytesUint16);
    },

    encodedStringToBytes: function(string) {
      var data = atob(string);
      var bytes = new Uint8Array(data.length);
      for (var i = 0; i < bytes.length; i++)
      {
        bytes[i] = data.charCodeAt(i);
      }
      return bytes;
    },

    stringToBytes: function(string) {
      var bytes = new ArrayBuffer(string.length * 2);
      var bytesUint16 = new Uint16Array(bytes);
      for (var i = 0; i < string.length; i++) {
        bytesUint16[i] = string.charCodeAt(i);
      }
      return new Uint8Array(bytesUint16);
    },

    bytesToString: function(bytes) {
      return String.fromCharCode.apply(null, new Uint16Array(bytes));
    }
}//Return