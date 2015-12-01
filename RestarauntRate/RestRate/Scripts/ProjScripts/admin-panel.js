﻿// Show modal form for change password
function changePassword() {
    $("#changePasswordForm").modal({ backdrop: "static" });
}

// Send post data to controller to change password
$("#changePassword").click(function () {
    var oldPass = $('#formOldPassword').val();
    var newPass = $('#formNewPassword').val();
    var newPassConfirm = $('#formNewPasswordConfirm').val();
   /* if (newPass != newPassConfirm) {
        informationWindow('Changing error!', "Password confirmation mismatch.\nPlease repeat you new password again.", { 'pass': '', 'confirm': '' });
    }*/
    //else {
    {
        $.ajax({
            url: "/Admin/ChangePassword",
            type: "POST",
            data: JSON.stringify({ "OldPassword": oldPass, "NewPassword": newPass }),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            beforeSend: function () {
                $("#changePassword").prepend("<i class='fa fa-spinner fa-spin' id='spiner'></i> ");
                $(".btn, input").prop("disabled", true);
            },
            success: function (answer) {
                if (answer['result'] == 'success') {
                    $(".btn, input").prop("disabled", false);
                    informationWindow('Changing successful!', answer['message']);
                }
                else {
                    $(".btn, input").prop("disabled", false);
                    informationWindow('Changing error!', answer['message']);
                }
            },
            error: function () {
                $(".btn, input").prop("disabled", false);
                informationWindow('Changing error!', 'Unknown error!\nMaybe DB is not working now. Please, try again later.');
            },
            timeout: 10000
        });
    }
});

// Show modal form to add new restaurant
$("#add").click(function () {
    if ($('#restName').val() == '') {
        informationWindow('Adding error!', 'Restaurant name field is empty! Please, enter a restaurant name before clicking "Add »"!', { 'restName': '' });
    }
    else {
        var name = $('#restName').val();
        $('#formRestName').val(name);
        $("#myModal").modal({ backdrop: "static" });
    }
});

// Send post data to controller to add new restaurant
//$('#addRestaurant').click(function () {
//    
//});

// Update countdown to show how mush symbols left
function updateCountdown() {
    var remaining = 500 - jQuery('#formReview').val().length;
    jQuery('.help-block').text(remaining + ' characters left.');
}

// Open map to add restaurant
function openMap() {
    // TODO!
    $(".modal-content").after("<div id='map'></div>");

    console.log("map is opened!");
}

// Open/close additional address fields
$(function () {
    $(document).on('click', '.btn-add', function (e) {
        $(this).removeClass('btn-add btn-success').addClass('btn-remove btn-danger').html('<span class="glyphicon glyphicon-minus"></span>');
        $("<div class='additionalAddress' style='display:none'>\
            <div class='row form-group'>\
                <label class='control-label col-md-3'>City:</label>\
                <div class='col-md-9'>\
                    <input class='form-control' placeholder='City' id='formRestCity' maxlength='80' type='text' value='Odessa' />\
                </div>\
            </div>\
            <div class='row form-group'>\
                <label class='control-label col-md-3'>Region:</label>\
                <div class='col-md-9'>\
                    <input class='form-control' placeholder='Region' id='formRestCity' maxlength='80' type='text' value='Odessa' />\
                </div>\
            </div>\<div class='row form-group'>\
                <label class='control-label col-md-3'>Country:</label>\
                <div class='col-md-9'>\
                    <input class='form-control' placeholder='Country' id='formRestCity' maxlength='80' type='text' value='Ukraine' />\
                </div>\
            </div>\
           </div>\
        ").insertAfter("#addressRestaurant");
        $(".additionalAddress").slideDown(1000);

    }).on('click', '.btn-remove', function (e) {
        $(this).removeClass('btn-remove btn-danger').addClass('btn-add btn-success').html('<span class="glyphicon glyphicon-plus"></span>');
        $(".additionalAddress").slideUp(1000, function () {
            $('.additionalAddress').remove();
        });
    });
});

// Count if char was entered to field
jQuery(document).ready(function ($) {
    updateCountdown();
    $('#formReview').change(updateCountdown);
    $('#formReview').keyup(updateCountdown);
});

$("#photosInput").fileinput({
    uploadUrl: '/admin/picture_upload.php', // you must set a valid URL here else you will get an error
    allowedFileExtensions: ['jpg', 'png', 'jpeg'],
    overwriteInitial: false,
    maxFileSize: 2000,
    maxFilesNum: 10,
    maxFileCount: 10,
});

var calculate = function () {
    var padding = ($(document).height() - $('.panel').outerHeight()) / 2;
    var min_padding = $('.navbar').outerHeight();
    if (padding < min_padding) {
        padding = min_padding + 5
    }
    return padding
}

$(window).resize(function () {
    $('.vertical-offset').css({
        top: calculate()
    });
    $(window).resize();
});

$(document).ready(function () {
    $('.vertical-offset').css({
        top: calculate()
    });
});
var x = document.cookie;
console.log(x);