'use strict';

// var client = AgoraRTC.createClient({mode:'interop'});


// client.init(appid, function(){
//     console.log("AgoraRTC client initialized");
// });


// client.join(null, "webtest", undefined, function(uid){
//     console.log("User " + uid + " join channel successfully");
//     console.log("Timestamp: " + Date.now());
// });


// //创建本地流, 修改对应的参数可以指定启用/禁用特定功能
// /*
// RTC.createStream
// @param: options
// @param: options.streamId id of stream
// @param: options.audio if audio is captured locally
// @param: options.video if video is captured locally
// @param: options.screen if this stream is for screen share
// @param: options. extensionId the extension id of your chrome extension if share screen is enabled
// return: created local stream
// */
// var options = {
//     streamID: uid,
//     audio: true,
//     video: true,
//     screen: false,
//     //chrome extension id
//     //extensionId: "minllpmhdgpndnkomcoccfekfegnlikg"
// }
// var localStream = AgoraRTC.createStream(options);

window.appId = '9b2179c0cba0431bb9899853ae87d3e7';
window.channelValue = '110';

if (!AgoraRTC.checkSystemRequirements()) {
  alert("browser is no support webRTC");
}

/* select Log type */
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);

/* simulated data to proof setLogLevel() */
AgoraRTC.Logger.error('this is error');
AgoraRTC.Logger.warning('this is warning');
AgoraRTC.Logger.info('this is info');
AgoraRTC.Logger.debug('this is debug');

var client, localStream, camera, microphone;

var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

function join() {
  document.getElementById("join").disabled = true;
  document.getElementById("video").disabled = true;
  var channel_key = null;

  console.log("Init AgoraRTC client with vendor key: " + key.value);
  client = AgoraRTC.createClient({ mode: 'interop' });
  client.init(key.value, function () {
    console.log("AgoraRTC client initialized");
    client.join(channel_key, channel.value, null, function (uid) {
      console.log("User " + uid + " join channel successfully");

      if (document.getElementById("video").checked) {
        camera = videoSource.value;
        microphone = audioSource.value;
        localStream = AgoraRTC.createStream({ streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: document.getElementById("video").checked, screen: false });
        //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
        if (document.getElementById("video").checked) {
          localStream.setVideoProfile('720p_3');
        }

        // The user has granted access to the camera and mic.
        localStream.on("accessAllowed", function () {
          console.log("accessAllowed");
        });

        // The user has denied access to the camera and mic.
        localStream.on("accessDenied", function () {
          console.log("accessDenied");
        });

        localStream.init(function () {
          console.log("getUserMedia successfully");
          localStream.play('agora_local');

          client.publish(localStream, function (err) {
            console.log("Publish local stream error: " + err);
          });

          client.on('stream-published', function (evt) {
            console.log("Publish local stream successfully");
          });
        }, function (err) {
          console.log("getUserMedia failed", err);
        });
      }
    }, function (err) {
      console.log("Join channel failed", err);
    });
  }, function (err) {
    console.log("AgoraRTC client init failed", err);
  });

  channelKey = "";
  client.on('error', function (err) {
    console.log("Got error msg:", err.reason);
    if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
      client.renewChannelKey(channelKey, function () {
        console.log("Renew channel key successfully");
      }, function (err) {
        console.log("Renew channel key failed: ", err);
      });
    }
  });

  client.on('stream-added', function (evt) {
    var stream = evt.stream;
    console.log("New stream added: " + stream.getId());
    console.log("Subscribe ", stream);
    client.subscribe(stream, function (err) {
      console.log("Subscribe stream failed", err);
    });
  });

  client.on('stream-subscribed', function (evt) {
    var stream = evt.stream;
    console.log("Subscribe remote stream successfully: " + stream.getId());
    if ($('div#video #agora_remote' + stream.getId()).length === 0) {
      $('div#video').append('<div id="agora_remote' + stream.getId() + '" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
    }
    stream.play('agora_remote' + stream.getId());
  });

  client.on('stream-removed', function (evt) {
    var stream = evt.stream;
    stream.stop();
    $('#agora_remote' + stream.getId()).remove();
    console.log("Remote stream is removed " + stream.getId());
  });

  client.on('peer-leave', function (evt) {
    var stream = evt.stream;
    if (stream) {
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      console.log(evt.uid + " leaved from this channel");
    }
  });
}

function leave() {
  document.getElementById("leave").disabled = true;
  client.leave(function () {
    console.log("Leavel channel successfully");
  }, function (err) {
    console.log("Leave channel failed");
  });
}

function publish() {
  document.getElementById("publish").disabled = true;
  document.getElementById("unpublish").disabled = false;
  client.publish(localStream, function (err) {
    console.log("Publish local stream error: " + err);
  });
}

function unpublish() {
  document.getElementById("publish").disabled = false;
  document.getElementById("unpublish").disabled = true;
  client.unpublish(localStream, function (err) {
    console.log("Unpublish local stream failed" + err);
  });
}

function getDevices() {
  AgoraRTC.getDevices(function (devices) {
    for (var i = 0; i !== devices.length; ++i) {
      var device = devices[i];
      var option = document.createElement('option');
      option.value = device.deviceId;
      if (device.kind === 'audioinput') {
        option.text = device.label || 'microphone ' + (audioSelect.length + 1);
        audioSelect.appendChild(option);
      } else if (device.kind === 'videoinput') {
        option.text = device.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', device);
      }
    }
    setTimeout(function () {
      return join();
    }, 3000);
  });
}

//audioSelect.onchange = getDevices;
//videoSelect.onchange = getDevices;
getDevices();