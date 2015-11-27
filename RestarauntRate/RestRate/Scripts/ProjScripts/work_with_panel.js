﻿var restaurants = []; //temporary restaurants 
var testRest = [
    { Name: "Test0", adress: "TestAdress0", stars: 1 },
    { Name: "Test1", adress: "TestAdress1", stars: 2 },
    { Name: "Test2", adress: "TestAdress2", stars: 3 },
    { Name: "Test3", adress: "TestAdress3", stars: 4 },
    { Name: "Test4", adress: "TestAdress4", stars: 5 },
    { Name: "Test5", adress: "TestAdress5", stars: 1 },
    { Name: "Test6", adress: "TestAdress6", stars: 2 },
    { Name: "Test7", adress: "TestAdress7", stars: 3 },
    { Name: "Test8", adress: "TestAdress8", stars: 4 },
    { Name: "Test9", adress: "TestAdress8", stars: 5 }
];
var minRad = 700;
var maxRad = 2000;
var panel;
//var state = { color: "rgba(55, 47, 45,0.4)", marginLeft: "0%" }
var prevItem;
var availabletypes = ["restaurant", "bar", "cafe"];

//TODO implement scrollbar to review panel 
function panelInit() {

    panel = $(".mainpanel");
    prevItem = $(".panel-item").first();
    nearbyMarkerSearch(minRad);

    // Scroll init
    $(".content").mCustomScrollbar({
        theme: "rounded-dots-dark",
        scrollInertia: 100,
        scrollButtons: {
            enable: true
        }
    });

    $("#orderByRating").click(function () {
        restaurantsSort();
        clearPanel();
        restaurants.forEach(function(el) {
            addToPanel(el); 
        });
    });
   
    $("#getFullList").click(function() {
        citySearch();
    });
   
    $("#showReview").click(toggleReview);
    //TODO pick search lang
};
//TODO :add filling logic for review panel;
//TODO tost for not active revision action; finish review toggle logic 
function toggleReview() {
    if (isDragging) {
    } else {
        var activeEl = getActivePanelElement();
        if (!!activeEl) {
            
            $("#review").slideToggle();
        } else {
            $("#review").slideUp();
        }
    }
}
function citySearch() {
    // TODO city search - get all restaurants;
    //nearbyMarkerSearch(maxRad); 
    for (var j = 0; j < 3; j++) {
        restaurants = restaurants.concat(testRest);
    }
        restaurants.forEach(function(el) {
            addToPanel(el);
        });
    
}
function nearbyMarkerSearch(r) {
    restaurants = [];
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        
        location: marker.getPosition(),
        radius: r,
        types: availabletypes
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearPanel();
            for (var i = 0; i < results.length; i++) {
                var request = { reference: results[i].reference };
                service.getDetails(request, function (details, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        var tmpItem = {
                            Name: details.name,
                            stars: (details.rating === undefined) ? 0 : details.rating,
                            adress: details.address_components[1].long_name + ", " + details.address_components[0].long_name//.replace("вулиця","")
                        };
                        restaurants.push(tmpItem);
                        addToPanel(tmpItem);
                    }
                   
                });
                //TODO make async sort
               // restaurantsSort();
            }
        }
    });
}

function togglePanel(e) {
    {
        var target = $(e.target).closest(".panel-item");
        if (target.length === 0) {
            target = $(e.target).closest(".panel-item-w");
        }

        if (target.hasClass('panel-item-w')) {
            target.removeClass('panel-item-w');
            target.addClass('panel-item');
        } else {
            prevItem.removeClass('panel-item-w');
            prevItem.addClass("panel-item")
            target.removeClass("panel-item");
            target.addClass('panel-item-w');
        }
        //if (target.css("background-color") === "rgb(255, 255, 255)") {
        //    target.css("background-color", state.color);
        //    target.css("margin-left", state.marginLeft);

        //} else {
        //    prevItem.css("background-color", state.color);
        //    prevItem.css("margin-left", state.marginLeft);
        //    target.css("background-color", "white");
        //    target.css("margin-left", "12%");
        //}
        prevItem = target;
    }
}
function restaurantsSort()
{
     restaurants.sort(function (a, b) {
                    //console.log("calling async");
                    return b.stars - a.stars;
                });
}
function clearPanel() {
    $(".panelItems>*").remove();
}
function addToPanel(item) {
    var stars = "<div>";
    for (var j = 0; j < 5; j++) {
        if (j < item.stars) {
            stars += "<span><img style =\"width:20px\"; src =\"/Content/Images/Customer/starIcon.png\">" + "</span>";
        } else {
            stars += "<span><img style =\"width:20px\"; src =\"/Content/Images/Customer/starIcon-empty.gif\">" + "</span>";
        }
    }
    stars += " </div>";
    var adress = "<div>" + item.adress + " </div > ";
    var name = "<div>" + item.Name + " </div > ";
    var src = "<div class=\"panel-item\">" + stars + name + adress + "</div>";
    var $item = $(src);
    $item.click(togglePanel);
    $(".panelItems").append($item);
}

function getActivePanelElement() {
    if (prevItem.hasClass("panel-item-w")) {
        return prevItem;
    } else {
        return null;
    }

}

// test 