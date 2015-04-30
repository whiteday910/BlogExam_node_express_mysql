exports.isDataEmpty = function(arrayOfData, paramNames, callback)
{
    if(arrayOfData.length==0)
    {
        return callback({result : "fail" , message : "데이터 배열의 길이가 0입니다."});
    }

    if(arrayOfData.length != paramNames.length )
    {
        return callback({result : "fail" , message : "데이터와 파라미터 수의 숫자가 일치하지 않습니다.  데이터 갯수  : "+arrayOfData.length+"  /   파라미터 갯수 : "+paramNames.length});
    }

    for(var i=0; i < arrayOfData.length; i++)
    {
        var oneString =  arrayOfData[i];
        if( (typeof oneString).toLowerCase() != "string"  ||   oneString.trim() == "" )
        {
            return callback({result : "fail" , message : paramNames[i]+" 의 값이 비어있습니다.  해당 값은 현재 : "+oneString+" 입니다."});
        }
    }

    return callback({result : "success" , message : "성공~"});

};

exports.getAlertScriptString = function(message)
{
    return "<script>alert('"+message+"');history.back();</script>";
};

exports.getAlertScriptAndGoRootBecauseLoginFalse = function()
{
    return "<script>alert('로그인되지 않았습니다. 홈으로 돌아갑니다.');location.href='/';</script>";
};

exports.isSessionSet = function(req)
{
    if(typeof req.session.name === "undefined")
        return false;

    return true;
};

exports.isLoginAndLookOtherBloger = function(req)
{
    if(typeof req.session.name === "undefined")
        return false;

    var blogerId = req.params.id;
    var loginId = req.session.user_id;
    console.log('blogerId : ',blogerId);
    console.log('loginId : ',loginId);
    if(blogerId != loginId) return true;
    else return false;
};

exports.getImageUrl = function(req)
{

    var image = req.files;
    if( typeof image.image === "undefined")
    { return ;}
    var imageName = image.image.name;
    var uploadPath = "/images/upload/";
    var lastImagePath =uploadPath+imageName;

    return lastImagePath;
}