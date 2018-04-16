
// 캐릭터 랜덤 위치 생성 및 배치, 재배치 관련 함수 파일
const setPosition = require('./setPosition');

const room_test = 'room1';

function webNpcOut(socket, roomStatus, io) {
	
	socket.on('webNpcOut', function(num) {
		if(roomStatus[room_test]['characterPosition'][Num] === 'NPC') {
			console.log(num + " 번 웹으로 NPC 퇴장");
			roomStatus[room_test]['characterPosition'][Num] = 'empty';
			io.to(room_test).emit('npcOut', num);
		}
		else {
			console.log(num + " 번 이미 퇴장 했음(웹요청)");
		}
	});
	
};

exports.webNpcOut = webNpcOut;


