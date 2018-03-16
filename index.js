// socket.io 서버 생성
const io = require('socket.io').listen(5000);

// 방 관리의 주요 기능들을 모아놓은 것
const roomController = require('./roomController');
// 게임 시작 시 초기 셋팅
const initGameStart = require('./initGameStart');
// 유저가 서버에 접속 및 해제했을 때의 처리
const serverController = require('./serverController');
// 게임 내부에서 동작하는 이벤트들을 처리
const playGame = require('./playGame');
// 음성 대화 지원
const voiceTalk = require('./voiceTalk');



// 방 생성 관련 테스트
const room_test = 'room1';
// 한 게임에 진행 할 수 있는 최대 인원 (유저 + NPC)
const chair = 8;

// 접속해 있는 유저들 정보
// 키 값으로 유저 아이디가 들어가며, 밸류값으로 소켓 아이디 저장
// userList['유저ID'] = socket.id;
var userList = new Array();

// 방들 정보 저장
/*
	형식은 roomList['방이름'][유저번호(int)][유저속성(int)];
	1차원 (유사배열)	- 방이름 : 첫 방이름은 키값으로 스트링 형태의 데이터로 접근. 초기 방 생성시 배열에 생성
	2차원 배열		 - 유저 번호로써 유저가 해당 방에 입장한 순서대로 유저의 번호가 지정된다 예 ) 방장은 0번을 부여받음
	3차원 배열		 - 유저 속성으로는 현재 2가지가 존재함
			0) 배열 원소 0번에는 유저의 ID를 저장함
			1) 배열 원소 1번에는 유저의 현재 상태 (ready, notReady, start)를 저장
	
	유저 번호는 방에 접속한 순서대로 번호를 부여받으며 방에서 나갈 시 해당 방에서 유저의 정보는 사라진다.
*/
var roomList = new Array();

/*
	roomSetting['방이름']['설정명']['설정정보']
	방의 설정 정보 및 오브젝트 상태들을 저장 해놓는 공간
*/
var roomStatus = new Array();

roomStatus[room_test] = new Array(); // 이 코드는 현재 테스트 용으로 실제 createRoom이 동작시 필요 없어짐.


// 2018_01_28 
// Server 시작을 알리는 부분
console.log('Server Started!');

// serverController.errtest();

// 2018_01_28 
// socket io 처리 부분
io.sockets.on('connection', function (socket) {

	console.log('connected : ' + socket.id);

	// roomController
	// 방 생성
	roomController.createRoom(socket, roomList);
	// 방 입장
	roomController.joinRoom(socket, roomList);
	// 방 퇴장
	roomController.exitRoom(socket, roomList);
	// 유저 레디 시 ( 레디 체크 )
	roomController.userReadyChk(socket, roomList);
	// 씬 전환 정보 전송
	roomController.setIndex(socket, roomList, io);

	// serverController
	// 유저의 서버 접속
	serverController.joinServer(socket, userList);
	// 유저가 서버에서 나갔을 때 ( 정상적인 게임 종료 )
	serverController.exitServer(socket, userList);
	// 강제 종료 및, 예외적인 서버와의 연결 끊김 처리
	serverController.disconnected(socket, userList, roomList);

	// playGame
	// 유저 움직임 수신
	playGame.getMovement(socket);
	// 유저가 총 집었을 때
	playGame.getGun(socket);
	// 유저가 총을 숨겼을 때
	playGame.hidingGun(socket);
	// 유저가 총 버렸을 때
	playGame.getDropGun(socket);
	// 유저가 총을 쐈을 때
	playGame.getShootGun(socket,io,roomStatus,roomList);

	// initGameStart
	// 맵에서의 각 플레이어들의 위치를 랜덤으로 생성하여 뿌려주는 역할
	initGameStart.sendInit(socket, roomList, roomStatus, chair, io);
	// 인게임에서 유저가 준비동작을 갖추었을 때
	initGameStart.handReady(socket, roomList, roomStatus, io);
	// 인게임에서 유저가 준비동작을 갖추다가 다른 동작을 취했을 때
	initGameStart.handNotReady(socket, roomList, roomStatus, io);
	// voiceTalk

});

