
function setPushProfile() {
    var pushTagList = document.querySelector('#pushTagList').value;
    if (pushTagList != "") {
        window.localStorage.setItem('pushTags', pushTagList);
    }
}

function getPushProfile() {
    var pushTags = "";
    if (localStorage["pushTags"]) { 
        pushTags = window.localStorage.getItem('pushTags');
    }
    return pushTags;
}

function getPushToken() {
    var pushToken = "";
    if (localStorage["pushToken"]) {
        pushToken = window.localStorage.getItem('pushToken');
    }
    return pushToken;
}

function resetPushCount() {
    window.localStorage.setItem('pushCount', '');
    if (navigator.clearAppBadge) {
        // Remove the badge on the app icon.
        navigator.clearAppBadge();
    }
}