'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    $(function () {
        var Client = function () {
            //construct a meeting client with signal client and rtc client
            function Client(sclient, localAccount) {
                _classCallCheck(this, Client);

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

            _createClass(Client, [{
                key: 'invoke',
                value: function invoke(func, args, cb) {
                    var session = this.signal.session;
                    session && session.invoke(func, args, function (err, val) {
                        if (err) {
                            console.error(val.reason);
                        } else {
                            cb && cb(err, val);
                        }
                    });
                }
            }, {
                key: 'cleanData',
                value: function cleanData() {
                    localStorage.setItem("chats", "");
                    localStorage.setItem("messages", "");
                }
            }, {
                key: 'updateLocalStorage',
                value: function updateLocalStorage() {
                    localStorage.setItem("chats", JSON.stringify(this.chats));
                    localStorage.setItem("messages", JSON.stringify(this.messages));
                }
            }, {
                key: 'loadFromLocalStorage',
                value: function loadFromLocalStorage() {
                    this.chats = JSON.parse(localStorage.getItem("chats") || "[]");
                    this.messages = JSON.parse(localStorage.getItem("messages") || "{}");
                }
            }, {
                key: 'updateChatList',
                value: function updateChatList() {
                    var client = this;
                    var chatsContainer = $(".chat-history");
                    chatsContainer.html("");
                    var html = "";
                    for (var i = 0; i < this.chats.length; i++) {
                        html += "<li name=\"" + this.chats[i].id + "\" type=\"" + this.chats[i].type + "\" account=\"" + this.chats[i].account + "\">";
                        html += "<div class=\"title\">" + this.chats[i].account + "</div>";
                        html += "<div class=\"desc\">" + this.chats[i].type + "</div>";
                        html += "</li>";
                    }
                    chatsContainer.html(html);

                    $(".chat-history li").off("click").on("click", function () {
                        var mid = $(this).attr("name");
                        var type = $(this).attr("type");
                        var account = $(this).attr("account");
                        if (type === "channel") {
                            client.signal.leave().then(function () {
                                client.signal.join(account).then(function () {
                                    client.showMessage(mid);
                                });
                            });
                        } else {
                            client.showMessage(mid);
                        }
                    });

                    if (this.chats.length > 0) {
                        var type = this.chats[0].type;
                        var account = this.chats[0].account;
                        var mid = this.chats[0].id;
                        if (type === "channel") {
                            client.signal.leave().then(function () {
                                client.signal.join(account).then(function () {
                                    client.showMessage(mid);
                                });
                            });
                        } else {
                            client.showMessage(mid);
                        }
                    }
                }
            }, {
                key: 'showMessage',
                value: function showMessage(mid) {
                    var client = this;
                    this.current_msgs = this.messages[mid] || [];
                    var conversation = this.chats.filter(function (item) {
                        return item.id + "" === mid + "";
                    });
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

                    var chatMsgContainer = $(".chat-messages");
                    chatMsgContainer.html("");
                    var html = "";
                    for (var i = 0; i < this.current_msgs.length; i++) {
                        html += this.buildMsg(this.current_msgs[i].text, this.current_msgs[i].account === this.localAccount, this.current_msgs[i].ts);
                    }
                    $(".chat-history li").removeClass("selected");
                    $(".chat-history li[name=" + mid + "]").addClass("selected");
                    chatMsgContainer.html(html);
                    chatMsgContainer.scrollTop(chatMsgContainer[0].scrollHeight);

                    if (conversation[0].type === 'instant') {
                        var _ref = ['io.agora.signal.user_query_user_status', conversation[0].account],
                            query = _ref[0],
                            account = _ref[1];

                        var peerStatus = void 0;
                        client.invoke(query, { account: account }, function (err, val) {
                            //
                            if (val.status) {
                                peerStatus = 'Online';
                            } else {
                                peerStatus = 'Offline';
                            }
                            $(".detail .nav").html(conversation[0].account + ('(' + peerStatus + ')'));
                        });
                    } else {
                        client.invoke('io.agora.signal.channel_query_num', { 'name': conversation[0].account }, function (err, val) {
                            $(".detail .nav").html(conversation[0].account + '(' + val.num + ')');
                        });
                    }
                }
            }, {
                key: 'sendMessage',
                value: function sendMessage(text) {
                    var reciveAcount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1111';

                    if (!text.trim()) return false; // empty
                    if (!this.current_msgs) {
                        return;
                    }
                    var msg_item = { ts: new Date(), text: text, account: this.localAccount };

                    console.log(msg_item);

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
            }, {
                key: 'updateMessageMap',
                value: function updateMessageMap(c, m) {
                    var conversation = c || this.current_conversation;
                    var msgs = m || this.current_msgs;
                    this.messages[conversation.id] = msgs;
                    this.chats.filter(function (item) {
                        if (item.id === conversation.id && item.type === conversation.type) {
                            item.lastMoment = new Date();
                        }
                    });
                    this.updateLocalStorage();
                }

                //return a promise resolves a remote account name

            }, {
                key: 'addConversation',
                value: function addConversation() {
                    var deferred = $.Deferred();
                    var dialog = $(".conversation-modal");
                    var accountField = dialog.find(".remoteAccountField");
                    var localAccount = this.localAccount;
                    var client = this;

                    dialog.find(".confirmBtn").off("click").on("click", function (e) {
                        //dialog confirm
                        var account = $(".conversation-target-field").val();
                        var type = $(':radio[name="type"]').filter(':checked').val();

                        // validation
                        var isValid = function isValid() {
                            if (!account) return false; // empty
                            if (!/^[^\s]*$/.test(account)) {
                                // has space character
                                return false;
                            }
                            return true;
                        };

                        var isExisted = function isExisted() {
                            return client.chats.some(function (item) {
                                return item.account === account && item.type === type;
                            });
                        };
                        var isSelf = function isSelf() {
                            return type === 'instant' && account === localAccount;
                        };

                        if (!isValid()) {
                            $(".conversation-target-field").siblings(".invalid-feedback").html("Please input a valid name.");
                            $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                        } else if (isSelf()) {
                            $(".conversation-target-field").siblings(".invalid-feedback").html("You cannot chat with yourself.");
                            $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                        } else if (isExisted()) {
                            $(".conversation-target-field").siblings(".invalid-feedback").html("Existed.");
                            $(".conversation-target-field").removeClass("is-invalid").addClass("is-invalid");
                        } else {
                            $(".conversation-target-field").removeClass("is-invalid");
                            dialog.find(".conversation-target-field").val('');
                            dialog.modal('hide');
                            client.chats.splice(0, 0, { id: new Date().getTime(), account: account, type: type });
                            client.updateLocalStorage();
                            client.updateChatList();
                            deferred.resolve(account);
                        }
                    });

                    dialog.find(".cancelBtn").off("click").on("click", function (e) {
                        //dialog confirm
                        dialog.modal('hide');
                        deferred.reject();
                    });

                    dialog.find(".conversation-target-field").off("keydown").on("keydown", function (e) {
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            dialog.find(".confirmBtn").click();
                        }
                    });

                    //start modal
                    dialog.modal({ backdrop: "static", focus: true });

                    return deferred;
                }

                //events

            }, {
                key: 'subscribeEvents',
                value: function subscribeEvents() {
                    var _this = this;

                    var signal = this.signal;
                    var client = this;

                    $(".new-conversation-btn").off("click").on("click", function () {
                        client.addConversation();
                    });

                    $(".logout-btn").off("click").on("click", function () {
                        signal.logout().then(function () {
                            window.location.href = 'index.html';
                        });
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

                    signal.sessionEmitter.on('onMessageInstantReceive', function (account, uid, msg) {
                        _this.onReceiveMessage(account, msg, 'instant');
                    });
                    signal.channelEmitter.on('onMessageChannelReceive', function (account, uid, msg) {
                        if (account !== signal._account) {
                            _this.onReceiveMessage(signal.channel.name, msg, 'channel');
                        }
                    });

                    signal.channelEmitter.on('onChannelUserLeaved', function (account, uid) {
                        client.invoke('io.agora.signal.channel_query_num', { 'name': signal.channel.name }, function (err, val) {
                            $(".detail .nav").html(signal.channel.name + '(' + val.num + ')');
                        });
                    });

                    signal.channelEmitter.on('onChannelUserJoined', function (account, uid) {
                        client.invoke('io.agora.signal.channel_query_num', { 'name': signal.channel.name }, function (err, val) {
                            $(".detail .nav").html(signal.channel.name + '(' + val.num + ')');
                        });
                    });
                }
            }, {
                key: 'onReceiveMessage',
                value: function onReceiveMessage(account, msg, type) {
                    var client = this;

                    console.log(account, msg, type);

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
            }, {
                key: 'buildMsg',
                value: function buildMsg(msg, me, ts) {
                    var html = "";
                    var timeStr = this.compareByLastMoment(ts);
                    if (timeStr) {
                        html += '<div>' + timeStr + '</div>';
                    }
                    var className = me ? "message right clearfix" : "message clearfix";
                    html += "<li class=\"" + className + "\">";
                    html += "<img src=\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1_copy.jpg\">";
                    html += "<div class=\"bubble\">" + Utils.safe_tags_replace(msg) + "<div class=\"corner\"></div>";
                    html += "<span>" + this.parseTwitterDate(ts) + "</span></div></li>";

                    return html;
                }
            }, {
                key: 'compareByLastMoment',
                value: function compareByLastMoment(ts) {
                    var _this2 = this;

                    var lastMoment = null;
                    this.chats.forEach(function (item) {
                        if (item.id === _this2.current_conversation.id && item.type === _this2.current_conversation.type) {
                            lastMoment = item.lastMoment;
                        }
                    });
                    if (!lastMoment) {
                        var time = new Date();
                        return time.toDateString() + ' ' + time.toLocaleTimeString();
                    }
                    var diff = Math.floor((ts - lastMoment) / 1000);
                    if (diff < 120) {
                        return '';
                    } else {
                        return new Date().toLocaleTimeString();
                    }
                }
            }, {
                key: 'parseTwitterDate',
                value: function parseTwitterDate(tdate) {
                    var system_date = new Date(Date.parse(tdate));
                    var user_date = new Date();
                    // if (K.ie) {
                    //     system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
                    // }
                    var diff = Math.floor((user_date - system_date) / 1000);
                    if (diff <= 1) {
                        return "just now";
                    }
                    if (diff < 20) {
                        return diff + " seconds ago";
                    }
                    if (diff < 40) {
                        return "half a minute ago";
                    }
                    if (diff < 60) {
                        return "less than a minute ago";
                    }
                    if (diff <= 90) {
                        return "one minute ago";
                    }
                    if (diff <= 3540) {
                        return Math.round(diff / 60) + " minutes ago";
                    }
                    if (diff <= 5400) {
                        return "1 hour ago";
                    }
                    if (diff <= 86400) {
                        return Math.round(diff / 3600) + " hours ago";
                    }
                    if (diff <= 129600) {
                        return "1 day ago";
                    }
                    if (diff < 604800) {
                        return Math.round(diff / 86400) + " days ago";
                    }
                    if (diff <= 777600) {
                        return "1 week ago";
                    }
                    return "on " + system_date;
                }
            }]);

            return Client;
        }();

        var appid = AGORA_APP_ID || '',
            appcert = AGORA_CERTIFICATE_ID || '';
        if (!appid) {
            alert('App ID missing!');
        }
        console.log('=========', appid);
        console.log('=========', AGORA_CERTIFICATE_ID);
        var localAccount = Browser.getParameterByName("account");
        console.log('===========localAccount', localAccount);
        var signal = new SignalingClient(appid, appcert);
        // let channelName = Math.random() * 10000 + "";
        //by default call btn is disabled
        var a = true;
        signal.login(localAccount, '_no_need_token').then(function () {
            //once logged in, enable the call btn
            var client = new Client(signal, localAccount);
            // $('#localAccount').html(localAccount)
            // if (a) {
            //     a = false;
            //     setInterval(() => client.sendMessage('正阳你好帅'), 2000)

            // }

            var clearArrAndFill = function clearArrAndFill(arr, content) {
                arr.length = 0;
                arr.push.apply(arr, _toConsumableArray(content));
            };

            var msg = ['w', 's', 'a', 'd'];
            var run = ['w', 's', 'a', 'd'];
            var camera = ['i', 'k', 'j', 'l'];

            $('#control .now').on('click', function () {
                var val = $('#control .now').text();
                switch (val) {
                    case '车':
                        $('#control .now').text('摄');
                        clearArrAndFill(msg, camera);
                        break;
                    case '摄':
                        $('#control .now').text('车');
                        clearArrAndFill(msg, run);
                        break;
                }
                client.sendMessage('z', reciveAcount);
            });

            $('#control .up').on('click', function () {
                var reciveAcount = $('#Account').val();
                client.sendMessage(msg[0], reciveAcount);
            });
            $('#control .down').on('click', function () {
                var reciveAcount = $('#Account').val();
                client.sendMessage(msg[1], reciveAcount);
            });
            $('#control .left').on('click', function () {
                var reciveAcount = $('#Account').val();
                client.sendMessage(msg[2], reciveAcount);
            });
            $('#control .right').on('click', function () {
                var reciveAcount = $('#Account').val();
                client.sendMessage(msg[3], reciveAcount);
            });
        });
    });
})(jQuery);