
// 캐릭터 랜덤 위치 생성 및 배치, 재배치 관련 함수 파일
const setPosition = require('./setPosition');

const room_test = 'room1';

function webNpcOut(socket, io) {
    socket.on('webNpcOut', function(num) {
		console.log(num + " 번 웹으로 NPC 퇴장");
		io.to(room_test).emit('npcOut', num);
	});
};

exports.webNpcOut = webNpcOut;


