"use strict";

var client = AgoraRTC.createClient({ mode: 'interop' });

client.init(appid, function () {
    console.log("AgoraRTC client initialized");
});