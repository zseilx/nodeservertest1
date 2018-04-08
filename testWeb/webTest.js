/* 
 * 2018_04_07
 * 웹 테스트 전용으로 만들어진 웹 소켓 수신 이벤트들
 */

var serverURL = 'http://localhost:5000';

$(document).ready(function() {

    var socket = io.connect(serverURL);
    //var socket = io.connect(serverURL2);
    //var socket = io.connect(testURL);

    socket.on('connection', 
        function (data) { 
            if(data.type == 'connected') {
                socket.emit('conneection', {
                    type : 'join'
                })
            }
        }
    );

    socket.on('allReady', function(data) {
        console.log('allReady gameStart');
        socket.emit('reqPosition');
    });

    socket.on('', function() {
        console.log();
    });

    var id = 'asd';

    $('#test').click(function() {
        socket.emit('test','연결 완료!!!');
    });
    
    $('#idButton').click(function() {
        id = $('#id').val();
    });
    
    $('#joinRoom').click(function() {
        socket.emit('joinRoom', id);
    });

    $('#exitRoom').click(function() {
        socket.emit('exitRoom', id);
    });

    $('#setReady').click(function() {
        var obj = {
            nick : id,
            ready : "True"
        };

        socket.emit('checkReady', obj);
    });
    
    $('#setHandReady').click(function() {
        socket.emit('handReady', id);
    });

    $('').click(function() {

    });
});