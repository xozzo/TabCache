/* INITIALIZATION */
var navCaches = document.getElementById("nav-caches");
var contentCaches = document.getElementById("caches");
var navSettings = document.getElementById("nav-settings");
var contentSettings = document.getElementById("settings");
var navAbout = document.getElementById("nav-about");
var contentAbout = document.getElementById("about");

generateCacheList();

//Display cache tab by default
contentCaches.style.display = "block";
navCaches.className += "active";

/* CONTENT DISPLAY LOGIC */
var nav = document.getElementById("nav");
nav.onclick = function(event) {
    //Remove nav tab focus
    navCaches.classList.remove("active");
    navSettings.classList.remove("active");
    navAbout.classList.remove("active");

    //Hide all content divs
    var contentDivs =
        document.getElementById("content-container").querySelectorAll("#content-container > div");
    for (var i=0; i<contentDivs.length; i++) {
        contentDivs[i].style.display = 'none';
    }

    //Display content and set nav tab focus
    switch(event.target.id) {
        case "nav-caches":
            contentCaches.style.display = "block";
            navCaches.className += "active";
            generateCacheList();
            break;
        case "nav-settings":
            contentSettings.style.display = "block";
            navSettings.className += "active";
            updateStorageUsed();
            break;
        case "nav-about":
            contentAbout.style.display = "block";
            navAbout.className += "active";
            break;
    }
}

/* CACHES */
var searchCache = document.getElementById("searchCache");
searchCache.onkeyup = function() {
    //search for cache algorithm here
    console.log("keystroke registered");
}

function generateModal(cacheName, callback) {
    var modalId = "modal-" + cacheName.replace(/ /g,"-");
    var container = $("<div><h1>" + cacheName + "</h1></div>");
    container.attr({
        "id": modalId,
        "class": "lightbox"
    });
    callback(container);
}

function generateCacheList() {
    chrome.storage.local.get("caches", function(storage) {
        var caches = storage["caches"];
        var cacheList = $("#cache-list");
        cacheList.html("");

        if(typeof caches == "undefined") {
            cacheList.html("Oops! It looks like you don't have any caches yet.");
        } else {
            //Iterate over cache storage array and generate a list item for each cache
            for(var i=caches.length-1; i>=0; i--) {
                var cache = caches[i];

                var modalId = "#modal-" + cache.name.replace(/ /g,"-");
                var listItem = $("<li></li>");
                listItem.attr({
                    "class": "cacheListItem",
                    "title": "See cache details",
                    "data-featherlight": modalId
                });

                var cacheLink = $("<a>" + cache.name + "</a>");
                cacheLink.attr({
                    "id": cache.name.replace(/ /g,"-"),
                    "class": "cache-link",
                    "title": "Open this cache"
                });
                cacheLink.featherlight({
                    afterOpen: function(event) {
                        $.featherlight.current().close();
                    }
                });

                var metaText = $("<span>Created on: " + Cache.getReadableCreated(cache) + "</span>");
                metaText.attr({
                    "class": "cache-meta"
                });

                generateModal(cache.name, function(modal) {
                    $("body").append(modal);
                });

                listItem.append(cacheLink);
                listItem.append(metaText);
                cacheList.append(listItem);
            }
        }
    });
}

$(function() {
    $.featherlight.autoBind;

    //Click handler for hyperlinks on cache list
    $("#cache-list a").each(function() {
        $(this).on('click', function() {
            openCache(this.id);
        });
    });
})
/* END CACHES */

/* SETTINGS */
function updateStorageUsed() {
    chrome.storage.local.getBytesInUse("caches", function(bytes) {
        document.getElementById("storage-used").innerHTML = bytes;
    });
}

var removeAll = document.getElementById("removeAll");
removeAll.onclick = function(event) {
    alertify
        .confirm("Are you sure you want to clear all caches? This action cannot be undone.",
        function() { //success
            console.log("User clicked yes. Remove caches!");
            removeAllCaches();
        }, null); //do nothing if cancel
}
/* END SETTINGS */
