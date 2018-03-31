
const room_test = 'room1';
const TOTAL_GAME_TIME = 180; // 게임 총 시간
const FRONT_SIDE_TIME = 15; // 게임 시작 대기 시간
const BACK_SIDE_TIME = 15; // 게임 종료 전 진행을 위한 시간
const PLUS_TIME = 5; // NPC 랜덤 퇴장 + 시간 간격
const MINUS_TIME = -5; // NPC 랜덤 퇴장 - 시간 간격
const CHAIR = 8; // 총 캐릭터 숫자 ( USER + NPC + empty포함 )

// 2018_02_15
// 게임 시작 시 유저와 NPC의 자리를 랜덤 생성 후 전달
// deeps level 1
function sendInit(socket, roomStatus, io) {
	//socket.on('sendInit', function(roomName) {
	socket.on('reqPosition', function() {
		// console.log('reqPosition : socket get event');

		roomStatus[room_test]['gameStatus'] = 'go';


		if(roomStatus[room_test]['characterPosition'] == null) {
			console.log('sendInit : if = ' + '방생성');
			var playerNum = roomStatus[room_test]['users'].length;

			console.log("플레이어 수 : " + playerNum);

			// 위치 랜덤 생성 배열 가져오기
			var randomPositionArrar = createRandomPosition();

			setRandomPosition(roomStatus, randomPositionArrar);

			// console.log('reqPosition : socket send event = resPosition');

			socket.emit('resPosition', roomStatus[room_test]['characterPosition']);

		} else {
			console.log('sendInit : else = ' + '방생성 되있음, 포지션 정보만 전송');
			socket.emit('resPosition', roomStatus[room_test]['characterPosition']);
		}
	});
}

// 인게임에서 유저가 준비동작을 갖추었을 때
// deeps level 1
function handReady(socket, roomStatus, io) {

	socket.on('handReady', function(data) {

		console.log('handReady!!!');

		if(roomStatus[room_test]['handReady'] == null)
			roomStatus[room_test]['handReady'] = new Array();
		
		//손 하나를 지정위치에 올려놓은 유저의 이름 받아옴
		var userId = data;
		//방에 있는 유저 수
		var userNum = roomStatus[room_test]['users'].length;
		//Ready한 사람의 수
		var readyNum = 0;

		
		roomStatus[room_test]['handReady'][userId] = 'twoIn';

		for (const key in roomStatus[room_test]['handReady']) {
			if(roomStatus[room_test]['handReady'][key] == 'twoIn'){
				readyNum++;

				console.log('ready한 사람 수 : ',readyNum);
			}
		}

		if(readyNum==userNum){
			console.log('유저 모두 인게임 완료!!! 젠부사쓰!!!!!!!!!!!!!!!');
			console.log('타이머 3초!!!');
			
			roomStatus[room_test]['timeEvent']['handReadyTime'] = new Array();

			roomStatus[room_test]['timeEvent']['handReadyTime'] =
				setTimeout(handReadyTime, 3000 , roomStatus, room_test, io);
			
			io.to(room_test).emit('handAllReady', 'handAllReady');
		}
	});
}

// 2018_03_24 
// 핸드 레디를 풀었을 경우 수신하는 이벤트
// deeps level 1
function handNotReady(socket, roomStatus, io){
	
	socket.on('handNotReady', function(data) {
		
		console.log('handNotReady!!!');


		//손을 지정위치에서 뺀 유저이름을 받아옴
		var userId = data;


		//게임시작 타이머를 세는중에 손을 지정위치에서 뺀 경우
		if(roomStatus[room_test]['gameStatus']=='handReady'){

			if(roomStatus[room_test]['handReady'][userId] == 'twoIn'){
				delete roomStatus[room_test]['handReady'][userId];
			}
			
			//방 상태 go로 바꿈
			roomStatus[room_test]['gameStatus']=='go';
			//settimeout 정지
			console.log('3초 세고 있는데 누가 손뺏다능!!!');
			clearTimeout(handReadyTime);
			

			io.to(room_test).emit('handNotReady', 'handNotReady');

		}else if(roomStatus[room_test]['gameStatus']=='go'){
			
			if(roomStatus[room_test]['handReady'][userId] == 'twoIn'){
				delete roomStatus[room_test]['handReady'][userId];
			}
			io.to(room_test).emit('handNotReady', 'handNotReady');
		}
	});
}


// 2018_03_17
// 한명의 npc가 실제로 퇴장하는 이벤트
// deeps level 3
// Recursive function 재귀 함수
function npcOutSocket(roomStatus, io){
	var callTime = BACK_SIDE_TIME * 1000; // 다음 재귀 함수 호출 시간
	// 캐릭터 포지션 값중 NPC들의 위치 번호를 저장하는 Array
	var npcArray = getNpcPosition(roomStatus[room_test]['characterPosition']);
	// npcOut 숫자를 받아옴

	// 초기 npcOutSocket 함수 호출시 실행 됨
	if(roomStatus[room_test]['gameStartTime'] == null) {
		roomStatus[room_test]['gameStartTime'] = new Date().getTime(); // 초기 게임 시작 시간 저장

		// 가장 처음 이 함수가 시작 될 경우 게임이 갓 시작된 상태임.
		// 이 상태에서 초기 프론트 대기시간을 재귀함수 callTime에 1000을 곱한 상태로 더함으로써
		// 프론트 콜 타임을 적용 해줌
		callTime = callTime + (FRONT_SIDE_TIME * 1000);

	} else if(npcArray.length > 0) {
		var outNpcNum = Math.floor(Math.random() * npcArray.length);

		roomStatus[room_test]['characterPosition'][outNpcNum] = 'empty';
	
		console.log('npc퇴장 이벤트 발생함' + '   npcNum = ' + outNpcNum);
		io.to(room_test).emit('npcOut', outNpcNum)

	// NPC 배열에 아무것도 없을 시 모든 NPC가 나갔거나 사망했으므로 재귀 호출 없이 리턴 해버림
	} else {
		return ;
	}

	// 게임시간 = 총 게임시간에서 뒤 마무리 시간 제외한 값
	// (총 게임시간 - 마무리시간)
	var gameTime = TOTAL_GAME_TIME - BACK_SIDE_TIME;
	
	// 남은 게임 시간 계산
	// 게임시간 - (현재시간 - 게임 시작시간)
	remainingPlayTime = (gameTime * 1000) - (new Date().getTime - roomStatus[room_test]['gameStartTime']);

	// 재귀
	if(remainingPlayTime > 0 && roomStatus[room_test] == 'handAllReady') {

		var nextNpcOutTime = remainingPlayTime / npcArray.length; // 다음 NPC퇴장 시간을 남은 NPC수만큼 나눔
		var randomTime = Math.floor(Math.random() * (PLUS_TIME - MINUS_TIME)) + MINUS_TIME; // npc퇴장 시간 랜덤부여
		randomTime *= 1000;
	
		// 다음 함수 호출 시간
		callTime += nextNpcOutTime;
		callTime += randomTime;

		roomStatus[room_test]['timeEvent']['npcOutSocket'] = new Array();
		roomStatus[room_test]['timeEvent']['npcOutSocket'] =
		setTimeout(function() {
			npcOutSocket(roomStatus, io)
		}, callTime);
	}
}



// 2018_02_15
// npc 및 player 위치 랜덤생성
// deeps level 2
function createRandomPosition() {

	var position = new Array();

	for (var i = 0; i < CHAIR; i++) {
		position[i] = i;
	}

	var temp = 0;
	for (var i = 0; i < CHAIR; i++) {
		var num = Math.floor((Math.random() * CHAIR - i) + i);

		temp = position[i];
		position[i] = position[num];
		position[num] = temp;
	}

	return position;
};

// 2018_03_31
// 게임 시작 시 캐릭터 위치 배치, 및 도중 위치 변경 시 처리하는 함수
// deeps level 2
function setRandomPosition(roomStatus, randomPosition) {
	// 초기 캐릭터 배치 이벤트
	if(roomStatus[room_test]['characterPosition'] == null) {

		roomStatus[room_test]['characterPosition'] = new Array();

		var userNum = roomStatus[room_test]['users'].length;
		var i=0;
		// user 수만큼 자리 배치를 먼저 한 후
		for(; i < userNum ; i++) {
			roomStatus[room_test]['characterPosition'][randomPosition[i]] = roomStatus[room_test]['users'][i][0];
		}
		// 나머지는 NPC로 차리를 채움
		for(; i < CHAIR; i++) {
			roomStatus[room_test]['characterPosition'][randomPosition[i]] = 'NPC';
		}

	// 이미 배치 된 상태를 바꾸는 형태
	} else {
		var temp = '';
		
		for(var i=0; i < CHAIR; i++) {
			temp = roomStatus[room_test]['characterPosition'][i];
			roomStatus[room_test]['characterPosition'][i] = roomStatus[room_test]['characterPosition'][randomPosition[i]];
			roomStatus[room_test]['characterPosition'][randomPosition[i]] = temp;
		}
	}
}



// npc 위치 받아오기
// deeps level 4
function getNpcPosition(characterPosition) {
	var npcArray = new Array(); // NPC들의 번호를 배열에 저장

	// NPC가 살아 있는 자리의 번호들을 배열에 저장
	idx = characterPosition.indexOf('NPC');
	while(idx != -1) {
		npcArray.push(idx);
		idx = characterPosition.indexOf('NPC', idx + 1);
	}

    return npcArray;
}


// 플레이어 핸드레디 전부 확인 시 게임 시작 및 npc 자리 셋팅 등 실제 게임 시작
// deeps level 2
function handReadyTime(roomStatus, room_test, io) {
	console.log('오케이 3초동안 준비 잘했어 진짜 게임 시작할께');
	roomStatus[room_test]['gameStatus']=='handAllReady';
	io.to(room_test).emit('timeUp', 'timeUp');

	//정전변수
	var lightList = new Array();

	lightList[0] = Math.floor(Math.random() * (45 - 15))+15;
	lightList[1] = Math.floor(Math.random() * (75 - 45))+45;
	lightList[2] = Math.floor(Math.random() * (105 - 75))+75;
	lightList[3] = Math.floor(Math.random() * (135 - 105))+105;
	lightList[4] = Math.floor(Math.random() * (180 - 135))+135;

	

	//게임 타이머 설정
	
	roomStatus[room_test]['timeEvent']['gameTime'] = setTimeout(gameTime, TOTAL_GAME_TIME * 1000 , roomStatus, io);
	
	//정전 타이머 설정
	roomStatus[room_test]['timeEvent']['lightTime'] = new Array();
	for( var i = 1 ; i <= 5 ; i++){
		roomStatus[room_test]['timeEvent']['lightTime'][i] =
			setTimeout(lightTime, lightList[i] * 1000 , roomStatus, io);
	}

	// Recursive function 재귀 함수
	// npc 나가는 이벤트
	npcOutSocket(roomStatus, io);

}

// 게임 타이머 함수
// deeps level 3
function gameTime(roomStatus, io) {
		console.log('게임 타임 끝');
		
		//방 배열 삭제
		delete roomStatus[room_test];
		//게임 끝 정보 서버에 전송
		io.to(room_test).emit('timeOver', 'timeOver'); 	
}

function lightTime(roomStatus, io) {
		console.log('정전 발생');
		
		io.to(room_test).emit('lightOut', 'lightOut'); 	
}



exports.sendInit = sendInit;
exports.handReady = handReady;
exports.handNotReady = handNotReady;
