/**
 * 과거에 사용했던 코드들 전부 모아 놓는 곳.
 * 필요 없어졌지만 후에 다시 필요할 수도 있는 코드들 여기에 모아둘 것
 */

// roomController.js
// 2018_02_08
// 방 퇴장 시
// deeps level 1
function exitRoom(socket, roomStatus) {
	//실제 개발 시 유니티에서 room_name 받아와야함
	socket.on('exitRoom', function(userId) {

		var userCnt = roomStatus[room_test]['users'].length;

		for(var i=0 ; i < userCnt ; i++){
			
			if(roomStatus[room_test]['users'][i][0] == userId){
				
//				delete roomList[room_test][i];
				roomStatus[room_test]['users'].splice(i,1);

				var roomUserList = new Array();
				
				for (var j = 0; j < userCnt-1; j++) {
					roomUserList[j] = roomStatus[room_test]['users'][j][0];
				}
				var jsonObj = JSON.stringify(roomUserList);
				socket.broadcast.to(room_test).emit('exitRoomUser', jsonObj);

				socket.emit('exitRoom');
				
				//18.02.20 게임방 퇴장 소켓 삭제 부분 제거
				// socket.leave(room_test);
				
				break;
			}	
		}
		
	});
}



// initGameStart.js
// npc가 퇴장하는 랜덤 시간 배열 return
// deeps level 3
function randomTimeNpcOutArray(npcCnt) {
    var averOutTime = (totalGameTime - sideTime * 2) / npcCnt;

    var outTimeArray = new Array();
    for(var i=0; i<npcCnt; i++) {
       var randomNum = Math.floor(Math.random() * 6); // 0~5의 값을 뽑아내기 위함 맞는지 체크 필요
       outTimeArray[i] = averOutTime - randomNum;
    }
    outTimeArray[npcCnt] = averOutTime;

   return outTimeArray;
};



// initGameStart.js
// npc 랜덤 퇴장 자리 선정
// deeps level 3
// 2018_03_15
function randomPositionNpcArray(npcPosition) {

    var temp = 0;
    var arrayCnt = 0;
    var random = new Array();
    
    for(var i=0; i<npcPosition.length; i++) {
        if(npcPosition[i] == 'NPC') {
            random[arrayCnt] = i;
            arrayCnt++;
        }
    }

	for (var i = 0; i < random.length; i++) {
        var num = Math.floor((Math.random() * random.length - i) + i);

		temp = random[i];
		random[i] = random[num];
        random[num] = temp;
    }

    return random;
}


// npc 랜덤 퇴장 자리 선정
// deeps level 4
// function randomPositionNpc(npcPosition) 내부 로직 변경
// NPC 찾는 부분 위에 indexOf를 사용하는 것으로 변경
for(var i=0; i<npcPosition.length; i++) {
	if(npcPosition[i] == 'NPC') {
		random[arrayCnt] = i;
		arrayCnt++;
	}
}
// 그 배열 가운데서 랜덤으로 하나를 선택.
for (var i = 0; i < random.length; i++) {
	var num = Math.floor((Math.random() * random.length - i) + i);

	temp = random[i];
	random[i] = random[num];
	random[num] = temp;
}