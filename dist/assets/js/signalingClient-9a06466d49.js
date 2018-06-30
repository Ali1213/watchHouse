'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description wrapper for Agora Signaling SDK
 * @description transfer some action to Promise and use Event instead of Callback
 */
var SignalingClient = function () {
    function SignalingClient(appId, appcertificate) {
        _classCallCheck(this, SignalingClient);

        this._appId = appId;
        this._appcert = appcertificate;
        // init signal using signal sdk
        this.signal = Signal(appId); // eslint-disable-line 
        // init event emitter for channel/session/call
        this.channelEmitter = new EventEmitter();
        this.sessionEmitter = new EventEmitter();
        this.callEmitter = new EventEmitter();
    }

    /**
     * @description login agora signaling server and init 'session'
     * @description use sessionEmitter to resolve session's callback
     * @param {String} account   
     * @param {*} token default to be omitted
     * @returns {Promise}
     */


    _createClass(SignalingClient, [{
        key: 'login',
        value: function login(account) {
            var _this = this;

            var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_no_need_token';

            this._account = account;
            return new Promise(function (resolve, reject) {
                _this.session = _this.signal.login(account, token);
                // proxy callback on session to sessionEmitter
                ['onLoginSuccess', 'onError', 'onLoginFailed', 'onLogout', 'onMessageInstantReceive', 'onInviteReceived'].map(function (event) {
                    return _this.session[event] = function () {
                        var _sessionEmitter;

                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        (_sessionEmitter = _this.sessionEmitter).emit.apply(_sessionEmitter, [event].concat(args));
                    };
                });
                // Promise.then
                _this.sessionEmitter.on('onLoginSuccess', function (uid) {
                    _this._uid = uid;
                    var session = _this.session;
                    setInterval(function () {
                        session.messageInstantSend('ccc', "hello", function (err, data) {
                            console.log(err, data);
                        });
                    }, 1000);

                    resolve(uid);
                });
                // Promise.catch
                _this.sessionEmitter.on('onLoginFailed', function () {
                    reject.apply(undefined, arguments);
                });
            });
        }

        /**
         * @description logout agora signaling server
         * @returns {Promise}
         */

    }, {
        key: 'logout',
        value: function logout() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.session.logout();
                _this2.sessionEmitter.on('onLogout', function () {
                    resolve.apply(undefined, arguments);
                });
            });
        }

        /**
         * @description join channel
         * @description use channelEmitter to resolve channel's callback
         * @param {String} channel   
         * @returns {Promise}
         */

    }, {
        key: 'join',
        value: function join(channel) {
            var _this3 = this;

            this._channel = channel;
            return new Promise(function (resolve, reject) {
                if (!_this3.session) {
                    throw {
                        Message: '"session" must be initialized before joining channel'
                    };
                }
                _this3.channel = _this3.session.channelJoin(channel);
                // proxy callback on channel to channelEmitter
                ['onChannelJoined', 'onChannelJoinFailed', 'onChannelLeaved', 'onChannelUserJoined', 'onChannelUserLeaved', 'onChannelUserList', 'onChannelAttrUpdated', 'onMessageChannelReceive'].map(function (event) {
                    return _this3.channel[event] = function () {
                        var _channelEmitter;

                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2];
                        }

                        (_channelEmitter = _this3.channelEmitter).emit.apply(_channelEmitter, [event].concat(args));
                    };
                });
                // Promise.then
                _this3.channelEmitter.on('onChannelJoined', function () {
                    resolve.apply(undefined, arguments);
                });
                // Promise.catch
                _this3.channelEmitter.on('onChannelJoinFailed', function () {
                    reject.apply(undefined, arguments);
                });
            });
        }

        /**
         * @description leave channel
         * @returns {Promise}
         */

    }, {
        key: 'leave',
        value: function leave() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                if (_this4.channel) {
                    _this4.channel.channelLeave();
                    _this4.channelEmitter.on('onChannelLeaved', function () {
                        resolve.apply(undefined, arguments);
                    });
                } else {
                    resolve();
                }
            });
        }

        /**
         * @description send p2p message
         * @description if you want to send an object, use JSON.stringify
         * @param {String} peerAccount 
         * @param {String} text 
         */

    }, {
        key: 'sendMessage',
        value: function sendMessage(peerAccount, text) {
            this.session && this.session.messageInstantSend(peerAccount, text);
        }

        /**
         * @description broadcast message in the channel
         * @description if you want to send an object, use JSON.stringify
         * @param {String} text 
         */

    }, {
        key: 'broadcastMessage',
        value: function broadcastMessage(text) {
            this.channel && this.channel.messageChannelSend(text);
        }
    }]);

    return SignalingClient;
}();