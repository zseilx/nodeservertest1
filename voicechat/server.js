/* 제목 : webRTC 테스트용 코드들
 * 작성자 : 정영화
 * 작성일 : 2018_05_07
 * 내용 : unity 게임에 음성 채팅을 구현하기 위한 예시 소스코드들로 구성
 *       
 */

"use strict";

var config = require("./config.json");
var http = require("http");
//var socket = require("socket.io");
var ws = require('ws');
var wns = require('./WebsocketNetworkServer');


var httpServer = null;
if (config.httpConfig) {
    httpServer = http.createServer();
    httpServer.listen(
        config.httpConfig.port 
        ,function () { console.log('Listening on ' + httpServer.address().port); }
    );
}

var websocketSignalingServer = new wns.WebsocketNetworkServer()
if (httpServer) {
    //perMessageDeflate: false needs to be set to false turning off the compression. if set to true
    //the websocket library crashes if big messages are received (eg.128mb) no matter which payload is set!!!
    var webSocket = new ws.Server({ server: httpServer, path: config.app.path, maxPayload: config.maxPayload, perMessageDeflate: false });
    websocketSignalingServer.addSocketServer(webSocket, config.app);
}
