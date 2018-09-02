const express = require('express');
var AgoraSignGenerator = require('./lib/AgoraSignGenerator');

const path = require('path');

const app = express();


app.use(express.static(path.resolve(__dirname, './new')));



// Fill the vendorkey and sign key given by Agora.io
// var VENDOR_KEY = "xxxx";
// var SIGN_KEY = "yyyy";

//var private_key = fs.readFileSync(__dirname + '/../../cert/xxx.com.key');
//var certificate = fs.readFileSync(__dirname + '/../../cert/xxx.com.crt');
//var credentials = {key: private_key, cert: certificate, passphrase: "password"};

app.disable('x-powered-by');

var generateDynamicKey = function(req, resp) {
    var channelName = req.query.channelName;
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }

    var ts = Math.round(new Date().getTime() / 1000);
    var rnd = Math.round(Math.random() * 100000000);
    var key = AgoraSignGenerator.generateDynamicKey('62d5bf0d43874d5b9f2c47abc3b5379a', '58bb3328c19c40968c2da7936fd8bcdd', channelName, ts, rnd);
    console.log(key)
    resp.header("Access-Control-Allow-Origin", "*")
        //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

app.get('/dynamic_key', generateDynamicKey);

app.listen(8082);