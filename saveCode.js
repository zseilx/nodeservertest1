/**
 * 과거에 사용했던 코드들 전부 모아 놓는 곳.
 * 필요 없어졌지만 후에 다시 필요할 수도 있는 코드들 여기에 모아둘 것
 */


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
