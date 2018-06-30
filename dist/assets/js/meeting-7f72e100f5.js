"use strict";

var client = AgoraRTC.createClient({ mode: 'interop' });

client.init(appid, function () {
    console.log("AgoraRTC client initialized");
});

client.join(null, "webtest", undefined, function (uid) {
    console.log("User " + uid + " join channel successfully");
    console.log("Timestamp: " + Date.now());
});

//创建本地流, 修改对应的参数可以指定启用/禁用特定功能
/*
RTC.createStream
@param: options
@param: options.streamId id of stream
@param: options.audio if audio is captured locally
@param: options.video if video is captured locally
@param: options.screen if this stream is for screen share
@param: options. extensionId the extension id of your chrome extension if share screen is enabled
return: created local stream
*/
var options = {
    streamID: uid,
    audio: true,
    video: true,
    screen: false
    //chrome extension id
    //extensionId: "minllpmhdgpndnkomcoccfekfegnlikg"
};
var localStream = AgoraRTC.createStream(options);