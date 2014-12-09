var bluetoothle;
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
    var address = "A2FE5FED-FD85-177B-34D0-2CC528113204";
    var service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    var characteristic = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
    bluetooth.initialize(function() {
      console.log("Initialized");
      bluetooth.startScan(null, function() {
        console.log("Done Scanning")
        bluetooth.stopScan(function() {
          console.log("Done stopping")
          bluetooth.connect(address, function() {
            console.log("Done connecting")
            bluetooth.discover(address, function() {
              setTimeout(function(){


              bluetooth.subscribe(address, service, characteristic, function(data){
                bluetooth.unsubscribe(address, service, characteristic, function(){
                  bluetooth.disconnect(address, function(){
                    bluetooth.close(address, function(){
                      console.log("Closed")
                    })
                  })
                })
              })
              setTimeout(function(){
              var data = [131,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              var uint8 = new Uint8Array(data);
              var serviceUuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
              var characteristicUuid = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
              var response = "response";
              var obj = {"address":address, "serviceUuid": service, "characteristicUuid": characteristicUuid, "value":bluetoothWrapper.bytesToEncodedString(uint8), "type": response}
              bluetooth.write(obj, function(){
                console.log("Request Data")
              })
              }, 5000)


              setTimeout(function(){
              var data = [131,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              var time = getBytes(((new Date).getTime() / 1000), 32);
              console.log(time);
              for (var i = time.length - 1; i >= 0; i--) {
                data[i + 4] = time[i];
              };
              var uint8 = new Uint8Array(data);
              var serviceUuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
              var characteristicUuid = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
              var response = "response";
              var obj = {"address":address, "serviceUuid": service, "characteristicUuid": characteristicUuid, "value":bluetoothWrapper.bytesToEncodedString(uint8), "type": response}
              bluetooth.write(obj, function(){
                console.log("Time")
              })
              }, 3000)
              }, 2000)
              })
            })
          })
        })
      })
    }
  };

var getTimes = function(frame) {
  var unixTimeBytes = []
  for (var i = 0; i < 4; i++) {
  unixTimeBytes.push(frame[i]);
  }
  var unixTime = 0;
  //reconstructing the timestamp from the 4 bytes
  //">>> 0"  is needed because JavaScript is stupid and makes it a signed int otherwise, our timestamp won't fit unless it's unsigned int
  unixTime = ((unixTime << 8) >>> 0) + (unixTimeBytes[3] >>> 0);
  unixTime = ((unixTime << 8) >>> 0) + (unixTimeBytes[2] >>> 0);
  unixTime = ((unixTime << 8) >>> 0) + (unixTimeBytes[1] >>> 0);
  unixTime = ((unixTime << 8) >>> 0) + (unixTimeBytes[0] >>> 0);
  var date = new Date(unixTime * 1000);
  return date
}

function getBytes(byte, numberOfBits)
  {

      var bytes = new Array();
      
      bytes[0] = byte & 0xff;

      if(numberOfBits > 8)
      {
          bytes[1] = (byte >> 8) & 0xff;
      }
      
      if(numberOfBits > 16)
      {
          bytes[2] = (byte >> 16) & 0xff;
      }
      
      if(numberOfBits > 24)
      {
          bytes[3] = (byte >> 24) & 0xff;
      }
      console.log(bytes);
      return bytes;
  }

app.initialize();

var bluetooth = {
  /**
  Bluetooth wrapper for randdusings bluetooth library
  for full documentation visit:
  https://github.com/randdusing/BluetoothLE
  **/

  /**
  Initialize function
  Used to initialize the bluetooth connection.
  @ success
  {
  "status": "enabled"
  }
  **/
  initialize: function(callback) {
  bluetoothWrapper.initialize().then(function(obj) {
    if (obj.status === "enabled") {
      console.log("Bluetooth Initialized")
      callback()
    }
    },
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    callback();
    });
  },

  /**
  StartScan function
  Used to start scanning for devices.
  Scan will stop after 5 seconds or after the right device has been found if params != null
  @params 
  {
  "serviceUuids": [
  "180D",
  "180F"
  ]
  }
  @success
  {
  "status": "scanStarted"
  }

  {
  "status": "scanResult",
  "advertisement": "",
  "rssi": "",
  "name": "",
  "address": ""
  }
  **/
  startScan: function(params, callback) {
  var devices = [];
  var scanTimeout = setTimeout(function() {
    callback(devices)
  }, 5000);
  var address = {
    "address": params
  }
  var watch = bluetoothWrapper.startScan(address);
  watch.promise.then(
    function(result) {},
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
    if (obj.status == "scanResult") {
      console.log("Scan success");
      if (params != "" && params != null && params != undefined) {
      clearTimeout(scanTimeout);
      callback();
      } else {
      console.log(JSON.stringify(obj, null, 4))
      devices.push(obj)
      }
    } else if (obj.status == "scanStarted") {
      console.log("Scan started")
    }
    }
  );
  },
  /**
  stopScan function
  Used to stop scanning
  @success
  {
  "status": "scanStopped"
  }
  **/
  stopScan: function(callback) {
  bluetoothWrapper.stopScan().then(function(obj) {
    if (obj.status === "scanStopped") {
      console.log("Bluetooth Initialized")
      callback()
    }
    },
    function(err) {
    console.log(JSON.stringify(err, null, 4));

    }
  )
  },

  /**
  Connect function used to connect to a BLE device
  Supports multiple connected devices. Connection attempts 
  should be cancelled with a disconnect
  @params
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  @success
  {
  "name": "",
  "address": "",
  "status": "connecting"
  }

  {
  "name": "",
  "address": "",
  "status": "connected"
  }

  {
  "name": "",
  "address": "",
  "status": "disconnected"
  }
  **/
  connect: function(params, callback) {
  var address = {
    "address": params
  }
  var watch = bluetoothWrapper.connect(address);
  watch.promise.then(
    function(result) {},
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
    if (obj.status == "connected") {
      console.log("Connect success");
      callback()
    } else if (obj.status == "connecting") {
      console.log("Connecting started")
    } else if (obj.status == "disconnected") {
      console.log("Device is disconnected, disconnect and retry")
      bluetooth.reconnect(obj.address, function() {

      });
    }
    }
  );
  },

  /**
  Reconnect function to connect to previously connected bluetooth device
  @params
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  @success
  {
  "name": "",
  "address": "",
  "status": "connecting"
  }

  {
  "name": "",
  "address": "",
  "status": "connected"
  }

  {
  "name": "",
  "address": "",
  "status": "disconnected"
  }  
  **/
  reconnect: function(params, callback) {
  var address = {
    "address": params
  }
  var watch = bluetoothWrapper.reconnect(address);
  watch.promise.then(
    function(result) {},
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
    if (obj.status == "connected") {
      console.log("Connect success");
      callback()
    } else if (obj.status == "connecting") {
      console.log("Connecting started")
    } else if (obj.status == "disconnected") {
      console.log("Device is disconnected, disconnect and retry")
    }
    }
  );
  },
  /**
  Disconnect function
  @params
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  @success
  {
  "name": "",
  "address": "",
  "status": "disconnecting"
  }

  {
  "name": "",
  "address": "",
  "status": "disconnected"
  }
  **/
  disconnect: function(params, callback) {
  var address = {
    "address": params
  }
  var watch = bluetoothWrapper.disconnect(address);
  watch.promise.then(
    function(result) {},
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
    if (obj.status == "disconnected") {
      console.log("disconnected successfully");
      callback();
    } else if (obj.status == "disconnecting") {
      console.log("Disconnecting started")
    }
    }
  );
  },

  /**
  Close function, must disconnect before closing.
  @params 
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  @success
  {
  "name": "",
  "address": "",
  "status": "closed"
  }
  **/
  close: function(params, callback) {
  var address = {
    "address": params
  }
  bluetoothWrapper.close(address).then(
    function(obj) {
    console.log("Closed");
    callback();
    },
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    callback();
    }
  );
  },

  /**
  Discover function for both IOS and Android
  @params
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  @success
  Assuming one knows the discover info, this will not be shown again.
  **/
  discover: function(params, callback) {
  setTimeout(function() {
    var address = {
    "address": params
    }
    console.log("Trying to discover")
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    console.log("IOS device so we have to discover seperately")
    bluetoothWrapper.discoverIos(address).then(function(obj) {
      console.log("Discovered successfully")
      callback();
      },
      function(err) {
      console.log(JSON.stringify(err, null, 4));
      });
    } else {

    bluetoothWrapper.discover(address).then(function(obj) {
      if (obj.status === "discovered") {
        console.log("Discovered successfully")
        callback()
      }
      },
      function(err) {
      console.log(JSON.stringify(err, null, 4));
      });
    }
  }, 2000);
  },

  /**
  Subscribe function used to subscribe to characteristic
  @params
  @success
  {
  "status": "subscribed",
  "characteristicUuid": "2a37",
  "name": "Polar H7 3B321015",
  "serviceUuid": "180d",
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }

  {
  "status": "subscribedResult",
  "value": "BkY=",
  "characteristicUuid": "2a37",
  "name": "Polar H7 3B321015",
  "serviceUuid": "180d",
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  **/
  subscribe: function(address, service, characteristic, callback) {
  var dataArr = [];
  var servChar = {
    "address": address,
    "serviceUuid": service,
    "characteristicUuid": characteristic
  }
  var watch = bluetoothWrapper.subscribe(servChar);
  watch.promise.then(
    function(result) {},
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
    if (obj.status == "subscribedResult") {
      var byteArr = bluetoothWrapper.encodedStringToBytes(obj.value)
      console.log(byteArr);
      if(byteArr[0] == 5){
        callback(dataArr);
      } else if(byteArr[2]){
        //console.log(byteArr.slice(4, 8));
        //console.log(byteArr.slice(8, 11));
        //console.log(getTimes(byteArr.substring(4, 8)) + "  " + getTimes(byteArr.substring(8, 11)))
        var stopTime = []
        var startTime = []
        for (var i = 4; i < 8; i++) {
          stopTime.push(byteArr[i])
          startTime.push(byteArr[i + 4])
        };
        console.log(getTimes(stopTime));
        console.log(getTimes(startTime));
        dataArr.push(byteArr);
      }
      var data = [130,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      var uint8 = new Uint8Array(data);
      var serviceUuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
      var characteristicUuid = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
      var response = "response";
      var obj = {"address":address, "serviceUuid": service, "characteristicUuid": characteristicUuid, "value":bluetoothWrapper.bytesToEncodedString(uint8), "type": response}
      bluetooth.write(obj, function(){
        console.log("Ack")
      })
    }
    });
  },

  /**
  Unsubscribe particular characteristic
  @params
  {
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63",
  "serviceUuid": "180d",
  "characteristicUuid": "2a37"
  }
  @success
  {
  "status": "unsubscribed",
  "characteristicUuid": "2a37",
  "name": "Polar H7 3B321015",
  "serviceUuid": "180d",
  "address": "ECC037FD-72AE-AFC5-9213-CA785B3B5C63"
  }
  **/
  unsubscribe: function(address, serviceUuid, characteristicUuid, callback) {
  var servChar = {
    "address": address,
    "serviceUuid": serviceUuid,
    "characteristicUuid": characteristicUuid
  }
  bluetoothWrapper.unsubscribe(servChar).then(function(obj) {
    if (obj.status === "unsubscribed") {
      console.log("Unsubscribed successfully")
      callback()
    }
    },
    function(err) {
    console.log(JSON.stringify(err, null, 4));
    callback();
    });
  },

  /**
  Writes to characteristic
  Value should be a 20 bytes array
  @params
  {
  "value":"",
  "serviceUuid":"180F",
  "characteristicUuid":"2A19",
  "type":"noResponse",
  "address":"",
  }
  @success
  {
  "status":"written",
  "serviceUuid":"180F",
  "characteristicUuid":"2A19",
  "value":"",
  "address":""
  }
  **/
  write: function(paramsObj, callback) {
  if (paramsObj.type === "noResponse") {
    //setTimeout(function() {callback()}, 1000);
    var watch = bluetoothWrapper.write(paramsObj)
    watch.promise.then(
    function(result) {},
    function(err) {
      console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
      callback();
    });
  } else {
    var watch = bluetoothWrapper.write(paramsObj)
    watch.promise.then(
    function(result) {},
    function(err) {
      console.log(JSON.stringify(err, null, 4));
    },
    function(obj) {
      callback()
    });
  }
  },
}