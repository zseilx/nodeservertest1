
const room_test = 'room1';

const totalGameTime = 180; // 게임 총 시간
const sideTime = 15; // 게임 양 끝의 대기 시간? (게임 시작 대기, 게임 종료 전 진행을 위한 시간)

// 2018_02_15
// 게임 시작 시 유저와 NPC의 자리를 랜덤 생성 후 전달
function sendInit(socket, roomStatus, chair, io) {
	//socket.on('sendInit', function(roomName) {
	socket.on('reqPosition', function() {
		// console.log('reqPosition : socket get event');

		roomStatus[room_test]['gameStatus'] = 'go';

		//게임 타이머 설정
		setTimeout(gameTime, 180000 , 'gameEnd');

		//게임 타이머 함수
		function gameTime(arg){
			
			//만약 게임이 진행되고 있다면
			if(roomStatus[room_test]['gameStatus'] = 'go'){
			
				//방에 접속해 있는 유저 수
				var userCnt = roomStatus[room_test]['users'].length;

					for(var i=0 ; i < userCnt ; i++){
						
						//방 유저 상태를 notReady로 바꿈
						roomStatus[room_test]['users'][i][1] = 'notReady';						
					}

				console.log('게임 타임 끝');
				//게임 끝 정보 서버에 전송
				socket.emit('timeOver', 'timeOver'); 
			}
		}


		if(roomStatus[room_test]['characterPosition'] == null) {
			console.log('sendInit : if = ' + '방생성');
			var playerNum = roomStatus[room_test]['users'].length;

			console.log("플레이어 수 : " + playerNum);

			// 위치 랜덤 생성 배열 가져오기
			var arr = initPosition(playerNum, chair);

			roomStatus[room_test]['characterPosition'] = new Array();

			for(var i=0; i < chair; i++) {
				if(i < playerNum) {
					roomStatus[room_test]['characterPosition'][arr[i]] = roomStatus[room_test]['users'][i][0];
				} else {
					roomStatus[room_test]['characterPosition'][arr[i]] = 'NPC';
				}
			}
			
			var npcCnt = 8-roomStatus[room_test]['users'].length;//npc 수

			var eventNpcOut = randomTimeNpcOut(npcCnt);
		
			var npcPosition = randomPositionNpc(roomStatus[room_test]['characterPosition']);
    
			var j=0;

			//방 상태확인 추가
			while(npcPosition.length > 0) {
				setTimeout(npcOut, 
					(eventNpcOut[j] + (eventNpcOut[npcCnt] * j) + sideTime) * 1000, 
					socket, roomStatus, npcPosition[0], io);

				npcPosition.splice(0,1);
				j++;
			}

			// console.log('reqPosition : socket send event = resPosition');

			socket.emit('resPosition', roomStatus[room_test]['characterPosition']);

		} else {
			console.log('sendInit : else = ' + '방생성 되있음, 포지션 정보만 전송');
			socket.emit('resPosition', roomStatus[room_test]['characterPosition']);
		}
	});
}

// 인게임에서 유저가 준비동작을 갖추었을 때
function handReady(socket, roomStatus, io) {

	roomStatus[room_test]['handReady'] = new Array();


	socket.on('handReady', function(data) {
		
		//손 하나를 지정위치에 올려놓은 유저의 이름 받아옴
		var userId = data;
		//방에 있는 유저 수
		var userNum = roomStatus[room_test]['users'].length;
		//Ready한 사람의 수
		var readyNum = 0;

		//손이 들어 올때마다 배열 값 변경
		if(roomStatus[room_test]['handReady'][userId]==null){
			roomStatus[room_test]['handReady'][userId] = 'oneIn';
		}else if(roomStatus[room_test]['handReady'][userId]=='oneIn'){
			roomStatus[room_test]['handReady'][userId] = 'TwoIn';
		}

		for(i=0 ; i<userNum ; i++){
			roomStatus[room_test]['handReady'][i] == 'TwoIn';
			readyNum++;
		}

		if(readyNum==userNum){
			io.to(room_test).emit('handReady', handReady);
			setTimeout(handReadyTime, 3000 , roomStatus);
		}
	});
}

function handNotReady(){

}



function npcOut(socket, roomStatus, npcNum, io){
	console.log('npc퇴장 이벤트 발생함' + '   npcNum = ' + npcNum);

	roomStatus[room_test]['characterPosition'][npcNum] = 'empty';

	io.to(room_test).emit('npcOut', npcNum);
}



// 2018_02_15
// npc 및 player 위치 랜덤생성
function initPosition(playerNum, chair) {

	var position = new Array(chair);

	for (var i = 0; i < chair; i++) {
		position[i] = i;
	}

	var temp = 0;
	for (var i = 0; i < chair; i++) {
		var num = Math.floor((Math.random() * chair - i) + i);

		temp = position[i];
		position[i] = position[num];
		position[num] = temp;
	}

	return position;
};


//npc가 퇴장하는 랜덤 시간 배열 return
function randomTimeNpcOut(npcCnt) {
    var averOutTime = (totalGameTime - sideTime * 2) / npcCnt;

    var outTimeArray = new Array();
    for(var i=0; i<npcCnt; i++) {
       var randomNum = Math.floor(Math.random() * 6); // 0~5의 값을 뽑아내기 위함 맞는지 체크 필요
       outTimeArray[i] = averOutTime - randomNum;
    }
    outTimeArray[npcCnt] = averOutTime;

   return outTimeArray;
};

function randomPositionNpc(npcPosition) {

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
function handReadyTime(handready, roomStatus) {
	roomStatus[room_test]['gameStatus']=='handReady';
}



exports.sendInit = sendInit;
exports.handReady = handReady;
exports.handNotReady = handReadyTime;