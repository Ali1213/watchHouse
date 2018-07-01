// // var client = AgoraRTC.createClient({mode:'interop'});


// // client.init(appid, function(){
// //     console.log("AgoraRTC client initialized");
// // });


// // client.join(null, "webtest", undefined, function(uid){
// //     console.log("User " + uid + " join channel successfully");
// //     console.log("Timestamp: " + Date.now());
// // });


// // //创建本地流, 修改对应的参数可以指定启用/禁用特定功能
// // /*
// // RTC.createStream
// // @param: options
// // @param: options.streamId id of stream
// // @param: options.audio if audio is captured locally
// // @param: options.video if video is captured locally
// // @param: options.screen if this stream is for screen share
// // @param: options. extensionId the extension id of your chrome extension if share screen is enabled
// // return: created local stream
// // */
// // var options = {
// //     streamID: uid,
// //     audio: true,
// //     video: true,
// //     screen: false,
// //     //chrome extension id
// //     //extensionId: "minllpmhdgpndnkomcoccfekfegnlikg"
// // }
// // var localStream = AgoraRTC.createStream(options);

// window.appId = '9b2179c0cba0431bb9899853ae87d3e7';
// window.channelValue = '110';


// if(!AgoraRTC.checkSystemRequirements()) {
//     alert("browser is no support webRTC");
//   }

//   /* select Log type */
//   // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
//   // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
//   // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
//   // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
//   // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);

//   /* simulated data to proof setLogLevel() */
//   AgoraRTC.Logger.error('this is error');
//   AgoraRTC.Logger.warning('this is warning');
//   AgoraRTC.Logger.info('this is info');
//   AgoraRTC.Logger.debug('this is debug');

//   var client, localStream, camera, microphone;

//   var audioSelect = document.querySelector('select#audioSource');
//   var videoSelect = document.querySelector('select#videoSource');

//   function join() {
//     // document.getElementById("join").disabled = true;
//     // document.getElementById("video").disabled = true;
//     var channel_key = null;

//     console.log("Init AgoraRTC client with vendor key: " + appId);
//     client = AgoraRTC.createClient({mode: 'interop'});
//     client.init(appId, function () {
//       console.log("AgoraRTC client initialized");
//       console.log('========',channelValue)
//       client.join(channel_key, channelValue, null, function(uid) {
//         console.log("User " + uid + " join channel successfully");

//         // if (document.getElementById("video").checked) {
//           camera = videoSource.value;
//           microphone = audioSource.value;
//           localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: document.getElementById("video").checked, screen: false});
//           //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
//         //   if (document.getElementById("video").checked) {
//             localStream.setVideoProfile('720p_3');

//         //   }

//           // The user has granted access to the camera and mic.
//           localStream.on("accessAllowed", function() {
//             console.log("accessAllowed");
//           });

//           // The user has denied access to the camera and mic.
//           localStream.on("accessDenied", function() {
//             console.log("accessDenied");
//           });

//           localStream.init(function() {
//             console.log("getUserMedia successfully");
//             localStream.play('agora_local');

//             client.publish(localStream, function (err) {
//               console.log("Publish local stream error: " + err);
//             });

//             client.on('stream-published', function (evt) {
//               console.log("Publish local stream successfully");
//             });
//           }, function (err) {
//             console.log("getUserMedia failed", err);
//           });
//         // }
//       }, function(err) {
//         console.log("Join channel failed", err);
//       });
//     }, function (err) {
//       console.log("AgoraRTC client init failed", err);
//     });

//     channelKey = "";
//     client.on('error', function(err) {
//       console.log("Got error msg:", err.reason);
//       if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
//         client.renewChannelKey(channelKey, function(){
//           console.log("Renew channel key successfully");
//         }, function(err){
//           console.log("Renew channel key failed: ", err);
//         });
//       }
//     });


//     client.on('stream-added', function (evt) {
//       var stream = evt.stream;
//       console.log("New stream added: " + stream.getId());
//       console.log("Subscribe ", stream);
//       client.subscribe(stream, function (err) {
//         console.log("Subscribe stream failed", err);
//       });
//     });

//     client.on('stream-subscribed', function (evt) {
//       var stream = evt.stream;
//       console.log("Subscribe remote stream successfully: " + stream.getId());
//       if ($('div#video #agora_remote'+stream.getId()).length === 0) {
//         $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
//       }
//       stream.play('agora_remote' + stream.getId());
//     });

//     client.on('stream-removed', function (evt) {
//       var stream = evt.stream;
//       stream.stop();
//       $('#agora_remote' + stream.getId()).remove();
//       console.log("Remote stream is removed " + stream.getId());
//     });

//     client.on('peer-leave', function (evt) {
//       var stream = evt.stream;
//       if (stream) {
//         stream.stop();
//         $('#agora_remote' + stream.getId()).remove();
//         console.log(evt.uid + " leaved from this channel");
//       }
//     });
//   }

//   function leave() {
//     // document.getElementById("leave").disabled = true;
//     client.leave(function () {
//       console.log("Leavel channel successfully");
//     }, function (err) {
//       console.log("Leave channel failed");
//     });
//   }

//   function publish() {
//     // document.getElementById("publish").disabled = true;
//     // document.getElementById("unpublish").disabled = false;
//     client.publish(localStream, function (err) {
//       console.log("Publish local stream error: " + err);
//     });
//   }

//   function unpublish() {
//     document.getElementById("publish").disabled = false;
//     document.getElementById("unpublish").disabled = true;
//     client.unpublish(localStream, function (err) {
//       console.log("Unpublish local stream failed" + err);
//     });
//   }

//   function getDevices() {
//     AgoraRTC.getDevices(function (devices) {
//       for (var i = 0; i !== devices.length; ++i) {
//         var device = devices[i];
//         var option = document.createElement('option');
//         option.value = device.deviceId;
//         if (device.kind === 'audioinput') {
//           option.text = device.label || 'microphone ' + (audioSelect.length + 1);
//           audioSelect.appendChild(option);
//         } else if (device.kind === 'videoinput') {
//           option.text = device.label || 'camera ' + (videoSelect.length + 1);
//           videoSelect.appendChild(option);
//         } else {
//           console.log('Some other kind of source/device: ', device);
//         }
//       }
//       setTimeout(()=>join(),3000)
//     });
//   }

//   //audioSelect.onchange = getDevices;
//   //videoSelect.onchange = getDevices;
//   getDevices();




(function ($) {
    $(() => {
        class Client {
            //construct a meeting client with signal client and rtc client
            constructor(sclient, localAccount) {
                this.cleanData();
                this.signal = sclient;
                this.localAccount = localAccount;
                // this.current_conversation = null;
                this.current_conversation = {
                    type: 'instant',
                    account: '1'
                };
                this.current_msgs = [];
                this.loadFromLocalStorage();
                this.updateChatList();

                this.subscribeEvents();
            }

            invoke(func, args, cb) {
                let session = this.signal.session
                session && session.invoke(func, args, function (err, val) {
                    if (err) {
                        console.error(val.reason);
                    } else {
                        cb && cb(err, val);
                    }
                });
            }
            cleanData() {
                localStorage.setItem("chats", "");
                localStorage.setItem("messages", "");
            }

            updateLocalStorage() {
                localStorage.setItem("chats", JSON.stringify(this.chats));
                localStorage.setItem("messages", JSON.stringify(this.messages));
            }

            loadFromLocalStorage() {
                this.chats = JSON.parse(localStorage.getItem("chats") || "[]");
                this.messages = JSON.parse(localStorage.getItem("messages") || "{}");
            }

            updateChatList() {
                let client = this;
                let chatsContainer = $(".chat-history");
                chatsContainer.html("");
                let html = "";
                for (var i = 0; i < this.chats.length; i++) {
                    html += "<li name=\"" + this.chats[i].id + "\" type=\"" + this.chats[i].type + "\" account=\"" + this.chats[i].account + "\">";
                    html += "<div class=\"title\">" + this.chats[i].account + "</div>";
                    html += "<div class=\"desc\">" + this.chats[i].type + "</div>";
                    html += "</li>";
                }
                chatsContainer.html(html);

                $(".chat-history li").off("click").on("click", function () {
                    let mid = $(this).attr("name");
                    let type = $(this).attr("type");
                    let account = $(this).attr("account");
                    if (type === "channel") {
                        client.signal.leave().then(() => {
                            client.signal.join(account).then(() => {
                                client.showMessage(mid);
                            });
                        });

                    } else {
                        client.showMessage(mid);
                    }
                });

                if (this.chats.length > 0) {
                    let type = this.chats[0].type;
                    let account = this.chats[0].account;
                    let mid = this.chats[0].id;
                    if (type === "channel") {
                        client.signal.leave().then(() => {
                            client.signal.join(account).then(() => {
                                client.showMessage(mid);
                            });
                        });

                    } else {
                        client.showMessage(mid);
                    }
                }
            }

            showMessage(mid) {
                let client = this;
                this.current_msgs = this.messages[mid] || [];
                let conversation = this.chats.filter(function (item) {
                    return (item.id + "") === (mid + "");
                })
                if (conversation.length === 0) {
                    return;
                }
                this.current_conversation = conversation[0];
                this.current_msgs = this.messages[this.current_conversation.id] || [];
                $('#message-to-send').off("keydown").on("keydown", function (e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        client.sendMessage($(this).val());
                        $(this).val("");
                    }
                });

                let chatMsgContainer = $(".chat-messages")
                chatMsgContainer.html("");
                let html = "";
                for (let i = 0; i < this.current_msgs.length; i++) {
                    html += this.buildMsg(this.current_msgs[i].text, this.current_msgs[i].account === this.localAccount, this.current_msgs[i].ts);
                }
                $(".chat-history li").removeClass("selected");
                $(".chat-history li[name=" + mid + "]").addClass("selected");
                chatMsgContainer.html(html);
                chatMsgContainer.scrollTop(chatMsgContainer[0].scrollHeight)

                if (conversation[0].type === 'instant') {
                    let [query, account] = ['io.agora.signal.user_query_user_status', conversation[0].account]
                    let peerStatus
                    client.invoke(query, { account }, function (err, val) {
                        //
                        if (val.status) {
                            peerStatus = 'Online'
                        }
                        else {
                            peerStatus = 'Offline'
                        }
                        $(".detail .nav").html(conversation[0].account + `(${peerStatus})`);
                    });
                }
                else {
                    client.invoke('io.agora.signal.channel_query_num', { 'name': conversation[0].account }, (err, val) => {
                        $(".detail .nav").html(`${conversation[0].account}(${val.num})`);
                    })
                }

            }

            sendMessage(text, reciveAcount = '1111') {
                if (!text.trim()) return false // empty
                if (!this.current_msgs) {
                    return;
                }
                let msg_item = { ts: new Date(), text: text, account: this.localAccount };


                console.log(msg_item)

                this.current_msgs.push(msg_item);
                // if (this.current_conversation.type === "instant") {
                this.signal.sendMessage(reciveAcount, text);
                // } else {
                //     this.signal.broadcastMessage(text);
                // }
                // let chatMsgContainer = $(".chat-messages")
                // chatMsgContainer.append(this.buildMsg(text, true, msg_item.ts));
                // chatMsgContainer.scrollTop(chatMsgContainer[0].scrollHeight)
                // this.updateMessageMap();
                // this.showMessage(this.current_conversation.id)

            }

            updateMessageMap(c, m) {
                let conversation = c || this.current_conversation;
                let msgs = m || this.current_msgs;
                this.messages[conversation.id] = msgs;
                this.chats.filter((item) => {
                    if (item.id === conversation.id && item.type === conversation.type) {
                        item.lastMoment = new Date()
                    }
                })
                this.updateLocalStorage();
            }

            //return a promise resolves a remote account name
            addConversation() {
                let deferred = $.Deferred();
                let dialog = $(".conversation-modal");
                let accountField = dialog.find(".remoteAccountField");
                let localAccount = this.localAccount;
                let client = this;

                dialog.find(".confirmBtn").off("click").on("click", (e) => {
                    //dialog confirm
                    let account = $(".conversation-target-field").val();
                    let type = $(':radio[name="type"]').filter(':checked').val();

                    // validation
                    let isValid = () => {
                        if (!account) return false // empty
                        if (!/^[^\s]*$/.test(account)) {
                            // has space character
                            return false
                        }
                        return true
                    }

                    let isExisted = () => {
                        return client.chats.some(function (item) {
                            return item.account === account && item.type === type;
                        });
                    }
                    let isSelf = () => {
                        return type === 'instant' && account === localAccount
                    }

                    if (!isValid()) {
                        $(".conversation-target-field").siblings(".invalid-feedback").html("Please input a valid name.")
                        $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                    } else if (isSelf()) {
                        $(".conversation-target-field").siblings(".invalid-feedback").html("You cannot chat with yourself.")
                        $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                    } else if (isExisted()) {
                        $(".conversation-target-field").siblings(".invalid-feedback").html("Existed.")
                        $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                    } else {
                        $(".conversation-target-field").removeClass("is-invalid")
                        dialog.find(".conversation-target-field").val('')
                        dialog.modal('hide');
                        client.chats.splice(0, 0, { id: new Date().getTime(), account: account, type: type });
                        client.updateLocalStorage();
                        client.updateChatList();
                        deferred.resolve(account);
                    }
                });

                dialog.find(".cancelBtn").off("click").on("click", (e) => {
                    //dialog confirm
                    dialog.modal('hide');
                    deferred.reject();
                });

                dialog.find(".conversation-target-field").off("keydown").on("keydown", function (e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        dialog.find(".confirmBtn").click()
                    }
                });

                //start modal
                dialog.modal({ backdrop: "static", focus: true });

                return deferred;
            }

            //events
            subscribeEvents() {
                let signal = this.signal;
                let client = this;

                $(".new-conversation-btn").off("click").on("click", function () {
                    client.addConversation();
                });

                $(".logout-btn").off("click").on("click", function () {
                    signal.logout().then(() => {
                        window.location.href = 'index.html'
                    })
                });

                $(':radio[name="type"]').change(function () {
                    var type = $(this).filter(':checked').val();
                    var field = $(".conversation-target-field");
                    switch (type) {
                        case "instant":
                            field.attr("placeholder", "Input someone's account");
                            break;
                        case "channel":
                            field.attr("placeholder", "Input a channel name");
                            break;
                    }
                });

                signal.sessionEmitter.on('onMessageInstantReceive', (account, uid, msg) => {
                    this.onReceiveMessage(account, msg, 'instant')
                })
                signal.channelEmitter.on('onMessageChannelReceive', (account, uid, msg) => {
                    if (account !== signal._account) {
                        this.onReceiveMessage(signal.channel.name, msg, 'channel')
                    }
                })

                signal.channelEmitter.on('onChannelUserLeaved', (account, uid) => {
                    client.invoke('io.agora.signal.channel_query_num', { 'name': signal.channel.name }, (err, val) => {
                        $(".detail .nav").html(`${signal.channel.name}(${val.num})`);
                    })
                })

                signal.channelEmitter.on('onChannelUserJoined', (account, uid) => {
                    client.invoke('io.agora.signal.channel_query_num', { 'name': signal.channel.name }, (err, val) => {
                        $(".detail .nav").html(`${signal.channel.name}(${val.num})`);
                    })
                })
            }

            onReceiveMessage(account, msg, type) {
                let client = this;

                console.log(account, msg, type)


                // var conversations = this.chats.filter(function (item) {
                //     return item.account === account;
                // });

                // if (conversations.length === 0) {
                //     //no conversation yet, create one
                //     conversations = [{ id: new Date().getTime(), account: account, type: type }];
                //     client.chats.splice(0, 0, conversations[0]);
                //     client.updateLocalStorage();
                //     client.updateChatList();
                // }

                // for (let i = 0; i < conversations.length; i++) {
                //     let conversation = conversations[i];

                //     let msgs = this.messages[conversation.id] || [];
                //     let msg_item = { ts: new Date(), text: msg, account: account };
                //     msgs.push(msg_item);
                //     this.updateMessageMap(conversation, msgs);
                //     let chatMsgContainer = $(".chat-messages")
                //     if (conversation.id+"" === this.current_conversation.id+"") {
                //         chatMsgContainer.append(client.buildMsg(msg, false, msg_item.ts));
                //         // this.showMessage(this.current_conversation.id)
                //         chatMsgContainer.scrollTop(chatMsgContainer[0].scrollHeight)

                //     }
                // }
            }

            buildMsg(msg, me, ts) {
                let html = "";
                let timeStr = this.compareByLastMoment(ts)
                if (timeStr) {
                    html += `<div>${timeStr}</div>`
                }
                let className = me ? "message right clearfix" : "message clearfix";
                html += "<li class=\"" + className + "\">";
                html += "<img src=\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg\">";
                html += "<div class=\"bubble\">" + Utils.safe_tags_replace(msg) + "<div class=\"corner\"></div>";
                html += "<span>" + this.parseTwitterDate(ts) + "</span></div></li>";

                return html;
            }

            compareByLastMoment(ts) {
                let lastMoment = null
                this.chats.forEach(item => {
                    if (item.id === this.current_conversation.id && item.type === this.current_conversation.type) {
                        lastMoment = item.lastMoment
                    }
                })
                if (!lastMoment) {
                    let time = new Date()
                    return time.toDateString() + ' ' + time.toLocaleTimeString()
                }
                let diff = Math.floor((ts - lastMoment) / 1000)
                if (diff < 120) {
                    return ''
                }
                else {
                    return new Date().toLocaleTimeString()
                }
            }

            parseTwitterDate(tdate) {
                var system_date = new Date(Date.parse(tdate));
                var user_date = new Date();
                // if (K.ie) {
                //     system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
                // }
                var diff = Math.floor((user_date - system_date) / 1000);
                if (diff <= 1) { return "just now"; }
                if (diff < 20) { return diff + " seconds ago"; }
                if (diff < 40) { return "half a minute ago"; }
                if (diff < 60) { return "less than a minute ago"; }
                if (diff <= 90) { return "one minute ago"; }
                if (diff <= 3540) { return Math.round(diff / 60) + " minutes ago"; }
                if (diff <= 5400) { return "1 hour ago"; }
                if (diff <= 86400) { return Math.round(diff / 3600) + " hours ago"; }
                if (diff <= 129600) { return "1 day ago"; }
                if (diff < 604800) { return Math.round(diff / 86400) + " days ago"; }
                if (diff <= 777600) { return "1 week ago"; }
                return "on " + system_date;
            }
        }

        const appid = AGORA_APP_ID || '', appcert = AGORA_CERTIFICATE_ID || '';
        if (!appid) {
            alert('App ID missing!')
        }
        console.log('=========', appid)
        console.log('=========', AGORA_CERTIFICATE_ID)
        let localAccount = Browser.getParameterByName("account");
        console.log('===========localAccount', localAccount)
        let signal = new SignalingClient(appid, appcert);
        // let channelName = Math.random() * 10000 + "";
        //by default call btn is disabled
        var a = true;
        signal.login(localAccount, '_no_need_token').then(() => {
            //once logged in, enable the call btn
            let client = new Client(signal, localAccount);
            // $('#localAccount').html(localAccount)
            // if (a) {
            //     a = false;
            //     setInterval(() => client.sendMessage('正阳你好帅'), 2000)

            // }

            const clearArrAndFill = (arr, content) => {
                arr.length = 0;
                arr.push(...content)
            }

            const msg = ['w','s','a','d'];
            const run = ['w','s','a','d'];
            const camera = ['i','k','j','l'];

            $('#control .now').on('click', () => {
                let val = $('#control .now').text()
                switch (val){
                    case '车':
                    $('#control .now').text('摄')
                    clearArrAndFill(msg,camera)
                    break;
                    case '摄':
                    $('#control .now').text('车')
                    clearArrAndFill(msg,run)
                    break;
                }
                client.sendMessage('z', reciveAcount)
            })

            $('#control .up').on('click', () => {
                const reciveAcount = $('#Account').val()
                client.sendMessage(msg[0], reciveAcount)
            })
            $('#control .down').on('click', () => {
                const reciveAcount = $('#Account').val()
                client.sendMessage(msg[1], reciveAcount)
            })
            $('#control .left').on('click', () => {
                const reciveAcount = $('#Account').val()
                client.sendMessage(msg[2], reciveAcount)
            })
            $('#control .right').on('click', () => {
                const reciveAcount = $('#Account').val()
                client.sendMessage(msg[3], reciveAcount)
            })
        });
    });
}(jQuery));

