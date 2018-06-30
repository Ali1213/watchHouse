"use strict";

var client = AgoraRTC.createClient({ mode: 'interop' });

client.init(appid, function () {
    console.log("AgoraRTC client initialized");
});

client.join(null, "webtest", undefined, function (uid) {
    console.log("User " + uid + " join channel successfully");
    console.log("Timestamp: " + Date.now());
});