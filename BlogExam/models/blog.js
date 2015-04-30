var mysql = require('mysql');
var dbJson = require('./dbconfig');
var pool = mysql.createPool(dbJson);
var functions = require('../functions');

// 블로그 포스팅 300개 쓰기
exports.writePost300 = function (req, callback)
{
    pool.getConnection(function (err, connection)
    {
        for (var i = 0; i < 300; i++)
        {
            var id = req.session.user_id;
            var title = i+"번째 글 제목입니다 ^^/";
            var content = i+" 번째 글입니다. \n 내용입니다. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " + i;
            var dataArray = [id, title, content];
            var sql = "insert into tbl_post(id,title,content) values(?,?,?)";
            // Use the connection
            var j = 0;
            connection.query(sql, dataArray, function (err, rows)
            {
                // 반복문의 마지막 응답이 왔을 떄 응답을 보낸다.
                j++;
                if (j == i)
                {
                    callback({result: "success"});
                    connection.release();
                }
            });
        }

    });

};

// 블로그 포스팅 쓰기
exports.writePost = function (req, callback)
{
    pool.getConnection(function (err, connection)
    {
        var id = req.session.user_id;
        var title = req.body.title;
        var content = req.body.content;

        var lastImagePath =functions.getImageUrl(req);
        var sql = "insert into tbl_post(id,title,content,imgurl) values(?,?,?,?)";

        var dataArray = [id, title, content,lastImagePath];
        // Use the connection
        connection.query(sql, dataArray, function (err, rows)
        {
            if (err)
            {
                callback({result: "fail", message: "포스트 올리기 중 에러 : " + JSON.stringify(err)});
            }

            if (rows.affectedRows == 1)
            {
                callback({result: "success", message: "포스트 올리기 성공!"});
            }
            connection.release();
        });
    });
};

// 블로그 포스팅들 목록 가져오기
exports.getPostListData = function (req, pageIndicaotrCountPerPage, rowCountPerPage, page, callback)
{
    pool.getConnection(function (err, connection)
    {
        var id = req.params.id;

        var dataArray = [id];
        var sql = "select count(*) count from tbl_post where id=?";

        connection.query(sql, dataArray, function (err01, rows01)
        {
            if (err01)
            {
                callback({result: "fail", message: "리스트 가져오기 중 에러 err01 : " + JSON.stringify(err01)});
                connection.release();
            }
            else
            {

                // 글 총 갯수
                var countOfTotalRow = rows01[0].count;
                console.log("글 총 갯수 : ",countOfTotalRow);

                // 현재 페이지
                var pageInt = parseInt(page);
                // 한 페이지에 보이는 글 갯수
                var rowCountPerPageInt = parseInt(rowCountPerPage);
                // 한 페이지에 보이는 인디케이터 갯수
                var pageIndicaotrCountPerPageInt = parseInt(pageIndicaotrCountPerPage);

                // 첫번째 리미트 파라미터
                var firstLimitParam = (pageInt - 1) * rowCountPerPageInt;

                // 페이지 인디케이터의 전체 갯수
                var pageIndicatorCount = Math.ceil(countOfTotalRow / rowCountPerPageInt);

                // 페이지 인디케이터의 시작점
                var startPageIndicator = parseInt(page / pageIndicaotrCountPerPageInt) * pageIndicaotrCountPerPageInt + 1;
                if ((page % pageIndicaotrCountPerPageInt) == 0)
                {
                    startPageIndicator = startPageIndicator - pageIndicaotrCountPerPageInt;
                }


                var startRowNum = countOfTotalRow - firstLimitParam;
                var endPageIndicator = startPageIndicator + pageIndicaotrCountPerPageInt - 1;
                if (endPageIndicator > pageIndicatorCount) endPageIndicator = pageIndicatorCount;

                sql = "select post.num, post.id, users.name, post.title, post.content, post.imgurl, post.hits, date_format(post.date_create,'%Y-%m-%d %T') date_create, date_format(post.date_modify,'%Y-%m-%d %T') date_modify from tbl_users users left join tbl_post post on users.id=post.id where post.id=? order by post.num desc limit " + firstLimitParam + "," + rowCountPerPageInt;
                connection.query(sql, dataArray, function (err02, rows02)
                {
                    if (err02)
                    {
                        callback({result: "fail", message: "리스트 가져오기 중 에러 err02 : " + JSON.stringify(err02)});
                    }
                    else
                    {
                        var rowInfo =
                        {
                            page: page,
                            startRowNum: startRowNum,
                            pageIndicaotrCountPerPageInt: pageIndicaotrCountPerPageInt,
                            pageIndicatorCount: pageIndicatorCount,
                            startPageIndicator: startPageIndicator,
                            endPageIndicator: endPageIndicator,
                            rowCountPerPageInt: rowCountPerPageInt,
                            rows: rows02
                        };
                        callback({result: "success", message: "성공입니다+_+", rowsInfo: rowInfo});
                    }
                    connection.release();
                });
            }
        });
    });
};


// 블로그 포스팅 글 1개 히트수 업데이트 및 가져오기 --> 조회용
exports.getOnePostData = function (req, num, callback)
{
    pool.getConnection(function (err, connection)
    {
        var id = req.params.id;
        var dataArray = [id, num];
        var sql = "update tbl_post set hits=hits+1 where id=? and num=?";
        console.log('data : ', dataArray);
        connection.query(sql, dataArray, function (err01, rows01)
        {
            if (err01)
            {
                callback({result: "fail", message: "히트 수 증가 에러 err01 : " + JSON.stringify(err01)});
                connection.release();
            }
            else
            {
                sql = "select post.num, post.id, users.name, post.title, post.imgurl, post.content, post.hits, date_format(post.date_create,'%Y-%m-%d %T') date_create, date_format(post.date_modify,'%Y-%m-%d %T') date_modify from tbl_users users left join tbl_post post on users.id=post.id where post.id=? and post.num=?";
                connection.query(sql, dataArray, function (err02, rows02)
                {
                    console.log('rows02 : ', rows02);
                    if (err02)
                    {
                        callback({result: "fail", message: "글 1개 가져오기 중 에러 err02 : " + JSON.stringify(err02)});
                    }
                    else
                    {
                        callback({result: "success", message: "성공입니다+_+", row: rows02[0]});
                    }
                    connection.release();
                });
            }
        });
    });
};


// 블로그 포스팅 글 1개 가져오기 -> 업데이트 용
exports.getPostForUpdate = function (req, num, callback)
{
    pool.getConnection(function (err, connection)
    {
        var id = req.session.user_id;
        var dataArray = [id, num];

        var sql = "select post.num, post.id, users.name, post.title, post.content, post.hits, date_format(post.date_create,'%Y-%m-%d %T') date_create, date_format(post.date_modify,'%Y-%m-%d %T') date_modify from tbl_users users left join tbl_post post on users.id=post.id where post.id=? and post.num=?";
        connection.query(sql, dataArray, function (err, rows)
        {

            if (err)
            {
                callback({result: "fail", message: "글 1개 가져오기 중 에러 err : " + JSON.stringify(err)});
            }
            else
            {
                callback({result: "success", message: "성공입니다+_+", row: rows[0]});
            }
            connection.release();
        });

    });
};


// 글 업데이트 진행
exports.updatePostData  = function(req,num, callback)
{
    pool.getConnection(function (err, connection)
    {

        var title = req.body.title;
        var content = req.body.content;
        var id = req.session.user_id;

        var lastImagePath =functions.getImageUrl(req);


        var dataArray = [ title, content, lastImagePath,id, num];
        console.log('dataArray : ',dataArray);
        var sql = "update tbl_post set title=?, content=? ,imgurl=? , date_modify=CURRENT_TIMESTAMP where id=? and num=?";
        connection.query(sql, dataArray, function (err, rows)
        {

            if (err)
            {
                callback({result: "fail", message: "글 업데이트 중 에러 err : " + JSON.stringify(err)});
            }
            else
            {
                callback({result: "success", message: "성공입니다+_+", row: rows});
            }
            connection.release();
        });

    });
};


exports.deletePost = function(req,callback)
{
    var num = req.params.num;
    var id= req.session.user_id;

    var sql = "delete from tbl_post where num=? and id=?";
    pool.getConnection(function(err,connection)
    {
        if(err) console.error("에러 : ",err);
        connection.query(sql,[num,id],function(err,rows)
        {
            if(err) console.error("에러 : ",err);

            callback({result:"success", message:"삭제 성공", row : rows[0]});
            connection.release();
        });
    });

};