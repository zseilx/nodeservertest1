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

/*
	roomSetting['방이름']['설정명']['설정정보']
	방의 설정 정보 및 오브젝트 상태들을 저장 해놓는 공간
*/
var roomStatus = new Array();




// 2018_01_28 
// Server 시작을 알리는 부분
console.log('Server Started!');

// serverController.errtest();

// 2018_01_28 
// socket io 처리 부분
// deeps level 0
io.sockets.on('connection', function (socket) {

	console.log('connected : ' + socket.id);

	/**************************************** roomController ****************************************/
	// 방 생성
	// socket.on('createRoom', function(roomName, userId)
	roomController.createRoom(socket, roomStatus);

	// 방 입장
	// socket.on('joinRoom', function(userId)
	roomController.joinRoom(socket, roomStatus);

	// 방 퇴장
	// socket.on('exit', function(nick)
	roomController.exitRoom(socket, roomStatus);

	// 유저 레디 시 ( 레디 체크 )
	// socket.on('checkReady', function(jsonObj)
	roomController.userReadyChk(socket, roomStatus);

	// 씬 전환 정보 전송
	// socket.on('index', function(index)
	roomController.setIndex(socket, roomStatus, io);

	/**************************************** serverController ****************************************/
	// 유저의 서버 접속
	// socket.on('joinServer', function()
	serverController.joinServer(socket, userList);

	// 유저가 서버에서 나갔을 때 ( 정상적인 게임 종료 )
	// socket.on("exitServer",function(userId)
	serverController.exitServer(socket, userList);

	// 강제 종료 및, 예외적인 서버와의 연결 끊김 처리
	// socket.on("exitServer",function(userId)
	serverController.disconnected(socket, userList, roomStatus);

	/**************************************** playGame ****************************************/
	// 유저 움직임 수신
	// socket.on('now', function(jsonStr)
	playGame.getMovement(socket);

	// 유저가 총 집었을 때
	// socket.on('now', function(jsonStr)
	playGame.getGun(socket);

	// 유저가 총을 숨겼을 때
	// socket.on('hidingGun', function(data)
	playGame.hidingGun(socket);

	// 유저가 총 버렸을 때
	// socket.on('hidingGun', function(data)
	playGame.getDropGun(socket);

	// 유저가 총을 쐈을 때
	// socket.on('shootGun', function(data)
	playGame.getShootGun(socket,io,roomStatus);

	/**************************************** initGameStart ****************************************/
	// 맵에서의 각 플레이어들의 위치를 랜덤으로 생성하여 뿌려주는 역할
	// socket.on('reqPosition', function()
	initGameStart.sendInit(socket, roomStatus, chair, io);

	// 인게임에서 유저가 준비동작을 갖추었을 때
	// socket.on('handReady', function(data)
	initGameStart.handReady(socket, roomStatus, io);

	// 인게임에서 유저가 준비동작을 갖추다가 다른 동작을 취했을 때
	// socket.on('handNotReady', function(data)
	initGameStart.handNotReady(socket, roomStatus, io);
	// voiceTalk

});

