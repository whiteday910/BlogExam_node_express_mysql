var mysql = require('mysql');
var dbJson = require('./dbconfig');
var pool = mysql.createPool(dbJson);


exports.getUserIds = function(callback)
{

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 에러 : ",err);

        var sql = "select id from tbl_users";
        connection.query(sql,[],function(err,row)
        {
            if(err) console.error("사용자 아이디 조회 에러 : ",err);
            console.log("사용자 아이디 조회 : ",row);

            callback(row);
        });
    });

};

exports.signupMember = function(datas, callback)
{
    var  sql = "select id from tbl_users where id=?";
    pool.getConnection(function (err, connection)
    {
        var id = datas[0];
        // Use the connection
        connection.query(sql,[id], function (err, rows)
        {
            if(err) console.error("첫번째 에러 : ",err);
            console.log("signupMember 첫번째 rows : ",rows);

            if(rows.length >0)
            {
                callback({result:"fail", message:"이미 가입된 아이디 입니다."});
                connection.release();
                return ;
            }
            else
            {
                sql = "insert into tbl_users(id, pw, name, email) values(?,?,?,?)";

                pool.getConnection(function (err, connection)
                {
                    // Use the connection
                    connection.query(sql,datas, function (err, rows)
                    {
                        if(err) console.error("에러 : ",err);
                        console.log("signupMember 두번째 rows : ",rows);
                        callback(rows);

                        connection.release();
                    });
                });

            }

        });
    });
};

exports.isLoginSuccess = function(datas, callback)
{
    var  sql = "select num, name, email from tbl_users where id=? and pw=?";
    pool.getConnection(function (err, connection)
    {

        // Use the connection
        connection.query(sql,datas, function (err, rows)
        {
            if(err) console.error("에러 : ",err);
            console.log("data : ",rows);
            if(rows.length == 1)
            {
                callback({result:"success",message:"성공적으로 로그인 완료", data:rows[0]});
            }
            else
            {
                callback({result:"fail",message:"아이디와 패스워드를 확인해 주세요"});
            }
            connection.release();
        });
    });
};