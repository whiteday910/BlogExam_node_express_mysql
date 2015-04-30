////  jquery 객체를 받아서 val 확인
function isDataEmpty(obj, errMessage)
{
    var isEmpty = true;
    if(obj.val().trim() == "")
    {
        obj.focus();
        isEmpty = true;
        alert(errMessage);

    }
    else
    {
        isEmpty = false;
    }
    return isEmpty;

}

function bindingEnterKey(txtFieldObj,mappingBtnObj)
{
    txtFieldObj.keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    txtFieldObj.keyup(function (e) {
        if (e.keyCode == 13)
        {
            e.preventDefault();
            if(!(typeof mappingBtnObj === "undefined"))
            {
                mappingBtnObj .click();
            }

        }
    });
}

