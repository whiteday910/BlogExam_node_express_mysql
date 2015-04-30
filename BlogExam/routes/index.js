var express = require('express');
var router = express.Router();
var member = require('../models/member');
var functions = require('../functions');

/* GET home page. */
router.get('/', function (req, res, next)
{
    member.getUserIds(function(data)
    {
        var id = req.session.user_id;
        res.render('index', {title: '김정휘 블로그 과제', data:data, id:id});
    });

});

router.post('/', function (req, res, next)
{
    var id = req.body.id;
    var pw = req.body.pw;

    functions.isDataEmpty([id, pw], ["아이디", "패스워드"], function (isEmptyResult)
    {
        if (isEmptyResult.result == "success")
        {
            member.isLoginSuccess([id, pw], function (result)
            {
                if (result.result == "success")
                {
                    req.session.user_id= id;
                    req.session.num= result.data.num;
                    req.session.name= result.data.name;
                    req.session.email= result.data.email;
                    res.redirect('/blog/'+id);
                }
                else
                {
                    res.send(functions.getAlertScriptString(result.message));
                }
            });
        }
        else
        {
            res.send(functions.getAlertScriptString(isEmptyResult.message));
        }

    });
});

module.exports = router;