var express = require('express');
var router = express.Router();
var blog = require('../models/blog');
var functions = require('../functions');

/* GET users listing. */
router.get('/', function (req, res, next)
{
    res.redirect('/');

});

router.get('/:id', function (req, res, next)
{
    var id = req.params.id;
    res.redirect('/blog/' + id + '/list');

});


router.get('/:id/write', function (req, res, next)
{
    if (functions.isSessionSet(req))
    {
        var id = req.session.user_id;
        res.render('blog/write', {title: "포스트 쓰기",id:id});
    }
    else
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
    }

});

router.post('/:id/write', function (req, res, next)
{
    var id = req.params.id;
    if (!functions.isSessionSet(req))
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
        return;
    }

    blog.writePost(req, function (data)
    {
        if (data.result == "success")
        {
            res.redirect("/blog/" + id + "/list");
        }
        else
        {
            res.send(functions.getAlertScriptString("글쓰기에 문제가 있어 되돌아 갑니다 \n 에러 : " + data.message));
        }
    });
});


router.get('/:id/write300', function (req, res, next)
{
    if (!functions.isSessionSet(req))
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
        return ;
    }
    var id = req.params.id;
    blog.writePost300(req, function (data)
    {
        var id = req.params.id;
        res.redirect("/blog/" + id + "/list");
    });
});

router.get('/:id/list', function (req, res, next)
{
    var pageIndicaotrCountPerPage = req.session.pageIndicaotrCountPerPage;
    var rowCountPerPage = req.session.rowCountPerPage;
    var id = req.params.id;
    if (typeof pageIndicaotrCountPerPage === 'undefined')
    {
        req.session.pageIndicaotrCountPerPage = 7;
    }

    if (typeof rowCountPerPage === 'undefined')
    {
        req.session.rowCountPerPage = 5;
    }

    res.redirect('/blog/' + id + '/list/1');
});

router.get('/:id/list/:page', function (req, res, next)
{
    var id = req.params.id;

    var pageIndicaotrCountPerPage = req.session.pageIndicaotrCountPerPage;
    var rowCountPerPage = req.session.rowCountPerPage;

    if (typeof pageIndicaotrCountPerPage === 'undefined')
    {
        req.session.pageIndicaotrCountPerPage = 7;
    }

    if (typeof rowCountPerPage === 'undefined')
    {
        req.session.rowCountPerPage = 5;
    }

    pageIndicaotrCountPerPage = req.session.pageIndicaotrCountPerPage;
    rowCountPerPage = req.session.rowCountPerPage;


    var page = req.params.page;

    blog.getPostListData(req, pageIndicaotrCountPerPage, rowCountPerPage, page, function (returnData)
    {
        if (returnData.result == "success")
        {
            var isSessionSet= functions.isSessionSet(req);

            var isLoginAndLookOtherBloger = functions.isLoginAndLookOtherBloger(req);
            console.log('isLoginAndLookOtherBloger : ',isLoginAndLookOtherBloger);
            if(returnData.rowsInfo.rows.length==0)
            {
                res.render('blog/noBlogList', {id:id,isSessionSet:isSessionSet,isLoginAndLookOtherBloger:isLoginAndLookOtherBloger});
                return ;
            }
            var returnData = {title: "블로그 포스트 리스트", data: returnData,id:id,isSessionSet:isSessionSet,isLoginAndLookOtherBloger:isLoginAndLookOtherBloger};

            // 테스트
            res.render('blog/blog', returnData);

            // 테스트
            //res.render('blog/list', returnData);
            console.log('returnData : ', JSON.stringify(returnData));

        }
        else
        {
            res.json(returnData);
        }
    });
});

router.post('/:id/list/:page', function (req, res, next)
{
    var id = req.params.id;
    var page = req.params.page;
    var rowCountPerPage = req.body.rowCountPerPage;
    var pageIndicaotrCountPerPage = req.body.pageIndicaotrCountPerPage;
    req.session.rowCountPerPage = parseInt(rowCountPerPage);
    req.session.pageIndicaotrCountPerPage = parseInt(pageIndicaotrCountPerPage);
    res.redirect('/blog/'+id+'/list/'+page);
});



// 글 1개 읽기
router.get('/:id/read/:num/:page', function (req, res, next)
{
    var id = req.params.id;
    var num = req.params.num;
    var page = req.params.page;
    var isSessionSet = functions.isSessionSet(req);
    blog.getOnePostData(req, num, function (resultData)
    {
        var isLoginAndLookOtherBloger = functions.isLoginAndLookOtherBloger(req);
        res.render('blog/blog-single', {title: "포스트 보기", page: page, data: resultData, id:id,isSessionSet:isSessionSet,isLoginAndLookOtherBloger:isLoginAndLookOtherBloger});
    });
});

router.get('/:id/update', function (req, res, next)
{
    var id = req.params.id;
    res.redirect('/blog/'+id);
});


router.get('/:id/update/:num/:page', function (req, res, next)
{
    if (functions.isSessionSet(req))
    {
        var id = req.session.user_id;
        var num = req.params.num;
        var page = req.params.page;

        blog.getPostForUpdate(req, num, function (resultData)
        {
            console.log('resultData : ', resultData);
            res.render('blog/update', {title: "포스트 수정하기", page: page, data: resultData,id:id});

        });
    }
    else
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
    }
});

router.post('/:id/update/:num/:page', function (req, res, next)
{
    if (functions.isSessionSet(req))
    {
        var id = req.session.user_id;
        var num = req.params.num;
        var page = req.params.page;
        blog.updatePostData(req, num, function (resultData)
        {
            console.log('resultData : ', resultData);

            res.redirect('/blog/'+id+'/list/'+page);

        });
    }
    else
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
    }
});

router.post('/:id/delete/:num/:page',function(req,res,next)
{
    if (!functions.isSessionSet(req))
    {
        res.send(functions.getAlertScriptAndGoRootBecauseLoginFalse());
        return ;
    }

    blog.deletePost(req,function(result)
    {
        var id = req.session.user_id;
        var page = req.params.page;
        if(result.result == "success")
        {
            console.log("글 삭제 결과 result : ",result);
            res.redirect('/blog/'+id+'/list/'+page);
        }
    });

});

module.exports = router;
