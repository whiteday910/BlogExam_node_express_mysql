// Content Contact Form
$(function () {
    $('#af-form .error').hide();
    $('#af-form .text-input').css({backgroundColor:"#FFFFFF"});
    $('#af-form .text-input').focus(function () {
        $(this).css({backgroundColor:"#FCFCFC"});
    });
    $('#af-form .text-input').blur(function () {
        $(this).css({backgroundColor:"#FFFFFF"});
    });

    $("#af-form .form-button").click(function () {
        // validate and process form
        // first hide any error messages
        $('#af-form .error').hide();

        var name = $("#af-form input#name").val();
        if (name == "" || name == "Name") {
            $("#af-form label#name_error").show();
            $("#af-form input#name").focus();
            return false;
        }
        var email = $("#af-form input#email").val();
        var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
        console.log(filter.test(email));
        if (!filter.test(email)) {
            $("#af-form label#email_error").show();
            $("#af-form input#email").focus();
            return false;
        }
        var message = $("#af-form #input-message").val();
        if (message == "") {
            $("#af-form label#message_error").show();
            $("#af-form #input-message").focus();
            return false;
        }

        var dataString = 'name=' + name + '&email=' + email + '&message=' + message;
        //alert (dataString);return false;

        $.ajax({
            type:"POST",
            url:"assets/php/contact-form.php",
            data:dataString,
            success:function () {
                $('#af-form').prepend("<div class=\"alert alert-success fade in\"><button class=\"close\" data-dismiss=\"alert\" type=\"button\">&times;</button><strong>Contact Form Submitted!</strong> We will be in touch soon.</div>");
                $('#af-form')[0].reset();
            }
        });
        return false;
    });
});

// Get Quote Form
$(function () {
    $('#af-form-gq .error').hide();
    $('#af-form-gq .text-input').css({backgroundColor:"#FFFFFF"});
    $('#af-form-gq .text-input').focus(function () {
        $(this).css({backgroundColor:"#FCFCFC"});
    });
    $('#af-form-gq .text-input').blur(function () {
        $(this).css({backgroundColor:"#FFFFFF"});
    });

    $("#submit_btn_gq").click(function () {
        // validate and process form
        // first hide any error messages
        $('#af-form-gq .error').hide();

        var name = $("#af-form-gq input#name-gq").val();
        if (name == "" || name == "Name") {
            $("#af-form-gq label#name_error_gq").show();
            $("#af-form-gq input#name-gq").focus();
            return false;
        }
        var email = $("#af-form-gq input#email-gq").val();
        var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
        console.log(filter.test(email));
        if (!filter.test(email)) {
            $("#af-form-gq label#email_error_gq").show();
            $("#af-form-gq input#email-gq").focus();
            return false;
        }
        var phone = $("#af-form-gq input#phone-gq").val();
        if (phone == "" || name == "Phone") {
            $("#af-form-gq label#phone_error_gq").show();
            $("#af-form-gq input#phone-gq").focus();
            return false;
        }
        var message = $("#af-form-gq #input-message-gq").val();
        if (message == "") {
            $("#af-form-gq label#message_error_gq").show();
            $("#af-form-gq #input-message-gq").focus();
            return false;
        }

        var dataString = 'name=' + name + '&email=' + email + '&phone=' + phone + '&message=' + message;
        //alert (dataString);return false;

        $.ajax({
            type:"POST",
            url:"assets/php/get-quote.php",
            data:dataString,
            success:function () {
                $('#af-form-gq').prepend("<div class=\"col-sm-12 \"><div class=\"alert alert-success fade in\"><button class=\"close\" data-dismiss=\"alert\" type=\"button\">&times;</button><strong>Your request send!</strong> We will be in touch soon.</div></div>");
                $('#af-form-gq')[0].reset();
            }
        });
        return false;
    });
});