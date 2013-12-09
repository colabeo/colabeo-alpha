var disableNow = false;
var curCallID;
var curUrl = "";

var raw_html='<li class="user ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c" browserid="[tag1]" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a class="ui-link-inherit"><img src="[tag2]" class="ui-li-thumb"><h3 class="ui-li-heading">[tag3]</h3><p class="ui-li-desc">[tag4]</p><div class="socialbuttons"></div></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';

// [tag1]   -   browserID(berryID)
// [tag2]   -   image link
// [tag3]   -   full name
// [tag4]   -   description
/*
function refleshContacts(people) {
    var self=this;
    console.log('reflesh contacts called');
    $(".user").off('click');    //de-attach events

    var html_content="";
    for(var i in people) {  //enum people list and generate html content
        // console.log("var " + i+" = "+people[i]);
        var cooked_html='';
        if (!people[i].handle)
            continue;

        // TODO: Generates something like: "ym00000,fb111111"
        var browser_id=0000;
        if (people[i].handle.yammer)
            browser_id='ym' + people[i].handle.yammer;
        else if (people[i].handle.facebook)
            browser_id='fb' + people[i].handle.facebook;

        cooked_html=raw_html.replace("[tag1]", browser_id);
        cooked_html=cooked_html.replace("[tag2]", people[i].avatar);
        cooked_html=cooked_html.replace("[tag3]", people[i].id);
        cooked_html=cooked_html.replace("[tag4]", people[i].description);
        html_content+=cooked_html;
    }

    $("#contactlist").html(html_content);

    //attach events
    $(".user").on('click', function(evt) {
        makeCall.call(self, evt);
    });

    function makeCall(evt) {
        curCallID = $(evt.currentTarget).attr('browserID');
        myID=curCallID;
        myName=$(evt.currentTarget).find(".ui-li-heading").text();
        console.log('browserID: ' + curCallID);
        console.log('person: ' + $(evt.currentTarget).find(".ui-li-heading").text());
        $('.incperson').text($(evt.currentTarget).find(".ui-li-heading").text());
        $('.incsocial').text("Yammer");

        parseBrowserID.apply(this, [curCallID, function(result) {
            if (result.colabeo) {
                myID=result.colabeo;    // Re-assign myID(ie:'ym000000000') to colabeoID.
                console.log(result);
                $("#showPopup").click();
                call(result.colabeo);
            }
            else {
                // TODO: The user is not an existing colabeo user, add your own logic abt what to do.
                // if (result.facebook) {...}
                console.log('The user you are calling is not an colabeo user, I don\'t know what to do.');
                console.log(result);
            }
        }]);
    }
    // check Firebase-index, find out the real Colabeo uid for this contact.
    function parseBrowserID(browserID, callback) {
        var result={};
        // TODO: Make it into a loop, in case our contact have multiple social networks
        var providerAbbr=browserID.substring(0,2);
        if (providerAbbr=='ym') {
            result.yammer=browserID.substring(2);
            this.indexRef.child('yammer').child(result.yammer).once('value', function(snapshot) {
                if (snapshot.val()) {
                    result.colabeo=snapshot.val();
                    callback(result);
                } else
                    callback(result);
            });
        }
        else if (providerAbbr=='fb') {
            result.facebook=browserID.substring(2);
            this.indexRef.child('facebook').child(result.facebook).once('value', function(snapshot) {
                if (snapshot.val()) {
                    result.colabeo=snapshot.val();
                    callback(result);
                } else
                    callback(result);
            });
        }
        else {
            result.colabeo=browserID;
            callback(result);
        }
    }
}
*/
function refleshContacts(people) {
    var self=this;
    console.log('reflesh contacts called');
    $(".user").off('click');    //de-attach events

    var html_content="";
    for(var i in people) {  //enum people list and generate html content
        // console.log("var " + i+" = "+people[i]);
        var cooked_html='';
        if (people[i].handle) {
            // TODO: Generates something like: "ym00000,fb111111"
            var browser_id=0000;
            if (people[i].handle.yammer)
                browser_id='ym' + people[i].handle.yammer;
            else if (people[i].handle.facebook)
                browser_id='fb' + people[i].handle.facebook;

            cooked_html=raw_html.replace("[tag1]", browser_id);
            cooked_html=cooked_html.replace("[tag2]", people[i].avatar);
            cooked_html=cooked_html.replace("[tag3]", people[i].id);
            cooked_html=cooked_html.replace("[tag4]", people[i].description);
            html_content+=cooked_html;
        } else {
            // email invitation
            var fullName = people[i].firstname + ' ' + people[i].lastname;
            var avatar = "https://mug0.assets-yammer.com/mugshot/images/48x48/no_photo.png";
            cooked_html=raw_html;
            cooked_html=cooked_html.replace("[tag2]", avatar);
            cooked_html=cooked_html.replace("[tag3]", fullName);
            cooked_html=cooked_html.replace("[tag4]", people[i].email);
            html_content+=cooked_html;
        }
    }

    $("#contactlist").html(html_content);

    //attach events
    $(".user").on('click', function(evt) {
        makeCall.call(self, evt);
    });

    function makeCall(evt) {
        curCallID = $(evt.currentTarget).attr('browserID');
        var myID=curCallID;
        var myName=$(evt.currentTarget).find(".ui-li-heading").text();
        console.log('browserID: ' + curCallID);
        console.log('person: ' + $(evt.currentTarget).find(".ui-li-heading").text());
        $('.incperson').text($(evt.currentTarget).find(".ui-li-heading").text());
        $('.incsocial').text("Yammer");

        parseBrowserID.apply(this, [curCallID, function(result) {
            if (result.colabeo) {
                myID=result.colabeo;    // Re-assign myID(ie:'ym000000000') to colabeoID.
                console.log(result);
                $("#showPopup").click();
                call(result.colabeo);
            }
            else {
                // TODO: The user is not an existing colabeo user, add your own logic abt what to do.
                // if (result.facebook) {...}
                console.log('The user you are calling is not an colabeo user, I don\'t know what to do.');
                console.log(result);
            }
        }]);
    }
    // check Firebase-index, find out the real Colabeo uid for this contact.
    function parseBrowserID(browserID, callback) {
        var result={};
        if (!browserID) {
            result.colabeo = getUserID();
            callback(result.colabeo);
            return;
        }
        // TODO: Make it into a loop, in case our contact have multiple social networks
        var providerAbbr=browserID.substring(0,2);
        if (providerAbbr=='ym') {
            result.yammer=browserID.substring(2);
            this.indexRef.child('yammer').child(result.yammer).once('value', function(snapshot) {
                if (snapshot.val()) {
                    result.colabeo=snapshot.val();
                    callback(result);
                } else
                    callback(result);
            });
        }
        else if (providerAbbr=='fb') {
            result.facebook=browserID.substring(2);
            this.indexRef.child('facebook').child(result.facebook).once('value', function(snapshot) {
                if (snapshot.val()) {
                    result.colabeo=snapshot.val();
                    callback(result);
                } else
                    callback(result);
            });
        }
        else {
            result.colabeo=browserID;
            callback(result);
        }
    }
}

function BerryBase(FirebaseURL, userID) {
    this.Firebase=FirebaseURL;
    this.userID=userID;
    this.FirebaseRef=new Firebase(FirebaseURL);
    this.FirebaseUserRef=this.FirebaseRef.child('users');
    this.FirebaseMyRef=this.FirebaseUserRef.child(userID);
    this.indexRef=this.FirebaseRef.child('index');
}

// callback will usually be the function thats altering html page
BerryBase.prototype.getContacts = function(callback)
{
    var self=this;
    this.ContactsRef = this.FirebaseMyRef.child('contacts');
    this.ContactsRef.on('value', function(snapshot) {
        if (snapshot.name()=='contacts') {
            console.log(snapshot.val());
            callback.call(self, snapshot.val());
        } else {
            console.log("On "+ self.userID + ", no contacts found!");
        }
    });
}

//=================================================================

function getUserID() {
    return $('#userId').attr('data-value');
}

function getUserFullName() {
    return $('#userFirstName').attr('data-value') + ' ' + $('#userLastName').attr('data-value');
}

function GetURLParameter(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}


//register contact list click event
$(document).ready(function() {
    var userID=getUserID();
    console.log('userId: ' + userID);
    myBerry = new BerryBase('https://koalalab-berry.firebaseio.com/', userID);
    myBerry.getContacts(refleshContacts);

    var userFullName = getUserFullName();

    $('.ui-input-text.ui-body-c').attr('placeholder', 'Welcome, ' + userFullName.split(' ')[0] + '!');

    $('#saveContactBtn').click( function(e) {
        e.preventDefault();
        $.ajax({
            url: '/contacts/add',
            type: 'post',
            dataType: 'json',
            data: $('#addContactForm').serialize(),
            success: function(data) {
                console.log("success");
                $( "#popupAddContact" ).popup( "close" );
            }
        });
    });

    $("#answer").on('click', function(evt) {
        answer();
    });

    $(".endBtn").on('click', function(evt) {
        removeVideoChat();
        if (curCallID)
            hangup(curCallID);
        curCallID = "";
    });
    setTimeout(function() {
        var userId = getUserID();
        var userFullName = getUserFullName();
        sendMessage("event", {data: {action:"syncID", id: userId, name: userFullName}});
    }, 3000);
    $(".syncBtn").on('click', function(evt) {
        sendMessage("event", {data: {action:"sync"}});
    });

    $("#acceptBtn").on('click', function() {
        setTimeout(answer, 600);
    });

    $("#declineBtn").on('click', function() {
        var userId = getUserID();
        if (userId)
            hangup(userId);
    });

    $("#gotoBtn").on('click', function(evt) {
        var url = $('#url');
        if (url.val() != '') {
            sendMessage("event", {
                url : url.val(),
                action : 'urlChange'
            });
            $('.urlList ul').append('<li><a class="urlListBtn">' + url.val() + '</a></li>');
            $('.urlList ul').listview('refresh');
            url.val('');
        }
    });
});

//for jQuery mobile event
$(document).on('pageinit', function(e) {
    $("#url").keydown(function(e) {
        if (e.keyCode == 13) {
            $("#gotoBtn").click();
        }
    });

    $(".urlList").on('click', function(evt) {
        console.log(evt.target.text);
        demobo.mobile.fireInputEvent('gotoUrl', evt.target.text);
    });
});

function call(outgoingId) {
    var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
    var userId = getUserID();
    var userFullName = getUserFullName();
    outgoingCallRef.push({
        name : userId,
        person : userFullName
    });
    outgoingCallRef.on('child_removed', function(snapshot) {
        var callerId = snapshot.val()['name'];
        if (callerId == userId) {
            if ($('#popup:visible')[0] && !$('#chatContainer')[0])
                injectVideoChat(snapshot.name());
        } else {
            $(".endBtn").click();
        }
    });
}

function hangup(outgoingId) {
    var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
    outgoingCallRef.remove();
}
function answer() {
    var userId = getUserID();
    var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + userId);
    outgoingCallRef.remove();
    outgoingCallRef.on('child_removed', function(snapshot) {
        var roomID = snapshot.name();
        if ($('#popup:visible')[0] && !$('#chatContainer')[0]) {
            injectVideoChat(roomID);
        }
    });
}

function injectVideoChat(roomId) {
    if (!document.getElementById('chatContainer')) {
        var e = document.createElement('div');
        e.id = 'chatContainer';
        e.style.position = 'fixed';
        e.style.bottom = '30px';
        e.style.right = '0px';
        e.style.zIndex = '999';
        document.getElementById('popup').appendChild(e);
    }
    var i = document.createElement('iframe');
    i.src = 'https://koalabearate.appspot.com/?r=' + roomId;
    i.className = 'videoChatFrame';
    i.id = roomId;
    i.style.width = '100%';
    document.getElementById('chatContainer').appendChild(i);
}

function removeVideoChat() {
    $('#chatContainer').remove();
}

function sendMessage(type, data) {
    if (!demoboBody)
        return;
    var evt = new CustomEvent("FromKoala", {
        detail : {
            type : type,
            data : data
        }
    });
    demoboBody.dispatchEvent(evt);
}

function onExtensionMessage(e) {
    if (disableNow) return;
    console.log("onExtensionMessage: ", e.detail);
    if (e.detail.type == "urlUpdate") {
        curUrl = e.detail.data.url;
    }
    else if (e.detail.action == "incoming")	{
        setCallerInfo({fromPerson: e.detail.person, fromSocial: e.detail.social});
    }
    else if ($(".videoChatFrame")[0]) {
        $(".videoChatFrame")[0].contentWindow.postMessage(JSON.stringify(e.detail), "*");
    }
}

function onRemoteMessage(e) {
    var cmd = JSON.parse(evt.data);
    console.log("onRemoteMessage: ", e.detail);
}

addEventListener("message", function(e) {
    disableNow = true;
    setTimeout(function(){
        disableNow = false;
    },1000);
    var evt = JSON.parse(e.data);
    console.log("onRemoteMessage: ", evt);
    sendMessage("event", evt);
}, false);

function setCallerInfo(args) {
    $('.incperson').text(args.fromPerson);
    $('.incsocial').text(args.fromSocial);
    window.location = "#p";
}