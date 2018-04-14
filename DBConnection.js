const mysql = require('mysql');

var dbConfig = {
    host : 'localhost',
    user : 'root',
    password : '1234',
    port : '33060',
    database : 'nodetest',
    connectionLimit : 50
}

const pool = mysql.createPool(dbConfig);


// 2018_04_14
// 인설트 전용 쿼리 실행문
var executeInsert = function(sql) {
    // 결과 체크
    var result = false;
    // sql 문 입력이 들어오지 않았을 경우 결과 값을 거짓으로 설정 후 함수 종료
    if(typeof sql === 'undefined') {
        console.log('executeInsert : not sql query');
        return false;
    }

    // 커넥션 요청
    pool.getConnection(function(err, connection) {
        if(!err) {
            console.log('executeInsert : ' + sql);

            connection.query(sql, function (err, result) {
                if(err) console.log(err);

                //result = rows;
                //console.log(rows);
            });
            //console.log(result);
        } else {
            console.log("executeInsert err : " + err);
        }
        connection.release();
    });

    return result;
};

// 2018_04_14
// 업데이트 전용 쿼리 실행문
var executeUpdate = function(sql) {
    // 결과 체크
    var result = false;
    // sql 문 입력이 들어오지 않았을 경우 결과 값을 거짓으로 설정 후 함수 종료
    if(typeof sql === 'undefined') {
        console.log('executeUpdate : not sql query');
        return false;
    }

    // 커넥션 요청
    pool.getConnection(function(err, connection) {
        if(!err) {
            console.log('executeUpdate : ' + sql);

        } else {
            console.log("executeUpdate err : " + err);
        }
        connection.release();
    });

    return result;
};

// 2018_04_14
// 딜리트 전용 쿼리 실행문
var executeDelete = function(sql) {
    // 결과 체크
    var result = false;
    // sql 문 입력이 들어오지 않았을 경우 결과 값을 거짓으로 설정 후 함수 종료
    if(typeof sql === 'undefined') {
        console.log('executeDelete : not sql query');
        return false;
    }

    // 커넥션 요청
    pool.getConnection(function(err, connection) {
        if(!err) {
            console.log('executeDelete : ' + sql);
        } else {
            console.log("executeDelete err : " + err);
        }
        connection.release();
    });

    return result;
};

// 2018_04_14
// 셀렉트 1개 행 반환 전용 퀴리 실행문
var executeSelectOne = function(sql) {
    // 결과 체크
    var result = false;
    // sql 문 입력이 들어오지 않았을 경우 결과 값을 거짓으로 설정 후 함수 종료
    if(typeof sql === 'undefined') {
        console.log('executeSelectOne : not sql query');
        return false;
    }

    // 커넥션 요청
    pool.getConnection(function(err, connection) {
        if(!err) {
            console.log('executeSelectOne : ' + sql);
            connection.query(sql, function (err, rows) {
                result = rows;
            });
        } else {
            console.log("executeSelectOne err : " + err);
        }
        connection.release();
    });

    return result;
};

// 2018_04_14
// 셀렉트 리스트 전용 쿼리 실행문
var executeSelectList = function(sql) {
    // 결과 체크
    var result = false;
    // sql 문 입력이 들어오지 않았을 경우 결과 값을 거짓으로 설정 후 함수 종료
    if(typeof sql === 'undefined') {
        console.log('executeSelectList : not sql query');
        return false;
    }

    // 커넥션 요청
    pool.getConnection(function(err, connection) {
        if(!err) {
            console.log('executeSelectList : ' + sql);
            connection.query(sql, function (err, rows) {
                if(err) console.log(err);

                result = rows;
                console.log(rows);
            });
        } else {
            console.log("executeSelectList err : " + err);
        }
        connection.release();
    });

    return result;
};

exports.executeInsert = executeInsert;
exports.executeUpdate = executeUpdate;
exports.executeDelete = executeDelete;
exports.executeSelectOne = executeSelectOne;
exports.executeSelectList = executeSelectList;