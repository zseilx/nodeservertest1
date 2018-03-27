
const room_test = 'room1';

// 2018_02_05 
// unity 클라이언트로부터 해당하는 모션 정보를 받았을 경우
// deeps level 1
function getMovement(socket) {

    socket.on('now', function(jsonStr) {

		// 2018_02_05 
		// 같은 방에 존재하는 유저들에게 본인의 위치 정보를 전송함
		socket.broadcast.to(room_test).emit('result', jsonStr);
	});
};

// 2018_02_22
// 플레이어가 총을 집었다는 정보를 수신 했을 경우
// deeps level 1
function getGun(socket) {
	socket.on('getGun', function(data) {
        console.log('총 집음');
        socket.broadcast.to(room_test).emit('userGetGun', data);
	});
};

// 플레이더가 총을 숨겼을 때
// deeps level 1
function hidingGun(socket) {
	socket.on('hidingGun', function(data) {
        console.log('총 숨김');
        socket.broadcast.to(room_test).emit('userHidingGun', data);
	});
};

// 2018_02_22
// 플레이어가 다시 총을 드랍 했을 경우
// deeps level 1
function getDropGun(socket) {
	socket.on('dropGun', function(jsonStr) {
    
    });
};

// 2018_02_22
// 플레이어가 총을 쐈을 때
// deeps level 1
function getShootGun(socket,io, roomStatus) {
    socket.on('shootGun', function(data) {
        
        //인게임에서 유저 수 구하기 위한 변수
        var userCnt = 0;

        console.log('총 발사');
        //총에 맞은 npc또는 캐릭터 배열 비움
        roomStatus[room_test]['characterPosition'][data] = 'empty'; 
        console.log('배열 확인 : ' ,   roomStatus[room_test]['characterPosition']);

        //방 전체 데이터 전송
        io.to(room_test).emit('whoHit', data);

        //생존 유저수 체크
        for(i = 0 ; i < 8 ; i++){
             if(roomStatus[room_test]['characterPosition'][i] != 'empty' && 
                roomStatus[room_test]['characterPosition'][i] != 'NPC') {
                  userCnt++;
            }
        }
        console.log("생존 유저 수 : " , userCnt);
        

        //유저가 한명 살아남았을 때
        if(userCnt == 1){

            console.log('게임 끝');   
        
            //방 유저수 구함
            var userNum = roomStatus[room_test]['users'].length;

            for(var i=0 ; i < userNum ; i++){
                
                //방 유저 상태를 notReady로 바꿈
                roomStatus[room_test]['users'][i][1] = 'notReady';
            }
            
            //게임상태 변경
            roomStatus[room_test]['gameStatus'] = 'end';
            io.to(room_test).emit('endGame', 'endGame');    
        }
    });
};


// 2018_02_08 // 현재 구현 미완성 추후 문제 발생시 사용 
// 한번에 모아서 보내줄 경우
// 1. 모으는 이벤트
function getMovementAllSave(socket) {
	socket.on('now2', function (jsonStr) {
		// ? += jsonStr;
	});
}
/*
// 모은 것들 보내는 이벤트
socket.broadcast.to(room_test).emit('result', jsonStr);
socket.setInterval(1000/30);
*/


exports.getMovement = getMovement;
exports.getGun = getGun;
exports.hidingGun = hidingGun;
exports.getDropGun = getDropGun;
exports.getShootGun = getShootGun;
