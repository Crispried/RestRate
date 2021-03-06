﻿var _options = {
    input: null,
    minLength: 0,           // Modified feature, now accepts 0 to search on focus
    maxItem: 100,             // Modified feature, now accepts 0 as "Infinity" meaning all the results will be displayed
    dynamic: false,
    delay: 300,
    order: "asc",            // ONLY sorts the first "display" key
    offset: false,
    hint: true,            // -> Improved feature, Added support for excessive "space" characters
    accent: false,
    highlight: true,
    group: false,           // -> Improved feature, Array second index is a custom group title (html allowed)
    groupOrder: null,       // -> New feature, order groups "asc", "desc", Array, Function
    maxItemPerGroup: null,  // -> Renamed option
    dropdownFilter: false,  // -> Renamed option, true will take group options string will filter on object key
    dynamicFilter: null,    // -> New feature, filter the typeahead results based on dynamic value, Ex: Players based on TeamID
    backdrop: false,
    cache: sessionStorage,           // -> Improved option, true OR 'localStorage' OR 'sessionStorage'
    ttl: 3600000,
    compression: false,     // -> Requires LZString library
    suggestion: false,      // -> *Coming soon* New feature, save last searches and display suggestion on matched characters
    searchOnFocus: true,   // -> New feature, display search results on input focus
    resultContainer: null,  // -> New feature, list the results inside any container string or jQuery object
    generateOnLoad: false,   // -> New feature, forces the source to be generated on page load even if the input is not focused!
    mustSelectItem: true,  // -> New option, the submit function only gets called if an item is selected
    href: null,             // -> New feature, String or Function to format the url for right-click & open in new tab on link results
    display: ["Name", "Address"],   // -> Improved feature, allows search in multiple item keys ["display1", "display2"]
    template:   '<span>' +
                    '<span class="name"><b>{{Name}}</b></span><br />' +
                    '<span class="location"><i>{{Address}}</i></span>' +
                '</span>',
    emptyTemplate: function (query) {
        if (query.length > 0) {
            return 'No results found for "' + query + '"';
        }
    },
    correlativeTemplate: false, // -> New feature, compile display keys, enables multiple key search from the template string
    source: {
        url: [{
            type: "POST",
            url: "/Admin/GetRestaraunts",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
        }, "result"]
    },
    callback: {
        onInit: null,
        onReady: null,      // -> New callback, when the Typeahead initial preparation is completed
        onSearch: null,     // -> New callback, when data is being fetched & analyzed to give search results
        onResult: null,
        onLayoutBuiltBefore: null,  // -> New callback, when the result HTML is build, modify it before it get showed
        onLayoutBuiltAfter: null,   // -> New callback, modify the dom right after the results gets inserted in the result container
        onNavigate: null,   // -> New callback, when a key is pressed to navigate the results
        onMouseEnter: null,
        onMouseLeave: null,
        onClickBefore: null,// -> Improved feature, possibility to e.preventDefault() to prevent the Typeahead behaviors
        onClickAfter: null, // -> New feature, happens after the default clicked behaviors has been executed
        onSendRequest: null,// -> New callback, gets called when the Ajax request(s) are sent
        onReceiveRequest: null,     // -> New callback, gets called when the Ajax request(s) are all received
        onSubmit: null,
        onClick: function (node, a, obj, e) {
            var preview = '';
            var previewConfig = [];
            var counter;
            $.ajax({
                url: "/Admin/GetRestarauntInfo",
                type: "POST",
                data: JSON.stringify({ 'restarauntID': parseInt(obj['RestarauntID']) }),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (answer) {
                    $("input").removeClass("incorrect_data");
                    $("textarea").removeClass("incorrect_data");
                    if (answer['result']['Images'].length > 0) {
                        counter = answer['result']['Images'].length;
                        for (i = 0; i < counter; i++) {
                            preview += "<img style='height:160px' src='" + answer['result']['Images'][i]['Url'] + "'>,\n"
                            previewConfig[i] = { caption: answer['result']['Images'][i]['Name'], url: "/Admin/imageDelete", key: i }
                        };
                        $("#photosInput").fileinput('refresh', {
                            initialPreview: [preview],
                            initialPreviewConfig: previewConfig
                        });
                    }
                    else {
                        $("#photosInput").fileinput('refresh', {
                            initialPreview: []
                        });
                    }
                    $('#gridSystemModalLabel').val("Editting restaurant");
                    $('#RestID').val(obj['RestarauntID']);
                    $('#Longtitude').val(answer['result']['Longitude']);
                    $('#Latitude').val(answer['result']['Latitude']);
                    $('#formRestName').val(answer['result']['Name']);
                    $('#formRestAddr').val(answer['result']['Address']);
                    $('#formRestLocation').val(answer['result']['Locality']);
                    $('#formRestRegion').val(answer['result']['Region']);
                    $('#formRestCountry').val(answer['result']['Country']);
                    $('#formKitchenRate').rating('update', answer['result']['KitchenRate']);
                    $('#formServiceRate').rating('update', answer['result']['MaintenanceRate']);
                    $('#formInteriorRate').rating('update', answer['result']['InteriorRate']);
                    $('#formReview').val(answer['result']['Review']);
                    updateCountdown();
                    if (!$('button').hasClass('btn-danger')) {
                        $('<button type="button" class="btn btn-danger" id="removeRestaurant">Delete</button>').appendTo('#addEditRestaurant');
                    }
                    $(".addRestaurant").unbind();
                    $('.addRestaurant').removeClass('addRestaurant').addClass("editRestaurant");
                    $("#myModal").modal({ backdrop: "static" });

                    $(".editRestaurant").bind("click", function () {
                        var restId = $('#RestID').val();
                        var restName = $('#formRestName').val();
                        var restAddress = $('#formRestAddr').val();
                        var restLocation = $('#formRestLocation').val();
                        var restRegion = $('#formRestRegion').val();
                        var restCountry = $('#formRestCountry').val();
                        var restKitchenRate = $('#formKitchenRate').val();
                        var restServicerate = $('#formServiceRate').val();
                        var restInteriorRate = $('#formInteriorRate').val();
                        var restReview = $('#formReview').val();
                        $.ajax({
                            url: "/Admin/EditRestaurant",
                            type: "POST",
                            data: JSON.stringify(
                                {
                                    'RestarauntData': { "KitchenRate": restKitchenRate, "MaintenanceRate": restServicerate, "InteriorRate": restInteriorRate, 'RestaurantID': parseInt(restId) },
                                    'RestaurantLangData': { "Name": restName, "Address": restAddress, "Locality": restLocation, "Region": restRegion, "Country": restCountry, "Review": restReview }
                                }
                            ),
                            contentType: "application/json; charset=utf-8",
                            dataType: 'json',
                            beforeSend: function () {
                                $(".addRestaurant").prepend("<i class='fa fa-spinner fa-spin' id='spiner'></i> ");
                                $(".btn, input").prop("disabled", true);
                            },
                            success: function (answer) {
                                if (answer['result'] == 'success') {
                                    document.cookie = "id" + "=" + answer['id'] + "; "; // TODO coockie выдавать на ~60 секунд
                                    setTimeout($('#photosInput').fileinput('upload'), 2000);
                                    $(".btn, input").prop("disabled", false);
                                    informationWindow('Edditing was successful!', 'Restaraunt was eddited successfully!');
                                }
                                else {
                                    $(".btn, input").prop("disabled", false);
                                    informationWindow('Edditing failed!', 'Restaurant edditing was failed.');
                                }
                            },
                            error: function () {
                                $(".btn, input").prop("disabled", false);
                                informationWindow('Edditing failed!', 'Unknown error!\nMaybe DB is not working now. Please, try again later.');
                            },
                            timeout: 10000
                        });
                    });
                },
                error: function () {
                    $(".btn, input").prop("disabled", false);
                    informationWindow('Edditing failed!', 'Unknown error!\nMaybe DB is not working now. Please, try again later.');
                },
                timeout: 7000
            });
        }
    },
    selector: {
        container: "typeahead-container",
        //group: "typeahead-group",
        result: "typeahead-result",
        list: "typeahead-list",
        //display: "typeahead-display",
        query: "typeahead-query",
        //filter: "typeahead-filter",
        //filterButton: "typeahead-filter-button",
        //filterValue: "typeahead-filter-value",
        //dropdown: "typeahead-dropdown",
        //dropdownCarret: "typeahead-caret",
        button: "typeahead-button",
        backdrop: "typeahead-backdrop",
        hint: "typeahead-hint"
    },
    debug: false
};

$(document).ready(function () {
    $("#editRestName").typeahead(_options);

    $('.showAll').click(function (event) {
        if ($('.typeahead-container').hasClass('result')) {
            $("#editRestName").blur();
            $('.typeahead-container').removeClass("result").removeClass("hint").removeClass("backdrop");
            $(this).removeClass('hideAll');
        } else {
            $("#editRestName").focus();
            $(this).addClass('hideAll');
        }
    });

    $(document).on('click', "#removeRestaurant", function(){
        $.ajax({
            url: "/Admin/DeleteRestaurant",
            type: "POST",
            data: JSON.stringify(
                {
                    'RestarauntID': parseInt($('#RestID').val())
                }
            ),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            beforeSend: function () {
                $(".addRestaurant").prepend("<i class='fa fa-spinner fa-spin' id='spiner'></i> ");
                $(".btn, input").prop("disabled", true);
            },
            success: function (answer) {
                $(".btn, input").prop("disabled", false);
                if (answer['result'] == 'success') {
                    $('#myModal').modal('hide');
                }
                else {
                    $('body').addClass('modal-open');
                    informationWindow('Edditing failed!', 'Restaurant edditing was failed.');
                }
            },
            error: function () {
                $(".btn, input").prop("disabled", false);
                informationWindow('Adding failed!', 'Unknown error!\nMaybe DB is not working now. Please, try again later.');
            },
            timeout: 5000
        });
    });
});
