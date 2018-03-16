

// 방 생성 관련 테스트
const room_test = 'room1';


// 2018_02_08
// 유저가 방 생성 시
function createRoom(socket, roomList) {
	socket.on('createRoom', function(roomName, userId) {
		socket.join(roomName);
		
		// 2018-02_12
		// room 배열에 유저의 아이디를 집어넣는 부분이 필요
		roomList[roomName] = new Array();
		roomList[roomName][0] = new Array();

		roomList[roomName][0][0] = userId;
		roomList[roomName][0][1] = 'notReady';
	});
}

// 2018_02_05 
// 유저별 room 젒속
// 추후에 처리해야함. 현재는 테스트 상 임시로 room1 로 통일
function joinRoom(socket, roomList) {
//	socket.on('joinRoom', function(roomName, userId) {
	socket.on('joinRoom', function(userId) {
		
		socket.join(room_test);
		
		// 2018_02_12
		// room 배열에 유저의 아이디를 집어 넣는 부분
		/*
		var userCnt = roomList[roomName].length;

		roomList[roomName][userCnt] = new Array();
	
		roomList[roomname][userCnt][0].push(userId);
		roomList[roomname][userCnt][1].push('notReady');
		*/

		// 테스트용 코드
		// 방에 입장 시 새로운 방 생성  및 유저의 정보를 방 정보에 삽입
		if(roomList[room_test] == null) 
			roomList[room_test] = new Array(); // 이 코드는 현재 테스트 용으로 실제 createRoom이 동작시 필요 없어짐.

		var userCnt = roomList[room_test].length;
		// console.log('joinRoom : userCnt = ' + userCnt);
		
		// 입장한 유저의 번호를 할당, 및 유저 정보 삽입
		roomList[room_test][userCnt] = new Array();

		roomList[room_test][userCnt][0] = userId;
		roomList[room_test][userCnt][1] = 'notReady';

		// 방에 입장 시 방 안에 존재하는 사람들에게 현재 입장한 유저의 아이디를 전송
		socket.broadcast.to(room_test).emit('joinUser', userId);

		// 방금 입장한 사람에게 방 안에 존재하는 사람들의 아이디를 보내줌
		var roomUserList = new Array();
		for (var i = 0; i < userCnt; i++) {
			roomUserList[i] = roomList[room_test][i][0];
		}

		socket.emit('roomUser', roomUserList);

		// console.log('user is join the ' + room_test + ' userId = ' + userId);
	});
}

// 2018_02_08
// 방 퇴장 시
function exitRoom(socket, roomList) {
	//실제 개발 시 유니티에서 room_name 받아와야함
	socket.on('exitRoom', function(userId) {

		var userCnt = roomList[room_test].length;

		for(var i=0 ; i < userCnt ; i++){
			
			if(roomList[room_test][i][0] == userId){
				
//				delete roomList[room_test][i];
				roomList[room_test].splice(i,1);

				var roomUserList = new Array();
				
				for (var j = 0; j < userCnt-1; j++) {
					roomUserList[j] = roomList[room_test][j][0];
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

// 2018_02_19
// 방 입장 후 로비에서의 유저가 레디 하는 것을 수신 및, 전체 유저의 레디 상황 체크, 게임 타이머
function userReadyChk(socket, roomList, io) {

	socket.on('checkReady', function(jsonObj) {
		
		// 레디 한 유저를 찾는 for문
		for(var i=0; i<roomList[room_test].length; i++) {
			// -- if 레디한 유저를 찾음
			if(roomList[room_test][i][0] == jsonObj.nick) {
				// 보낸 상태가 레디 일 경우
				if(jsonObj.ready == 'True') {
					// 해당 유저의 상태를 ready로 변환
					roomList[room_test][i][1] = 'ready';
					// console.log('user is ready  userId = ' + jsonObj.nick);
					// 방 내에 존재하는 사람들에게 레디 했다는 것을 전송
					socket.broadcast.to(room_test).emit('ready', jsonObj.nick);

					// console.log('allReadyChk 전의 상황');
					// 방 안에 존재하는 모든 사람들이 레디를 했는지 체크
					if( allReady(roomList) ) {
						// console.log('allReadyChk 완료 : emit 신호가 날아가야함');
						// 모두 레디 했다는 것을 나를 포함한 방안에 있는 모든 유저들에게
					
						socket.broadcast.to(room_test).emit('allReady','broadcastAllReady');
						socket.emit('allReady','emitAllReady');
					}
				} else { // 아닐 경우
					// 해당 유저의 상태를 notReady로 변환
					roomList[room_test][i][1] = 'notReady';
					// console.log('user cancel ready  userId = ' + jsonObj.nick);
					// 방 내에 존재하는 사람들에게 레디를 풀었다는 것을 전송
					socket.broadcast.to(room_test).emit('notReady', jsonObj.nick);
				}
			}
		}
		
	});
}

// 2018_02_19
// userReadyChk 안에서 실행 되는 함수 ( 모든 유저들의 레디를 검사해서 start 신호를 던져줌)
function allReady(roomList) {
	var cnt = 0;

	const userNum = roomList[room_test].length;

	// console.log('allReady : userNum = ' + userNum);

	for(var i=0; i<userNum; i++) {
		if(roomList[room_test][i][1] == 'ready') {
			cnt++;
		}
	}

	// 두명 이상일 경우
	if(cnt == userNum && cnt >= 2) {
		// console.log('allReady : return = true의 상황  cnt = ' + cnt);
		return true;
	} else {
		// console.log('allReady : return = false의 상황  cnt = ' + cnt);
		return false;
	}
}

// 2018_02_20
//유저가 방 나가기를 눌렀을때 방퇴장 처리
function exitRoom(socket, roomList){
	//유저id받아옴
	socket.on('exit', function(nick) {

		var userCnt = roomList[room_test].length;
		var userId  = nick;

		// console.log('exit userId = ' + userId);

		for(var i=0 ; i < userCnt ; i++){
			
			if(roomList[room_test][i][0] == userId){
				
				roomList[room_test].splice(i,1);
				
				socket.broadcast.to(room_test).emit('exitUser', userId);

				break;
			}	
		}
	});
}

//방 입장 또는 유저 입장 시 씬 연결을 위해 유저이름과 레디상태를 만들어줌
function setIndex(socket, roomList){
	
	socket.on('index', function(index){

		socket.emit('resIndex', 'sendIndex');
	});
}

exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
exports.exitRoom = exitRoom;
exports.userReadyChk = userReadyChk;
exports.exitRoom = exitRoom;
exports.setIndex = setIndex;

