// 게임 초기 설정 관련된 파일로서, 게임 엔드시 작업 처리 관련해서 불러옴
const initGameStart = require('./game/initGameStart');

// 방 생성 관련 테스트
const room_test = 'room1';

// 유저가 서버에 접속 시 유저 ID에 socket.io를 저장시켜놓음.
// deeps level 1
function joinServer(socket, clientList) {
	socket.on('joinServer', function() {
		clientList.push(socket.id);
	})
}

// 유저의 정상적인 서버 종료 시 ? // 아직 구현 미완료
// deeps level 1
function exitServer(socket, clientList) {
	socket.on("exitServer",function(userId) {
		delete clientList[userId];
	});
}

// 유저의 정상적인 종료 및, 예기치 못한 종료 시 처리
// deeps level 1
function disconnected(socket, clientList, roomStatus) {
	socket.on('disconnect', function() {
        console.log("dixconnect : " + socket.id);
        var i = clientList.indexOf(socket);
        clientList.splice(i, 1);
    });
}


exports.joinServer = joinServer;
exports.exitServer = exitServer;
exports.disconnected = disconnected;