/* Copyright 2023 biolithic. All rights reserved. */

// scbt_get_ functions get a value and return it to the function calling it
function scbt_get_chat_messages() {
  var divs = [];
  if (window.scbtZ) {
    var z = window.scbtZ.document.body.querySelectorAll('#items .yt-live-chat-item-list-renderer');
    if (z) {
      divs = z;
    }
  }
  return divs;
}


function scbt_get_chat_search_text() {
  var t = '';
  t = window.scbtChatSearchInputTextRef.value;
  if (t) {
    t = t.replace(/[^a-zA-Z0-9_\-@\s]/g, '');
    t = t.trim();
  }
  return t;
}


function scbt_get_classString_for_chat(obj) {
  var x = '';
  if (obj.sub === 1) {
    x = x + ' sub ';
  }
  if (obj.moderator === 1) {
    x = x + ' moderator ';
  }
  if (obj.owner === 1) {
    x = x + ' owner ';
  }
  if (obj.donation === 1) {
    x = x + ' donation ';
  }
  if (obj.newSub === 1) {
    x = x + ' newSub ';
  }
  if (obj.verified === 1) {
    x = x + ' verified vip ';
  }
  return x;
}


function scbt_get_classString_for_chat_replay(obj) {
  var x = '';
  if (obj[' VIP'] == 1) {
    x = x + ' verified vip ';
  }
  if (obj[' donation'] == 1) {
    x = x + ' donation ';
  }
  if (obj[' founder'] == 1) {
    x = x + ' founder ';
  }
  if (obj[' gifter'] == 1) {
    x = x + ' gifter ';
  }
  if (obj[' newSub'] == 1) {
    x = x + ' newSub ';
  }
  if (obj[' og'] == 1) {
    x = x + ' og ';
  }
  if (obj[' owner'] == 1) {
    x = x + ' owner ';
  }
  if (obj[' sub'] == 1) {
    x = x + ' sub ';
  }
  return x;
}


function scbt_get_clean_message(obj) {
  if (obj && obj.message) {
    obj.message = obj.message.toLowerCase();
    obj.message = obj.message.replace(/\/‘’‚“”„"`~«´<>/g, '');
    obj.message = obj.message.replaceAll(',', ' ');
    obj.message = obj.message.replaceAll("’", "");
    obj.message = obj.message.trim();
    if (obj.message.charAt(0) == '!') {
      obj.isBot = 1;
    }
  }
  return obj;
}


function scbt_get_clean_username(obj) {
  if (obj && obj.username) {
    obj.username = obj.username.toLowerCase();
    obj.username = obj.username.replace(/\/‘’‚“”„"`~«´<>/g, '');
    obj.username = obj.username.replaceAll(',', ' ');
    obj.username = obj.username.replace(':', '');
    obj.username = obj.username.trim();
    if ( ( obj.username.indexOf('bot') > -1 ) || ( obj.username == 'streamelements') || ( obj.username == 'streamlabs') || ( obj.username == 'tifa lockhart') || ( obj.username == 'oaty') || ( obj.username == 'glimboi') || ( obj.username == 'loeyalist') ) {
      obj.isBot = 1;
    }
  }
  return obj;
}


function scbt_get_csv_file_from_string(string) {
  if (string) {
    var csv_mime_type = 'text/csv';
    return new Blob([string], {type: csv_mime_type});
  }
}


function scbt_get_db(dbName, startSaving) {
  var x = result = store = e = error = null;
  if (dbName) { } else {
    console.error('Error: chat database not supported');
    setTimeout(function(){ scbt_helper_toast('Error: chat database not supported'); }, 2700);
    return false;
  }
  var request = window.indexedDB.open(dbName, 10);

  request.onsuccess = function (e) {
   if (startSaving == 'startSaving') {
    scbt_helper_chat_listen();
   }
   return request;
  };
  request.onerror = function (error) {
    scbt_handle_db_error_blocked(error);
    return error;
  };
  request.onblocked = function (error) {
    scbt_handle_db_error_blocked(error);
    return error;
  };
  request.onupgradeneeded = function(e) {
    if (!request.result) {
      scbt_handle_db_error_blocked(e); 
      return e;
    }
    var store = request.result.createObjectStore('chat', {
      keyPath: 'id',
      autoIncrement: true,
    });

    store.createIndex('itemid', 'itemid', {unique: false});
    store.createIndex('timestamp', 'timestamp', {unique: false});
    store.createIndex('username', 'username', {unique: false});
    store.createIndex('message', 'message', {unique: false});
    store.createIndex('sub', 'sub', {unique: false});
    store.createIndex('moderator', 'moderator', {unique: false});
    store.createIndex('owner', 'owner', {unique: false});
    store.createIndex('donation', 'donation', {unique: false});
    store.createIndex('newSub', 'newSub', {unique: false});
    store.createIndex('verified', 'verified', {unique: false});
    store.createIndex('gifter', 'gifter', {unique: false});
    store.createIndex('founder', 'founder', {unique: false});
    store.createIndex('og', 'og', {unique: false});

    store.transaction.oncomplete = (eee) => {
      // request.result.close();
      var obj = {};
      obj.donation = 0;
      obj.founder = 0;
      obj.gifter = 0;
      obj.isBot = 0;
      obj.isHidden = false;
      obj.isHighlighted = false;
      obj.isMuted = false;
      // obj.itemid = '1111';
      obj.mention = 0;
      obj.message = new Date().toISOString().slice(0, 10);
      obj.moderator = 0;
      obj.newSub = 0;
      obj.og = 0;
      obj.owner = 0;
      obj.staff = 0;
      obj.sub = 0;
      obj.timestamp = '00:00AM';
      obj.username = window.scbtChannelName;
      obj.verified = 0;
      scbt_set_save_chat_to_db(obj);
      return eee;
    }
  };
}



function scbt_set_save_chat_to_db(obj) {
  var db;
  var request = window.indexedDB.open(window.scbtDbName, 10);
  request.onsuccess = function(event) {
    var db = event.target.result;
    var transaction = db.transaction('chat', 'readwrite');
    transaction.oncomplete = function() {
      
    };
    transaction.onabort = function(error) {
      scbt_handle_db_error_blocked(error);
    };
    transaction.onerror = function(error) {
      scbt_handle_db_error_blocked(error);
    };
    var store = transaction.objectStore('chat');
    store.put(obj).onsuccess = function(e2) {
      
      scbt_helper_chat_listen();
    };
    store.put(obj).onerror = function(error2) {
      scbt_handle_db_error_blocked(error2);
    };
    store.put(obj).onblocked = function(error2) {
      scbt_handle_db_error_blocked(error);
    };
  };
}


function scbt_get_db_name(startSaving) {
  if (window.scbtDbName) {
    return window.scbtDbName;
  } else {
    
    if (
      (document.getElementsByTagName('video').length > 0) && 
      window.scbtService && window.scbtChannelName && window.scbtvideoID
    ){

      chrome.storage.sync.get('scbtfeature4', function (option) {
        if (option) {
          // if (option.scbtfeature4 === true || option.scbtfeature4 === false) {
            window.scbtOptions.scbtfeature4 = true;
            window.scbtDbName = 'savedchat' + '&' + window.scbtService + '&' + window.scbtChannelName + '&' + window.scbtvideoID;
            window.scbtDbNameToSearch = window.scbtDbName;
            scbt_get_db(window.scbtDbName, startSaving);
            return window.scbtDbName;
          // }
        }
      });

  } else { 
    return false;
  }
  } // if no stream id to save yet
}



function scbt_get_service() {
  var s = window.location.hostname;
  if (s) {
    s = s.replace('www.', '');
    s = s.replace('.com', '');
    s = s.replace('.tv', '');
    s = s.replace('m.', '');  
  }
  window.scbtService = s; s = null; return window.scbtService;
}


function scbt_get_sort_times(array) {
  if (!array) {
    return false;
  }
  if (!array[1]) {
    return array;
  }
  if (!array[1].timestamp) {
    return array;
  }
  if (typeof array[1].timestamp === 'number') {
    return array;
  }
  if (array[1].timestamp.indexOf(':') < 0) {
    return array;
  }
  return array.sort(function (a, b) {
    if (parseInt(a.timestamp.split(':')[0]) - parseInt(b.timestamp.split(':')[0]) === 0) {
      return parseInt(a.timestamp.split(':')[1]) - parseInt(b.timestamp.split(':')[1]);
    } else {
      return parseInt(a.timestamp.split(':')[0]) - parseInt(b.timestamp.split(':')[0]);
    }
  })
}


function scbt_get_time_to_seconds(str) {
  var p = str.split(':'),
      s = 0, m = 1;
  while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
  }
  str = null; p = null; m = null;
  return s;
}


function scbt_handle_db_error_blocked(error) {
  console.error('Error: getting and displaying saved chat failed or blocked for db: ' + window.scbtDbName);
  if (error) {
    console.error(error);
    if (typeof error === 'string') {
      setTimeout(function(){ scbt_helper_toast(error); }, 2700);
    } else {
      setTimeout(function(){ scbt_helper_toast('Error: getting and displaying saved chat failed'); }, 2700);  
    }
    if (error.target) {
      if (error.target.transaction) {
        if (error.target.transaction.error) {
          console.log('typeof error.target.transaction.error');
          console.log(typeof error.target.transaction.error);
          console.log(error.target.transaction.error);
          if (error.target.transaction.error.message) {
            console.log('typeof error.target.transaction.error.message');
            console.log(typeof error.target.transaction.error.message);
            console.log(error.target.transaction.error.message);
          }
          if (error.target.transaction.error.message.indexOf('uniqueness requirements') > -1) {
            console.log('no unique id cannot be saved');
          }
        } 
      } 
    }
  }
}


// scbt_helper_ functions do something usually UI related to the function calling it, but not user interaction called
function scbt_helper_build_all_menus(a,b,c) {

  var x = document.getElementById('scbtSideMenu');
  if (x) { } else { 
    (async () => {
      await scbt_helper_get_menu(window.scbtXRef, 'scbtSideMenu', 'side_menu_youtube.html', false);
    })(); // async
  }
  
  var x = document.getElementById('message-input');
  if (x) { window.scbtChatInputRef = x; }
  
  var x = document.getElementById('scbtChatWrapper');
  if (x) { } else { 
    (async () => {
      await scbt_helper_get_menu(window.scbtXRef, 'scbtChatWrapper', 'wrappers_menu.html', false);
    })(); // async
   }  

  var x = document.getElementById('scbtChatMenu');
  if (x) { } else { 
    (async () => {
      await scbt_helper_get_menu(window.scbtXRef, 'scbtChatMenu', 'chat_menu.html', false);
    })(); // async
  }

  var x = document.getElementById('scbtOptionsMenu');
  if (x) { } else { 
     (async () => {
        await scbt_helper_get_menu(window.scbtXRef, 'scbtOptionsMenu', 'options_menu.html', false);
     })(); // async
    setTimeout(function(){ scbt_helper_toast( window.scbtService + ' Reggie loaded, RUNNING version: ' + chrome.runtime.getManifest().version);  }, 2700);
    console.log(' Reggie loaded, RUNNING version: ' + chrome.runtime.getManifest().version);
    var y = document.getElementById('scbtToggleButton2');
    if (y) { y.addEventListener('click', scbt_user_toggle_chat_menu); }
    a = null; b = null; c = null; x = null; y = null; return false;
  }

}


function scbt_helper_build_chat_by_id(dbName, service, channelId, videoID) {
  var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; 
  
  if (dbName && service && channelId && videoID) { } else { 
    scbt_handle_db_error_blocked('missing info to build chat database');
  }

  window.scbtUniqueMessageIds = [];
  var request = window.indexedDB.open(dbName, 10);
  request.onsuccess = function(e) {
    if (!request.result) { setTimeout(function(){ scbt_helper_toast('build chat for live stream result failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false; }
    var db = request.result;
    var transaction = db.transaction('chat', 'readonly');
    transaction.oncomplete = function() {
      
    };
    transaction.onabort = function() {
      scbt_handle_db_error_blocked(transaction.error);
    };
    
    var store = transaction.objectStore('chat'); 
    store.getAll().onsuccess = function(e2) {
      if (!e2) { setTimeout(function(){ scbt_helper_toast('Error: build chat for live stream e2 failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false; }
      if (!e2.target) { setTimeout(function(){ scbt_helper_toast('Error: build chat for live stream e2 target failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false; }
      if (!e2.target.result) { setTimeout(function(){ scbt_helper_toast('Error: build chat for live stream e2 target result failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false; }
      if (!e2.target.result.length || e2.target.result.length < 1) { setTimeout(function(){ scbt_helper_toast('Error: build chat for live stream not found.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false; }
        
      var chats = e2.target.result;
      window.scbtChatContentRef.innerHTML = '';
      window.scbtChatARef.innerText = 'Saved Chat From ' + channelId + ' on ' + service + ' ' + videoID;
      window.scbtChatBRef.innerText = '';
      chats = scbt_get_sort_times(chats);
      [].forEach.call(chats, function(item) {
        if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
            window.scbtUniqueMessageIds.push(item.itemid);
            var classString = scbt_get_classString_for_chat(item);
            var newElement = "<p class='" + classString + "'><span>" + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" +  item.message + "</b></p>";
            window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
        }
      });
      scbt_helper_insert_name_into_chat();
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false;
    };
    store.getAll().onerror = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false;
    };
    store.getAll().onblocked = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false;
    };

  }; // request.onsuccess
  request.onerror = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false;
  };
  request.onblocked = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; dbName = null; service = null; channelId = null; videoID = null; return false;
  };
}


function scbt_helper_build_list_of_all_dbs() {
  window.scbtStreamList = [];
  window.indexedDB.databases().then((arr) => {
    if (arr.length > 0) {
      window.scbtChatPreviousContentRef.innerHTML = '';
      var arrl = arr.length;
      for (var i = 0; i < arrl; i++) {
        var dbName = arr[i].name;
        if (dbName.startsWith('savedchat') ) {
          window.scbtStreamList.push(dbName);
          var dbArr = dbName.split('savedchat');
          var dbString = dbArr[1];
          var dbArr2 = dbString.split('&');
          var newElement = "<p><span class='az2' data-service='" + dbArr2[1] + "' data-videoid='" + dbArr2[3] + "' data-channelid='" + dbArr2[2] + "'>" + dbArr2[2] + "</span> - <span class='az3' data-service='" + dbArr2[1] + "' data-videoid='" + dbArr2[3] + "' data-channelid='" + dbArr2[2] + "'>" + dbArr2[3] + " </span> <span class='az1'>on " + dbArr2[1] + "</span><button class='az4' data-service='" + dbArr2[1] + "' data-videoid='" + dbArr2[3] + "' data-channelid='" + dbArr2[2] + "'> 💾 </button> <button class='az5' data-service='" + dbArr2[1] + "' data-videoid='" + dbArr2[3] + "' data-channelid='" + dbArr2[2] + "'> 🗑️ </button> </p>";
          window.scbtChatPreviousContentRef.insertAdjacentHTML('beforeend', newElement);
        }
      }

      setTimeout(function() {
        var x = document.getElementsByClassName('az2');
        var xl = x.length;
        for (var i = 0; i < xl; i++) {
          x[i].addEventListener('click', scbt_user_go_to_stream);
        }
        var x = document.getElementsByClassName('az3');
        var xl = x.length;
        for (var i = 0; i < xl; i++) {
          x[i].addEventListener('click', scbt_user_chat_load_by_video_id);
        }
        var x = document.getElementsByClassName('az4');
        var xl = x.length;
        for (var i = 0; i < xl; i++) {
          x[i].addEventListener('click', scbt_user_chat_export_by_video_id);
        }
        var x = document.getElementsByClassName('az5');
        var xl = x.length;
        for (var i = 0; i < xl; i++) {
          x[i].addEventListener('click', scbt_user_chat_delete_by_video_id);
        }
        var arr = arrl = i = dbName = dbArr = dbString = dbArr2 = newElement = x = xl = null; return false;
      }, 2000);
    }
  });
}


function scbt_helper_chat_auto_show() {
  if (window.scbtOptions.scbtfeature5 === true) {
    scbt_user_chat_full_screen_width();
    scbt_user_full_screen_height_chat();
    var x = document.querySelectorAll('#xyz');
    if (x[1]) {
      x[1].style.display = 'none';
    }
    window.scbtSearchChat = 'current';
    window.scbtChatARef.innerText = 'Search this stream chat';
    window.scbtChatMenuRef.classList.add('scbt-fl');
    window.scbtChatWrapperRef.classList.add('scbt-bl');
    window.scbtChatSearchInputTextRef.value = '';
    window.scbtChatSearchInputTextRef.focus();
    window.isdoSearch = 1;
    x = null; return false;
  } else {
    scbt_user_chat_full_screen_width();
    scbt_user_full_screen_height_chat();
    var x = document.querySelectorAll('#xyz');
    if (x[1]) {
      x[1].style.display = 'block';
    }
    window.scbtSearchChat = '';
    window.scbtChatARef.innerText = '';
    window.scbtChatMenuRef.classList.remove('scbt-fl');
    window.scbtChatWrapperRef.classList.remove('scbt-bl');
    window.scbtChatSearchInputTextRef.value = '';
    window.isdoSearch = 0;
    x = null; return false;
  }
}


function scbt_helper_chat_blur(div) {
  div.style.paddingLeft = '.5rem';
  div.style.paddingRight = '.5rem';
  div.style.border = '1px dotted ' + window.scbtOptions.scbtBorderColor;
}


function scbt_helper_chat_clean(obj, div) {
  if (div.id) {
    obj.itemid = div.id;
  }

  var x = div.querySelectorAll('#timestamp');
  if (x.length > 0) {
    if (x[0].innerText) {
      obj.timestamp = x[0].innerText;  
    }
  }

  obj.username = null;
  var x = div.querySelectorAll('#author-name');
  if (x.length > 0) {
    var n =  x[0].innerText;
    obj.username = n;
    if (n) {
      obj = scbt_get_clean_username(obj);
    }
  }

  obj.message = null;
  var x = div.querySelectorAll('#message');
  if (x.length > 0) {
    var message =  x[0].innerText;
    if (message) {
      obj.message = message;
      if (message.indexOf('@') > -1) {
        obj.mention = 1;
      }
      if (obj.message.indexOf('#') > -1) {
        obj.hashtag = 1;
      }
      obj = scbt_get_clean_message(obj);
      if (obj.message == null || obj.message.trim() === '') { } else {
        message = message.replace(/(?:\r\n|\r|\n)/g, '');
        message = message.split("\t").join("");
        message = message.split("\"").join("");
        message = message.split("\'").join("");
        obj.message = message; 
      }
    }
  }
  

  if ( div.getAttribute('author-type') == 'member') {
    obj.sub = 1;
  }

  if ( div.getAttribute('author-type') == 'moderator') {
    obj.moderator = 1;
  }

  if ( div.getAttribute('author-type') == 'owner') {
    obj.owner = 1;
  }

  var x = div.querySelector('#chip-badges .yt-live-chat-author-chip');
  if (x) {
    if (x.ariaLabel == 'Verified') {
      obj.verified = 1;
    }
  }
  
  var arr = div.querySelectorAll('.yt-live-chat-paid-message-renderer');
  if (arr.length > 0) {
    obj.itemid = div.id;
    obj.donation = 1;
    var msg = div.innerText;
    msg = msg.replace(/\/‘’‚“”„"`~«´<>/g, '');
    msg = msg.replaceAll(',', ' ');

    obj.message = msg;
    // var n = $( div ).find( '#author-name' );
    // obj.username = n[0].innerText;
    obj.timestamp = '1:00';
  }

  var arr = div.querySelectorAll('.yt-live-chat-membership-item-renderer');
  if (arr.length > 0) {
    obj.itemid = div.id;
    obj.newSub = 1;
    var msg = div.innerText;
    msg = msg.replace(/\/‘’‚“”„"`~«´<>/g, '');
    msg = msg.replaceAll(',', ' ');
    obj.message = msg;
    // var n = $( div ).find( '#author-name' );
    // obj.username = n[0].innerText;
    obj.timestamp = '1:00';
  }

  var arr = div.querySelectorAll('.yt-live-chat-paid-sticker-renderer');
  if (arr.length > 0) {
    obj.itemid = div.id;
    obj.donation = 1;
    var msg = div.innerText;
    msg = msg.replace(/\/‘’‚“”„"`~«´<>/g, '');
    msg = msg.replaceAll(',', ' ');
    obj.message = msg;
    // var n = $( div ).find( '#author-name' );
    // obj.username = n[0].innerText;
    obj.timestamp = '1:00';
  }

  if ( (obj.itemid == 'contents' ) || (obj.itemid == 'item-scroller' ) || (obj.itemid == 'docked-messages' ) || (obj.itemid == 'item-offset' ) || (obj.itemid == 'items' ) || (obj.itemid == 'empty-state-message' ) || (obj.itemid == 'show-more' ) ) {
    var obj = {};
  }

  if (div.classList.contains('vip') ) {
    obj.verified = 1;
  }

  x = null; message = null; arr = null; msg = null; name = null; 
  return obj;
} // end scbt_helper_chat_clean


function scbt_helper_chat_filter_blocked_links(obj, div) {
  var messageDiv = div.querySelector('#message');
  if (messageDiv) {
    var x = messageDiv.innerText;
    if (x) {
      if ( (x.indexOf('http') > -1 ) || (x.indexOf('.com') > -1 ) || (x.indexOf('xxx') > -1 ) ) {
        messageDiv.innerText = '---';
        obj.message = '---';
      }
    }
  }
  messageDiv = x = div = null; return obj;
}


function scbt_helper_chat_filter_blocked_words(obj, div) {
  var arr1 = [];
  if (window.scbtBlockedWords.length > 0) {
    arr1 = window.scbtBlockedWords;
  }
  if (obj.timestamp == '1234' || obj.timestamp == '12345' || obj.timestamp == '12346' || obj.timestamp == '1234567') {
    return obj;
  }

  // I do not want to see these words in chat. Comma separated list. Example: rat,mouse,vermin 
  var messageDiv = div.querySelector('#message');
  if (messageDiv) {
    var msg = messageDiv.innerText;
    if (msg) {
      t = msg.toLowerCase();
      t = t.trim();
      var arr2 = window.scbtOptions.scbthidden7.split(',');
      var fullArray = arr1.concat(arr2);

      var arrl = fullArray.length;
      for (var i = 0; i < arrl; i++) {
        var y = fullArray[i];
        y = y.toLowerCase();
        // y = y.trim();
        if (t.indexOf(y) > -1 ) {
          var regexp = new RegExp(y, 'gi');
          var cleaned = msg.replace(regexp, ' xxx ');
          messageDiv.innerText = cleaned;
          obj.message = cleaned;
          msg = cleaned;
        }
      }
    }
    var t = arr1 = arr2 = fullArray = arrl = y = messageDiv = div = null;  
  }
  return obj;
}


function scbt_helper_chat_filter_highlighted_words(obj, div) {
  // Highlight these words in chat in big letters. Comma separated list. Example: fun,happy
  var messageDiv = div.querySelector('#message');
  if (messageDiv) {
      var t = obj.message;
      if (t) {
        tm = t.toLowerCase();
        tm = tm.trim();
        var arr = window.scbtOptions.scbthighlighted7.split(',');
        var arrl = arr.length;
        for (var i = 0; i < arrl; i++) {
          var y = arr[i];
          y = y.toLowerCase();
          y = y.trim();
          if (tm.indexOf(y) > -1 ) {
            messageDiv.style.setProperty('font-size', '4rem', 'important');
            messageDiv.style.setProperty('line-height', '2', 'important');  
          }
        }
      }
      var t = arr = arrl = y = i = messageDiv = tm = null;
    }
  return obj;
}


function scbt_helper_chat_filter_vip_words(obj, div) {
  // Highlight these users chats in big letters. Comma separated list. Example: johnny,sally
  var messageDiv = div.querySelector('#author-name');
  if (messageDiv) {
    var t = obj.username;
    if (t) {
      tm = t.toLowerCase();
      tm = tm.trim();
      var arr = window.scbtOptions.scbthighlighted6.split(',');
      var arrl = arr.length;
      for (var i = 0; i < arrl; i++) {
        var y = arr[i];
        y = y.toLowerCase();
        y = y.trim();
        if (tm == y) {
          div.classList.add('vip');
          messageDiv.classList.add('vip');
          var parentElm = messageDiv.parentElement;
          var parentElm2 = parentElm.parentElement;
          parentElm2.classList.add('vip');
          obj.isHighlighted = window.scbtOptions.scbthighlighted5;
          var x = div.querySelector('#message');
          x.style.setProperty('font-size', '4rem', 'important');
          x.style.setProperty('line-height', '2', 'important');
          }
        }
      }
      var t = arr = arrl = y = i = messageDiv = tm = x = div = null;
    }
   return obj;
}


function scbt_helper_chat_filter_blocked_users(obj, div) {
  // I do not want to see these user chats. Comma separated list. Example: john,mary,bigfoot
  var t = obj.username;
  if (t) {
    tm = t.toLowerCase();
    tm = tm.trim();
    var arr = window.scbtOptions.scbthidden8.split(',');
    var arrl = arr.length;
    for (var i = 0; i < arrl; i++) {
      var y = arr[i];
      y = y.toLowerCase();
      y = y.trim();
      if (tm == y) {
        obj.isHidden = true;
      }
    }
  }
  var t = arr = arrl = y = i = messageDiv = tm = x = div = null; return obj;
}


function scbt_helper_chat_make_decisions(obj, div) {
  if (window.scbtOptions.scbtmuted5 === true) {
    if (div.classList.contains('follow') ) {
       obj.isMuted = true;
    }
  }
  if (window.scbtOptions.scbtmuted6 === true) {
    if (div.classList.contains('user-notice-line') ) {
       obj.isMuted = true;
    }
  }
  if (window.scbtOptions.scbthidden5 === true) {
    if (div.classList.contains('follow') ) {
       obj.isHidden = true;
    }
  }
  if (window.scbtOptions.scbthidden6 === true) {
    if (div.classList.contains('user-notice-line') ) {
       obj.isHidden = true;
    }
  }

  if (window.scbtOptions.scbttheme6 === true) {
    var imgs = div.querySelectorAll('img');
    [].forEach.call(imgs, function(img) {
      img.style.display = 'none';
    });
    var is = div.querySelectorAll('i');
    [].forEach.call(is, function(i) {
      i.style.display = 'none';
    });
    var is = div.querySelectorAll('svg');
    [].forEach.call(is, function(i) {
      i.style.display = 'none';
    });
  }
  
  // Highlight sub messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted1 != '#ffffff') {
      if (obj.sub === 1) {
        obj.isHighlighted = window.scbtOptions.scbthighlighted1;
      }
  }

  // Highlight gifter messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted11 != '#ffffff') {
    if (obj.gifter === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted11;
    }
  }

  // Highlight VIP messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted5 != '#ffffff') {
    if (div.classList.contains('vip')) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted5;
    }
  }

  // Highlight founder messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted8 != '#ffffff') {
    if (obj.founder === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted8;
    }
  }

  // Highlight OG messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted9 != '#ffffff') {
    if (obj.og === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted9;
    }
  }

  // Highlight owner messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted10 != '#ffffff') {
    if (obj.owner === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted10;
    }
  }
  
  // Highlight moderator messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted2 != '#ffffff') {
      if (obj.moderator === 1) {
        obj.isHighlighted = window.scbtOptions.scbthighlighted2;
      }
  }
  // Mute owner/streamer messages in chat in dim text 
  if (window.scbtOptions.scbtmuted2 === true) {
      if (obj.owner === 1) {
        obj.isMuted = true;
      }
  }
  // Hide owner/streamer messages in chat
  if (window.scbtOptions.scbthidden2 === true) {
      if (obj.owner === 1) {
        obj.isHidden = true;
      }
  }

  if ( (obj.owner === 1) || (obj.moderator === 1) || (obj.sub === 1) || (obj.newSub === 1) || (obj.verified === 1) ) { } else {
    // scbtmuted4 Mute non moderator/sub messages in chat
    if (window.scbtOptions.scbtmuted1 === true) {
      obj.isMuted = true;
    }
    // scbthidden4 Hide non moderator/sub messages in chat
    if (window.scbtOptions.scbthidden1 === true) {
      obj.isHidden = true;
    }
  }
    
  // scbtmuted3 Mute bot messages
  if (window.scbtOptions.scbtmuted4 === true) {
    if (obj.username && obj.message) {
      if (obj.isBot === 1) {
        obj.isMuted = true;
      }
    }
  }
    
  // scbthidden3 Hide bot  messages
  if (window.scbtOptions.scbthidden4 === true) {
    if (obj.username && obj.message) {
      if (obj.isBot === 1) {
        obj.isHidden = true;
      }
    }
  }

  // Highlight mention messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted3 != '#ffffff') {
    if (obj.mention === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted3;
    }
  }
  // Highlight hashtag messages in chat in this hex colour 
  if (window.scbtOptions.scbthighlighted4 != '#ffffff') {
    if (obj.hashtag === 1) {
      obj.isHighlighted = window.scbtOptions.scbthighlighted4;
    }
  }
  // Mute @ mention messages in chat in dim text 
  if (window.scbtOptions.scbtmuted3 === true) {
    if (obj.mention === 1) {
      obj.isMuted = true;
    }
  }
  // Hide @ mention messages in chat 
  if (window.scbtOptions.scbthidden3 === true) {
    if (obj.mention === 1) {
      obj.isHidden = true;
    }
  }

  return obj;
} // end scbt_helper_chat_make_decisions


function scbt_helper_chat_on(div) {
  div.style.paddingLeft = '.5rem';
  div.style.paddingRight = '.5rem';
  div.style.border = '2px solid ' + window.scbtOptions.scbtBorderColor;
}

function scbt_helper_chat_off(div) {
  div.style.paddingLeft = 'initial';
  div.style.paddingRight = 'initial';
  div.style.border = '0px';
}


function scbt_helper_chat_listen() {
  targetNode = null;
  if (window.scbtOptions) {
    if (window.scbtOptions.observer) {
      window.scbtOptions.observer.disconnect();
      window.scbtOptions.observer = null;
      targetNode = null;
      config = null;
      callback = null;
    }
  }
  
  if (window.scbtZ) {
    targetNode = window.scbtZ.document.body.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
  } else {
    var x = document.body.querySelectorAll('iframe#chatframe');
    if (x) {
      var y = x[0];
      if (y) {
        var z = y.contentWindow.document.body.querySelectorAll('#items');
        if (z) {
          window.scbtZ = x[0].contentWindow;
          targetNode = window.scbtZ.document.body.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
        }
      }
    }
  }
  
  if (targetNode) {
    var config = { childList: true,
                 attributes: false,
                 characterData: false,
                 subtree: false,
                 attributeOldValue: false,
                 characterDataOldValue: false 
               };
    var callback = function(mutationsList, observer) {
      for(const mutation of mutationsList) {
          if (mutation.type === 'childList') {
              if (mutation.addedNodes) {
                var mLength = mutation.addedNodes.length;
                for (var i=0; i < mLength; i++) { 
                  scbt_helper_process_chat_line(mutation.addedNodes[i], true);
                }
                      
              }  // if (mutation.addedNodes) {
            }   // end if (mutation.type === 'childList') {      
       } // end for(const mutation of mutationsList) {
    };  // end var callback = function(mutationsList, observer) {

    if (window.scbtOptions) {
      window.scbtOptions.observer = new MutationObserver(callback);
      window.scbtOptions.observer.observe(targetNode, config);
    }
    return false;
  }
  return false;
}


function scbt_helper_chat_set_to_hide(element) {
  element.style.opacity = 0;
  return false;
}
function scbt_helper_chat_set_to_highlight(element, color) {
  element.style.setProperty('border-left', '2px solid ' + color, 'important');
  element.style.setProperty('border-right', '2px solid ' + color, 'important');
  return false;
}
function scbt_helper_chat_set_to_mute(element) {
  element.style.opacity = '.3';
  return false;
}
function scbt_helper_chat_set_to_show(element) {
  element.style.opacity = '1';
  return false;
}


function scbt_helper_chat_speak(m) {
  if (m) {
      m = m.toLowerCase();
      m = m.trim();
      var arr = window.scbtOptions.scbtfeature12.split(',');
      var arrl = arr.length;
      for (var i = 0; i < arrl; i++) {
        var y = arr[i];
        y = y.toLowerCase();
        y = y.trim();
        if (m.indexOf(y) > -1 ) {
          if ( window.scbtSpoken.includes(m) ) {  } else {
            window.scbtSpoken.push(m);
            var synth = window.speechSynthesis;
            var voices = synth.getVoices();
            var utterance = new SpeechSynthesisUtterance(m);
            utterance.voice = voices[0];
            synth.speak(utterance);
            utterance.addEventListener('start', event => {
              console.log('speak start of ' + m);
            });
            utterance.addEventListener('end', event => {
              console.log('speak end of ' + m);
              m = null; y = null; arr = null; arrl = null;
            });
          }
        }
      }
    m = null; y = null; arr = null; arrl = null;
  }
  return false;
}


function scbt_helper_copy_text_to_clipboard(text) {
  var toShare = window.location.href;
  if (typeof text == 'string') {
    toShare = text;
  }
  navigator.clipboard.writeText(toShare).then(function() {
    toShare = null;
    return false;
  }, function(err) {
    alert(err);
    console.error(err);
    toShare = null;
    return false;
  });
}


function scbt_helper_csv_download(blob, filename) {
  if (blob && filename) {
    var a = document.createElement('a');
    a.setAttribute('download', filename);
    var url = URL.createObjectURL(blob);
    a.setAttribute('href', url);
    a.click();
    URL.revokeObjectURL(url);
  }
  blob = null; filename = null; a = null; url = null; return false;
}


function scbt_helper_csv_import_chat_log(filename, chats) {
  scbt_helper_toast('Status: starting to import chat');
  var fileNameArr = fileNamePartsArr = one = two = three = four = five = dbName = chatObj = chatObjArr = db = result = arrl = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null;
  window.scbtUniqueMessageIds = [];
  if (filename && chats) { } else { setTimeout(function(){ scbt_helper_toast('Error: chat not found to import'); }, 2700); var fileNameArr = fileNamePartsArr = one = two = three = four = five = dbName = chatObj = chatObjArr = db = result = arrl = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; return false; }

  var fileNameArr = filename.split('-chatlog');
  fileNameArr = fileNameArr[0];
  var fileNamePartsArr = fileNameArr.split('&');
  var one = fileNamePartsArr[0];    // savedchat
  var two = fileNamePartsArr[1];    // youtube
  var three = fileNamePartsArr[2];  // streamer
  var four = fileNamePartsArr[3];   // abc123
  // var five = fileNamePartsArr[4];  // 2021-11-12
  var dbName = one + '&' + two + '&' + three + '&' + four;
    
  if (chats.length > 1) {
    var chatObj = {};
    var chatObjArr = [];
    chats = chats.slice(1);
    var arrl = chats.length;
    for (var i = 0; i < arrl; i++) {
      if (chats[i][1]) {
        chats[i] = chats[i].slice(1);
        chatObj.message = chats[i][0];
        chatObj.itemid = chats[i][1];
        chatObj.timestamp = chats[i][2];
        chatObj.username = chats[i][3];
        chatObj.sub = Number(chats[i][4]);
        chatObj.moderator = Number(chats[i][5]);
        chatObj.owner = Number(chats[i][6]);
        chatObj.donation = Number(chats[i][7]);
        chatObj.newSub = Number(chats[i][8]);
        chatObj.verified = Number(chats[i][9]);
        chatObj.gifter = Number(chats[i][10]);
        chatObj.founder = Number(chats[i][11]);
        chatObj.og = Number(chats[i][12]);
        chatObjArr.push(chatObj);
        chatObj = {};
      }
    }
    var xyz = scbt_helper_save_batch(dbName, 'chat', chatObjArr);
    var fileNameArr = fileNamePartsArr = one = two = three = four = five = dbName = chatObj = chatObjArr = db = result = arrl = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = null; return false;
  }
  
}


function scbt_helper_csv_parse_chat_log(data) {
  var parsedata = [];
  if (data) {
    var newLinebrk = data.split("\n");
    var arrl = newLinebrk.length;
    for (var i = 0; i < arrl; i++) {
      parsedata.push(newLinebrk[i].split(','));
    }
    scbt_helper_csv_import_chat_log(window.scbtFileName, parsedata);
  }
  data = parsedata = newLinebrk = arrl = null; return false;
}


function scbt_helper_do_coming_soon_message() {
  scbt_helper_toast('Status: Coming soon in later versions in 2023');
  return false;
}


function scbt_helper_apply_css_from_option(obj) {
  var css = '';

  if (typeof obj == 'object') {

    // Background of chat bubble in this hex colour. Use black #000 for transparent bubble.
    if (obj.a == 'scbttheme1') {
      if (obj.b == '#ffffff' || obj.b == '') {
        css = css + ' .yt-live-chat-item-list-renderer { background-color: initial !important; } ';
      }
      if (obj.b == '#000000') {
        css = css + ' .yt-live-chat-item-list-renderer { background-color: transparent !important; } ';
      }  
      if ( (obj.b != '#ffffff') && (obj.b != '#000000') ) {
        css = css + ' .yt-live-chat-item-list-renderer { background-color:' + obj.b + ' !important;} '; 
      }
    }

    // User names in chat in this hex colour 
    if (obj.a == 'scbttheme2') {
      if (obj.b == '#ffffff') {
        css = css + ' #author-name { color: initial !important; } #author-name.yt-live-chat-author-chip { color: var(--yt-live-chat-secondary-text-color) !important; } #author-name.member.yt-live-chat-author-chip { color: var(--yt-live-chat-sponsor-color) !important; } #author-name.moderator.yt-live-chat-author-chip { color: var(--yt-live-chat-moderator-color) !important; } ';
      }
      if ( (obj.b != '#ffffff') && (obj.b != '#000000') ) {
        css = css + ' .yt-live-chat-item-list-renderer #author-name { color:' + obj.b + ' !important; } ';
      }
    }

    // Highlighted chat text in this hex colour
    if (obj.a == 'scbttheme3') {
      if (obj.b != '#ffffff') {
        window.scbtOptions.scbtBorderColor = obj.b;
      } else {
        window.scbtOptions.scbtBorderColor = '#ff0000';
      }
    }

    // Text in chat in this hex colour
    if (obj.a == 'scbttheme4') {
      if (obj.b == '#ffffff') {
        css = css + ' .yt-live-chat-item-list-renderer #message { color: var(--yt-live-chat-primary-text-color,var(--yt-spec-text-primary)) !important; text-shadow: 0px; } ';
      }
      if (obj.b == '#000000') {
        css = css + ' .yt-live-chat-item-list-renderer #message { color: #111111 !important; text-shadow: 0.5px 0.5px silver; } ';
      }  
      if ( (obj.b != '#ffffff') && (obj.b != '#000000') ) {
        css = css + ' .yt-live-chat-item-list-renderer #message { color:' + obj.b + ' !important; text-shadow: 0.5px 0.5px darkslategrey; } ';
      }
    }

    // Chat font size should be this times of normal, try 1.25
    if (obj.a == 'scbttheme5') {
      if (obj.b > 0) {
        var x = obj.b + 'rem';
        css = css + ' #content.yt-live-chat-text-message-renderer #message { font-size: ' + x + '; line-height: ' + obj.b  + '; } ';
      } else {
        css = css + ' #content.yt-live-chat-text-message-renderer #message { font-size: initial; line-height: unset; } ';
      }
    }

    // Text only
    if (obj.a == 'scbttheme6') {
      if (obj.b === true) {
        css = css + ' #author-name, #author-photo, #chat-badges, #message img, #message svg, #timestamp { visibility: hidden !important; } ';
      } else {
        css = css + ' #author-name, #author-photo, #chat-badges, #message img, #message svg, #timestamp { visibility: visible !important; } ';
      }      
    }

    // Left handed screen. Flip screen so video is on the right and chat is on the left. 
    if (obj.a == 'scbtfeature7') {
      if (obj.b === true) {
          css = css + '#app .container-fluid .mt-lg-3 { flex-direction: row-reverse; } ';
      } else {
          css = css + '#app .container-fluid .mt-lg-3 { flex-direction: initial; } ';
      }
    }

    // Upside down chat screen. Newest chat is on the top, oldest chat is on the bottom 
    if (obj.a == 'scbtfeature8') {
      if (obj.b === true) {
          css = css + '#chat .chat-messages { flex-direction: column-reverse; } ';
      } else {
          css = css + '#chat .chat-messages { flex-direction: column; } ';
      }
    }

    // mouseover
    if (obj.a == 'scbtfeature9') {
      if (obj.b === true) {
        css = css + '.yt-live-chat-item-list-renderer #message:hover { font-size: 166% !important; } .yt-live-chat-item-list-renderer img:hover, .yt-live-chat-item-list-renderer svg:hover { height: 7rem !important; width: auto !important; font-size: 3rem; } ';
       } else {
        css = css + '.yt-live-chat-item-list-renderer #message:hover { font-size: initial !important; } .yt-live-chat-item-list-renderer img:hover, .yt-live-chat-item-list-renderer svg:hover { height: initial !important; width: auto !important; font-size: initial; } ';
      }
    }

  }


  if (css != '') {
    var head = window.scbtZ.document.head;
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }
  obj = null; css = null; a = null; head = null; style = null;
  return false;
}



function scbt_helper_save_options() {
  var obj = {};

  // THEME
  var scbttheme1 = document.getElementById('scbttheme1'); // background color scbtnormal1
  if (scbttheme1) {
    scbttheme1.addEventListener('change', e => {
      // console.log('changed')
      obj.a = 'scbttheme1'; obj.b = '';
      // console.log(scbttheme1.value);
      if (scbttheme1.value) {
        obj.b = scbttheme1.value;
        chrome.storage.sync.set({'scbttheme1': scbttheme1.value }, function() { scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme1': '' }, function() { scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbttheme2 = document.getElementById('scbttheme2'); // user name color scbtnormal2
  if (scbttheme2) {
    scbttheme2.addEventListener('change', e => {
      obj.a = 'scbttheme2'; obj.b = '';
      if (scbttheme2.value) {
        obj.b = scbttheme2.value;
        chrome.storage.sync.set({'scbttheme2': scbttheme2.value }, function() { scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme2': '' }, function() { scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbttheme3 = document.getElementById('scbttheme3'); // highlighted chat color scbtnormal3
  if (scbttheme3) {
    scbttheme3.addEventListener('change', e => {
      obj.a = 'scbttheme3'; obj.b = '';
      if (scbttheme3.value) {
        obj.b = scbttheme3.value;
        chrome.storage.sync.set({'scbttheme3': scbttheme3.value }, function() { scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme3': '' }, function() { scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbttheme4 = document.getElementById('scbttheme4'); // message color scbtnormal4
  if (scbttheme4) {
    scbttheme4.addEventListener('change', e => {
      obj.a = 'scbttheme4'; obj.b = '';
      if (scbttheme4.value) {
        obj.b = scbttheme4.value;
        chrome.storage.sync.set({'scbttheme4': scbttheme4.value }, function() { scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme4': '' }, function() { scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbttheme5 = document.getElementById('scbttheme5'); // font size scbtchatsize2
  if (scbttheme5) {
    scbttheme5.addEventListener('change', e => {
      obj.a = 'scbttheme5'; obj.b = '';
      if (scbttheme5.value) {
        obj.b = scbttheme5.value;
        chrome.storage.sync.set({'scbttheme5': scbttheme5.value }, function() { scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme5': '' }, function() { scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbttheme6 = document.getElementById('scbttheme6'); // text only chat scbtnormal7
  if (scbttheme6) {
    scbttheme6.addEventListener('change', e => {
      obj.a = 'scbttheme6'; obj.b = false;
      if (e.target.checked) {
        obj.b = true;
        chrome.storage.sync.set({'scbttheme6': true}, function() { window.scbtOptions.scbttheme6 = true; scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbttheme6': false}, function() { window.scbtOptions.scbttheme6 = false; scbt_helper_apply_css_from_option(obj); });
      }
    });
  }
  
  // HIGHLIGHT
  var scbthighlighted1 = document.getElementById('scbthighlighted1'); // highlight sub messages color scbthighlighted2
  if (scbthighlighted1) {
    scbthighlighted1.addEventListener('change', e => {
      if (scbthighlighted1.value) {
        chrome.storage.sync.set({'scbthighlighted1': scbthighlighted1.value }, function() { window.scbtOptions.scbthighlighted1 = scbthighlighted1.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted1': '' }, function() { window.scbtOptions.scbthighlighted1 = ''; });
      }
    });
  }

  var scbthighlighted2 = document.getElementById('scbthighlighted2'); // highlight moderator messages color scbthighlighted3
  if (scbthighlighted2) {
    scbthighlighted2.addEventListener('change', e => {
      if (scbthighlighted2.value) {
        chrome.storage.sync.set({'scbthighlighted2': scbthighlighted2.value }, function() { window.scbtOptions.scbthighlighted2 = scbthighlighted2.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted2': '' }, function() { window.scbtOptions.scbthighlighted2 = ''; });
      }
    });
  }

  var scbthighlighted3 = document.getElementById('scbthighlighted3'); // highlight @ mention messages color scbthighlighted5
  if (scbthighlighted3) {
    scbthighlighted3.addEventListener('change', e => {
      if (scbthighlighted3.value) {
        chrome.storage.sync.set({'scbthighlighted3': scbthighlighted3.value }, function() { window.scbtOptions.scbthighlighted3 = scbthighlighted3.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted3': '' }, function() { window.scbtOptions.scbthighlighted3 = ''; });
      }
    });
  }

  var scbthighlighted4 = document.getElementById('scbthighlighted4'); // highlight hashtag messages color scbthighlighted4
  if (scbthighlighted4) {
    scbthighlighted4.addEventListener('change', e => {
      if (scbthighlighted4.value) {
        chrome.storage.sync.set({'scbthighlighted4': scbthighlighted4.value }, function() { window.scbtOptions.scbthighlighted4 = scbthighlighted4.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted4': '' }, function() { window.scbtOptions.scbthighlighted4 = ''; });
      }
    });
  }

  var scbthighlighted5 = document.getElementById('scbthighlighted5'); // highlight VIP messages color scbthighlighted5
  if (scbthighlighted5) {
    scbthighlighted5.addEventListener('change', e => {
      if (scbthighlighted5.value) {
        chrome.storage.sync.set({'scbthighlighted5': scbthighlighted5.value }, function() {  window.scbtOptions.scbthighlighted5 = scbthighlighted5.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted5': '' }, function() { window.scbtOptions.scbthighlighted5 = ''; });
      }
    });
  }

  var scbthighlighted6 = document.getElementById('scbthighlighted6'); // personal VIP List scbtchatfilter3
  if (scbthighlighted6) {
    scbthighlighted6.addEventListener('change', e => {
      if (scbthighlighted6.value) {
        chrome.storage.sync.set({'scbthighlighted6': scbthighlighted6.value }, function() { window.scbtOptions.scbthighlighted6 = scbthighlighted6.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted6': '' }, function() { window.scbtOptions.scbthighlighted6 = ''; });
      }
    });
  }

  var scbthighlighted7 = document.getElementById('scbthighlighted7'); // highlight these words in chat scbtchatfilter2
  if (scbthighlighted7) {
    scbthighlighted7.addEventListener('change', e => {
      if (scbthighlighted7.value) {
        chrome.storage.sync.set({'scbthighlighted7': scbthighlighted7.value }, function() { window.scbtOptions.scbthighlighted7 = scbthighlighted7.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted7': '' }, function() { window.scbtOptions.scbthighlighted7 = ''; });
      }
    });
  }


  var scbthighlighted8 = document.getElementById('scbthighlighted8'); // highlight founder messages color
  if (scbthighlighted8) {
    scbthighlighted8.addEventListener('change', e => {
      if (scbthighlighted8.value) {
        chrome.storage.sync.set({'scbthighlighted8': scbthighlighted8.value }, function() { window.scbtOptions.scbthighlighted8 = scbthighlighted8.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted8': '' }, function() { window.scbtOptions.scbthighlighted8 = ''; });
      }
    });
  }

  var scbthighlighted9 = document.getElementById('scbthighlighted9'); // highlight OG messages color
  if (scbthighlighted9) {
    scbthighlighted9.addEventListener('change', e => {
      if (scbthighlighted9.value) {
        chrome.storage.sync.set({'scbthighlighted9': scbthighlighted9.value }, function() { window.scbtOptions.scbthighlighted9 = scbthighlighted9.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted9': '' }, function() { window.scbtOptions.scbthighlighted9 = ''; });
      }
    });
  }

  var scbthighlighted10 = document.getElementById('scbthighlighted10'); // highlight owner messages color
  if (scbthighlighted10) {
    scbthighlighted10.addEventListener('change', e => {
      if (scbthighlighted10.value) {
        chrome.storage.sync.set({'scbthighlighted10': scbthighlighted10.value }, function() { window.scbtOptions.scbthighlighted10 = scbthighlighted10.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted10': '' }, function() { window.scbtOptions.scbthighlighted10 = ''; });
      }
    });
  }

  var scbthighlighted11 = document.getElementById('scbthighlighted11'); // highlight gifter messages color
  if (scbthighlighted11) {
    scbthighlighted11.addEventListener('change', e => {
      if (scbthighlighted11.value) {
        chrome.storage.sync.set({'scbthighlighted11': scbthighlighted11.value }, function() { window.scbtOptions.scbthighlighted11 = scbthighlighted11.value; });
      } else {
        chrome.storage.sync.set({'scbthighlighted11': '' }, function() { window.scbtOptions.scbthighlighted11 = ''; });
      }
    });
  }





  
  // MUTE
  var scbtmuted1 = document.getElementById('scbtmuted1'); // mute non moderator/sub messages scbtmuted4
  if (scbtmuted1) {
    scbtmuted1.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted1': true}, function() { window.scbtOptions.scbtmuted1 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted1': false}, function() { window.scbtOptions.scbtmuted1 = false; });
      }
    });
  }

  var scbtmuted2 = document.getElementById('scbtmuted2'); // mute owner/streamer messages scbtmuted2
  if (scbtmuted2) {
    scbtmuted2.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted2': true}, function() { window.scbtOptions.scbtmuted2 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted2': false}, function() { window.scbtOptions.scbtmuted2 = false; });
      }
    });
  }

  var scbtmuted3 = document.getElementById('scbtmuted3'); // mute @ mention messages scbtmuted1
  if (scbtmuted3) {
    scbtmuted3.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted3': true}, function() { window.scbtOptions.scbtmuted3 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted3': false}, function() { window.scbtOptions.scbtmuted3 = false; });
      }
    });
  }

  var scbtmuted4 = document.getElementById('scbtmuted4'); // mute bot messages/commands scbtmuted4
  if (scbtmuted4) {
    scbtmuted4.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted4': true}, function() { window.scbtOptions.scbtmuted4 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted4': false}, function() { window.scbtOptions.scbtmuted4 = false; });
      }
    });
  }

  var scbtmuted5 = document.getElementById('scbtmuted5'); // mute follow alert messages scbtmuted5
  if (scbtmuted5) {
    scbtmuted5.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted5': true}, function() { window.scbtOptions.scbtmuted5 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted5': false}, function() { window.scbtOptions.scbtmuted5 = false; });
      }
    });
  }

  var scbtmuted6 = document.getElementById('scbtmuted6'); // mute subscribe alert messages scbtmuted6
  if (scbtmuted6) {
    scbtmuted6.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtmuted6': true}, function() { window.scbtOptions.scbtmuted6 = true; });
      } else {
        chrome.storage.sync.set({'scbtmuted6': false}, function() { window.scbtOptions.scbtmuted6 = false; });
      }
    });
  }

  // HIDDEN
  var scbthidden1 = document.getElementById('scbthidden1'); // hide non moderator/sub messages scbthidden4
  if (scbthidden1) {
    scbthidden1.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden1': true}, function() { window.scbtOptions.scbthidden1 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden1': false}, function() { window.scbtOptions.scbthidden1 = false; });
      }
    });
  }

  var scbthidden2 = document.getElementById('scbthidden2'); // hide owner/streamer messages scbthidden2
  if (scbthidden2) {
    scbthidden2.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden2': true}, function() { window.scbtOptions.scbthidden2 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden2': false}, function() { window.scbtOptions.scbthidden2 = false; });
      }
    });
  }

  var scbthidden3 = document.getElementById('scbthidden3'); // hide @ mention messages scbthidden1
  if (scbthidden3) {
    scbthidden3.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden3': true}, function() { window.scbtOptions.scbthidden3 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden3': false}, function() { window.scbtOptions.scbthidden3 = false; });
      }
    });
  }

  var scbthidden4 = document.getElementById('scbthidden4'); // Hide bot/command messages scbthidden4
  if (scbthidden4) {
    scbthidden4.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden4': true}, function() { window.scbtOptions.scbthidden4 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden4': false}, function() { window.scbtOptions.scbthidden4 = false; });
      }
    });
  }

  var scbthidden5 = document.getElementById('scbthidden5'); // hide follow alert messages scbthidden5
  if (scbthidden5) {
    scbthidden5.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden5': true}, function() { window.scbtOptions.scbthidden5 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden5': false}, function() { window.scbtOptions.scbthidden5 = false; });
      }
    });
  }

  var scbthidden6 = document.getElementById('scbthidden6'); // hide subscribe alert messages scbthidden6
  if (scbthidden6) {
    scbthidden6.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden6': true}, function() { window.scbtOptions.scbthidden6 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden6': false}, function() { window.scbtOptions.scbthidden6 = false; });
      }
    });
  }

  var scbthidden7 = document.getElementById('scbthidden7'); // hide these words in chat. scbtchatfilter1
  if (scbthidden7) {
    scbthidden7.addEventListener('change', e => {
      if (scbthidden7.value) {
        chrome.storage.sync.set({'scbthidden7': scbthidden7.value }, function() { window.scbtOptions.scbthidden7 = scbthidden7.value; });
      } else {
        chrome.storage.sync.set({'scbthidden7': '' }, function() { window.scbtOptions.scbthidden7 = ''; });
      }
    });
  }

  var scbthidden8 = document.getElementById('scbthidden8'); // hide chats from these usernames
  if (scbthidden8) {
    scbthidden8.addEventListener('change', e => {
      if (scbthidden8.value) {
        chrome.storage.sync.set({'scbthidden8': scbthidden8.value }, function() { window.scbtOptions.scbthidden8 = scbthidden8.value; });
      } else {
        chrome.storage.sync.set({'scbthidden8': '' }, function() { window.scbtOptions.scbthidden8 = ''; });
      }
    });
  }

  var scbthidden9 = document.getElementById('scbthidden9'); // hide website links in chat
  if (scbthidden9) {
    scbthidden9.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden9': true}, function() { window.scbtOptions.scbthidden9 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden9': false}, function() { window.scbtOptions.scbthidden9 = false; });
      }
    });
  }

  var scbthidden10 = document.getElementById('scbthidden10'); // hide usernames on screen chat
  if (scbthidden10) {
    scbthidden10.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden10': true}, function() { window.scbtOptions.scbthidden10 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden10': false}, function() { window.scbtOptions.scbthidden10 = false; });
      }
    });
  }

  var scbthidden11 = document.getElementById('scbthidden11'); // hide sexual or body words in chat.
  if (scbthidden11) {
    scbthidden11.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden11': true}, function() { window.scbtOptions.scbthidden11 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden11': false}, function() { window.scbtOptions.scbthidden11 = false; });
      }
    });
  }

  var scbthidden12 = document.getElementById('scbthidden12'); // hide profanity in chat
  if (scbthidden12) {
    scbthidden12.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden12': true}, function() { window.scbtOptions.scbthidden12 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden12': false}, function() { window.scbtOptions.scbthidden12 = false; });
      }
    });
  }

  var scbthidden13 = document.getElementById('scbthidden13'); // hide USA political words in chat
  if (scbthidden13) {
    scbthidden13.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden13': true}, function() { window.scbtOptions.scbthidden13 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden13': false}, function() { window.scbtOptions.scbthidden13 = false; });
      }
    });
  }

  var scbthidden14 = document.getElementById('scbthidden14'); // hide negative words in chat
  if (scbthidden14) {
    scbthidden14.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbthidden14': true}, function() { window.scbtOptions.scbthidden14 = true; });
      } else {
        chrome.storage.sync.set({'scbthidden14': false}, function() { window.scbtOptions.scbthidden14 = false; });
      }
    });
  }

  // FEATURE
  var scbtfeature1 = document.getElementById('scbtfeature1'); // turn on basic keybinds
  if (scbtfeature1) {
    scbtfeature1.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature1': true}, function() { window.scbtOptions.scbtfeature1 = true; window.scbtKeybindsOn = true; });
      } else {
        chrome.storage.sync.set({'scbtfeature1': false}, function() { window.scbtOptions.scbtfeature1 = false; window.scbtKeybindsOn = false; });
      }
    });
  }

  var scbtfeature2 = document.getElementById('scbtfeature2'); // turn on full keybinds
  if (scbtfeature2) {
    scbtfeature2.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature2': true}, function() { window.scbtOptions.scbtfeature2 = true; scbt_helper_options_turn_on_keybinds(); });
      } else {
        chrome.storage.sync.set({'scbtfeature2': false}, function() { window.scbtOptions.scbtfeature2 = false; });
      }
    });
  }

  var scbtfeature3 = document.getElementById('scbtfeature3'); // turn on voice commands
  if (scbtfeature3) {
    scbtfeature3.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature3': true}, function() { window.scbtOptions.scbtfeature3 = true; });
      } else {
        chrome.storage.sync.set({'scbtfeature3': false}, function() { window.scbtOptions.scbtfeature3 = false; });
      }
    });
  }

  var scbtfeature4 = document.getElementById('scbtfeature4'); // turn on auto-saving of chat
  if (scbtfeature4) {
    scbtfeature4.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature4': true}, function() { window.scbtOptions.scbtfeature4 = true; window.location.reload(); });
      } else {
        chrome.storage.sync.set({'scbtfeature4': false}, function() { window.scbtOptions.scbtfeature4 = false; window.location.reload(); });
      }
    });
  }

  var scbtfeature5 = document.getElementById('scbtfeature5'); // turn on auto-showing of chat on screen
  if (scbtfeature5) {
    scbtfeature5.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature5': true}, function() { window.scbtOptions.scbtfeature5 = true; scbt_helper_chat_auto_show(); });
      } else {
        chrome.storage.sync.set({'scbtfeature5': false}, function() { window.scbtOptions.scbtfeature5 = false; scbt_helper_chat_auto_show(); });
      }
    });
  }

  var scbtfeature6 = document.getElementById('scbtfeature6'); // API key
  if (scbtfeature6) {
    scbtfeature6.addEventListener('change', e => {
      if (scbtfeature6.value) {
        chrome.storage.sync.set({'scbtfeature6': scbtfeature6.value }, function() { window.scbtOptions.scbtfeature6 = scbtfeature6.value; });
      } else {
        chrome.storage.sync.set({'scbtfeature6': '' }, function() { window.scbtOptions.scbtfeature6 = ''; });
      }
    });
  }

  var scbtfeature7 = document.getElementById('scbtfeature7'); // left handed chat scbtnormal5
  if (scbtfeature7) {
    scbtfeature7.addEventListener('change', e => {
      obj.a = 'scbtfeature7'; obj.b = false;
      if (e.target.checked) {
        obj.b = true;
        chrome.storage.sync.set({'scbtfeature7': true}, function() { window.scbtOptions.scbtfeature7 = true; scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbtfeature7': false}, function() { window.scbtOptions.scbtfeature7 = false; scbt_helper_apply_css_from_option(obj); });
      }
    });
  }


  var scbtfeature8 = document.getElementById('scbtfeature8'); // upside down chat scbtnormal6
  if (scbtfeature8) {
    scbtfeature8.addEventListener('change', e => {
      obj.a = 'scbtfeature8'; obj.b = false;
      if (e.target.checked) {
        obj.b = true;
        chrome.storage.sync.set({'scbtfeature8': true}, function() { window.scbtOptions.scbtfeature8 = true; scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbtfeature8': false}, function() { window.scbtOptions.scbtfeature8 = false; scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbtfeature9 = document.getElementById('scbtfeature9'); // mouseover enlarge chat scbtchatsize3
  if (scbtfeature9) {
    scbtfeature9.addEventListener('change', e => {
      obj.a = 'scbtfeature9'; obj.b = false;
      if (e.target.checked) {
        obj.b = true;
        chrome.storage.sync.set({'scbtfeature9': true}, function() { window.scbtOptions.scbtfeature9 = true; scbt_helper_apply_css_from_option(obj); });
      } else {
        chrome.storage.sync.set({'scbtfeature9': false}, function() { window.scbtOptions.scbtfeature9 = false; scbt_helper_apply_css_from_option(obj); });
      }
    });
  }

  var scbtfeature10 = document.getElementById('scbtfeature10'); // turn on press @ in chat
  if (scbtfeature10) {
    scbtfeature10.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature10': true}, function() { window.scbtOptions.scbtfeature10 = true; scbt_helper_turn_on_mention_menu(); });
      } else {
        chrome.storage.sync.set({'scbtfeature10': false}, function() { window.scbtOptions.scbtfeature10 = false; scbt_helper_turn_off_mention_menu(); });
      }
    });
  }

  var scbtfeature11 = document.getElementById('scbtfeature11'); // press on chat messages to mention
  if (scbtfeature11) {
    scbtfeature11.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({'scbtfeature11': true}, function() { window.scbtOptions.scbtfeature11 = true; scbt_helper_turn_on_press_chat_to_mention_menu(); });
      } else {
        chrome.storage.sync.set({'scbtfeature11': false}, function() { window.scbtOptions.scbtfeature11 = false; scbt_helper_turn_off_press_chat_to_mention_menu(); });
      }
    });
  }

  var scbtfeature12 = document.getElementById('scbtfeature12'); // speak chat list
  if (scbtfeature12) {
    scbtfeature12.addEventListener('change', e => {
      if (scbtfeature12.value) {
        chrome.storage.sync.set({'scbtfeature12': scbtfeature12.value }, function() { window.scbtOptions.scbtfeature12 = scbtfeature12.value; });
      } else {
        chrome.storage.sync.set({'scbtfeature12': '' }, function() { window.scbtOptions.scbtfeature12 = ''; });
      }
    });
  }

  return false;
}



function scbt_helper_get_options() {
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);

    if (items.scbttheme1) {
      var scbttheme1 = document.getElementById('scbttheme1');
      if (scbttheme1) {
        scbttheme1.value = items.scbttheme1;
        window.scbtOptions.scbttheme1 = items.scbttheme1;
        var obj  = {};
        obj.a = 'scbttheme1';
        obj.b = items.scbttheme1;
        scbt_helper_apply_css_from_option(obj);
      } else {
        scbttheme1.value = '';
        window.scbtOptions.scbttheme1 = '';
      }
    }

    if (items.scbttheme2) {
      var scbttheme2 = document.getElementById('scbttheme2');
      if (scbttheme2) {
        // console.log('username is saved as ' + items.scbttheme2 )
        scbttheme2.value = items.scbttheme2;
        window.scbtOptions.scbttheme2 = items.scbttheme2;
        var obj  = {};
        obj.a = 'scbttheme2';
        obj.b = items.scbttheme2;
        scbt_helper_apply_css_from_option(obj);
      } else {
        // console.log('username not saved');
        scbttheme2.value = '';
        window.scbtOptions.scbttheme2 = '';
      }
    }

    if (items.scbttheme3) {
      var scbttheme3 = document.getElementById('scbttheme3');
      if (scbttheme3) {
        // console.log('highlight is saved as ' + items.scbttheme3 )
        scbttheme3.value = items.scbttheme3;
        window.scbtOptions.scbttheme3 = items.scbttheme3;
        var obj  = {};
        obj.a = 'scbttheme3';
        obj.b = items.scbttheme3;
        scbt_helper_apply_css_from_option(obj);
      } else {
        // console.log('highlight not saved');
        scbttheme3.value = '';
        window.scbtOptions.scbttheme3 = '';
      }
    }

    if (items.scbttheme4) {
      var scbttheme4 = document.getElementById('scbttheme4');
      if (scbttheme4) {
        // console.log('chat color is saved as ' + items.scbttheme4 )
        scbttheme4.value = items.scbttheme4;
        window.scbtOptions.scbttheme4 = items.scbttheme4;
        var obj  = {};
        obj.a = 'scbttheme4';
        obj.b = items.scbttheme4;
        scbt_helper_apply_css_from_option(obj);
      } else {
        // console.log('chat color not saved');
        scbttheme4.value = '';
        window.scbtOptions.scbttheme4 = '';
      }
    }

    if (items.scbttheme5) {
      var scbttheme5 = document.getElementById('scbttheme5');
      if (scbttheme5) {
        // console.log('font size is saved as ' + items.scbttheme5 )
        scbttheme5.value = items.scbttheme5;
        window.scbtOptions.scbttheme5 = items.scbttheme5;
        var obj  = {};
        obj.a = 'scbttheme5';
        obj.b = items.scbttheme5;
        scbt_helper_apply_css_from_option(obj);
      } else {
        // console.log('font size not saved');
        scbttheme5.value = '';
        window.scbtOptions.scbttheme5 = '';
      }
    }

    if (items.scbttheme6) {
      var scbttheme6 = document.getElementById('scbttheme6');
      if (scbttheme6) {
        // console.log('TEXT ONLY is saved as ' + items.scbttheme6 )
        scbttheme6.checked = items.scbttheme6;
        window.scbtOptions.scbttheme6 = items.scbttheme6;
        var obj  = {};
        obj.a = 'scbttheme6';
        obj.b = items.scbttheme6;
        if (items.scbttheme6 === true) {
          scbt_helper_apply_css_from_option(obj);
        }
      } else {
        // console.log('text only not saved');
        scbttheme6.checked = false;
        window.scbtOptions.scbttheme6 = false;
      }
    }

    if (items.scbthighlighted1) {
      var scbthighlighted1 = document.getElementById('scbthighlighted1');
      if (scbthighlighted1) {
        // console.log('scbthighlighted1 is saved as ' + items.scbthighlighted1 )
        scbthighlighted1.value = items.scbthighlighted1;
        window.scbtOptions.scbthighlighted1 = items.scbthighlighted1;
      } else {
        // console.log('scbthighlighted1 not saved');
        scbthighlighted1.value = '';
        window.scbtOptions.scbthighlighted1 = '';
      }
    }

    if (items.scbthighlighted2) {
      var scbthighlighted2 = document.getElementById('scbthighlighted2');
      if (scbthighlighted2) {
        // console.log('scbthighlighted2 is saved as ' + items.scbthighlighted2 )
        scbthighlighted2.value = items.scbthighlighted2;
        window.scbtOptions.scbthighlighted2 = items.scbthighlighted2;
      } else {
        // console.log('scbthighlighted2 not saved');
        scbthighlighted2.value = '';
        window.scbtOptions.scbthighlighted2 = '';
      }
    }

    if (items.scbthighlighted3) {
      var scbthighlighted3 = document.getElementById('scbthighlighted3');
      if (scbthighlighted3) {
        // console.log('scbthighlighted3 is saved as ' + items.scbthighlighted3 )
        scbthighlighted3.value = items.scbthighlighted3;
        window.scbtOptions.scbthighlighted3 = items.scbthighlighted3;
      } else {
        // console.log('scbthighlighted3 not saved');
        scbthighlighted3.value = '';
        window.scbtOptions.scbthighlighted3 = '';
      }
    }

    if (items.scbthighlighted4) {
      var scbthighlighted4 = document.getElementById('scbthighlighted4');
      if (scbthighlighted4) {
       //  console.log('scbthighlighted4 is saved as ' + items.scbthighlighted4 )
        scbthighlighted4.value = items.scbthighlighted4;
        window.scbtOptions.scbthighlighted4 = items.scbthighlighted4;
      } else {
        // console.log('scbthighlighted4 not saved');
        scbthighlighted4.value = '';
        window.scbtOptions.scbthighlighted4 = '';
      }
    }

    if (items.scbthighlighted5) {
      var scbthighlighted5 = document.getElementById('scbthighlighted5');
      if (scbthighlighted5) {
        // console.log('scbthighlighted5 is saved as ' + items.scbthighlighted5 )
        scbthighlighted5.value = items.scbthighlighted5;
        window.scbtOptions.scbthighlighted5 = items.scbthighlighted5;
      } else {
        // console.log('scbthighlighted5 not saved');
        scbthighlighted5.value = '';
        window.scbtOptions.scbthighlighted5 = '';
      }
    }

    if (items.scbthighlighted6) {
      var scbthighlighted6 = document.getElementById('scbthighlighted6');
      if (scbthighlighted6) {
        // console.log('scbthighlighted6 is saved as ' + items.scbthighlighted6 )
        scbthighlighted6.value = items.scbthighlighted6;
        window.scbtOptions.scbthighlighted6 = items.scbthighlighted6;
      } else {
       //  console.log('scbthighlighted6 not saved');
        scbthighlighted6.value = '';
        window.scbtOptions.scbthighlighted6 = '';
      }
    }

    if (items.scbthighlighted7) {
      var scbthighlighted7 = document.getElementById('scbthighlighted7');
      if (scbthighlighted7) {
        // console.log('scbthighlighted7 is saved as ' + items.scbthighlighted7 )
        scbthighlighted7.value = items.scbthighlighted7;
        window.scbtOptions.scbthighlighted7 = items.scbthighlighted7;
      } else {
        // console.log('scbthighlighted7 not saved');
        scbthighlighted7.value = '';
        window.scbtOptions.scbthighlighted7 = '';
      }
    }

    if (items.scbthighlighted8) {
      var scbthighlighted8 = document.getElementById('scbthighlighted8');
      if (scbthighlighted8) {
        // console.log('scbthighlighted8 is saved as ' + items.scbthighlighted8 )
        scbthighlighted8.value = items.scbthighlighted8;
        window.scbtOptions.scbthighlighted8 = items.scbthighlighted8;
      } else {
        // console.log('scbthighlighted8 not saved');
        scbthighlighted8.value = '';
        window.scbtOptions.scbthighlighted8 = '';
      }
    }

    if (items.scbthighlighted9) {
      var scbthighlighted9 = document.getElementById('scbthighlighted9');
      if (scbthighlighted9) {
        // console.log('scbthighlighted9 is saved as ' + items.scbthighlighted9 )
        scbthighlighted9.value = items.scbthighlighted9;
        window.scbtOptions.scbthighlighted9 = items.scbthighlighted9;
      } else {
        // console.log('scbthighlighted9 not saved');
        scbthighlighted9.value = '';
        window.scbtOptions.scbthighlighted9 = '';
      }
    }

    if (items.scbthighlighted10) {
      var scbthighlighted10 = document.getElementById('scbthighlighted10');
      if (scbthighlighted10) {
        // console.log('scbthighlighted10 is saved as ' + items.scbthighlighted10 )
        scbthighlighted10.value = items.scbthighlighted10;
        window.scbtOptions.scbthighlighted10 = items.scbthighlighted10;
      } else {
        // console.log('scbthighlighted10 not saved');
        scbthighlighted10.value = '';
        window.scbtOptions.scbthighlighted10 = '';
      }
    }

    if (items.scbthighlighted11) {
      var scbthighlighted11 = document.getElementById('scbthighlighted11');
      if (scbthighlighted11) {
        // console.log('scbthighlighted11 is saved as ' + items.scbthighlighted11 )
        scbthighlighted11.value = items.scbthighlighted11;
        window.scbtOptions.scbthighlighted11 = items.scbthighlighted11;
      } else {
        // console.log('scbthighlighted11 not saved');
        scbthighlighted11.value = '';
        window.scbtOptions.scbthighlighted11 = '';
      }
    }




    if (items.scbtmuted1) {
      var scbtmuted1 = document.getElementById('scbtmuted1');
      if (scbtmuted1) {
        // console.log('scbtmuted1 is saved as ' + items.scbtmuted1 )
        scbtmuted1.checked = items.scbtmuted1;
        window.scbtOptions.scbtmuted1 = items.scbtmuted1;
      } else {
        // console.log('scbtmuted1 not saved');
        scbtmuted1.checked = false;
        window.scbtOptions.scbtmuted1 = false;
      }
    }

    if (items.scbtmuted2) {
      var scbtmuted2 = document.getElementById('scbtmuted2');
      if (scbtmuted2) {
        // console.log('scbtmuted2 is saved as ' + items.scbtmuted2 )
        scbtmuted2.checked = items.scbtmuted2;
        window.scbtOptions.scbtmuted2 = items.scbtmuted2;
      } else {
        // console.log('scbtmuted2 not saved');
        scbtmuted2.checked = false;
        window.scbtOptions.scbtmuted2 = false;
      }
    }

    if (items.scbtmuted3) {
      var scbtmuted3 = document.getElementById('scbtmuted3');
      if (scbtmuted3) {
        // console.log('scbtmuted3 is saved as ' + items.scbtmuted3 )
        scbtmuted3.checked = items.scbtmuted3;
        window.scbtOptions.scbtmuted3 = items.scbtmuted3;
      } else {
        // console.log('scbtmuted3 not saved');
        scbtmuted3.checked = false;
        window.scbtOptions.scbtmuted3 = false;
      }
    }

    if (items.scbtmuted4) {
      var scbtmuted4 = document.getElementById('scbtmuted4');
      if (scbtmuted4) {
        // console.log('scbtmuted4 is saved as ' + items.scbtmuted4 )
        scbtmuted4.checked = items.scbtmuted4;
        window.scbtOptions.scbtmuted4 = items.scbtmuted4;
      } else {
        // console.log('scbtmuted4 not saved');
        scbtmuted4.checked = false;
        window.scbtOptions.scbtmuted4 = false;
      }
    }

    if (items.scbtmuted5) {
      var scbtmuted5 = document.getElementById('scbtmuted5');
      if (scbtmuted5) {
        // console.log('scbtmuted5 is saved as ' + items.scbtmuted5 )
        scbtmuted5.checked = items.scbtmuted5;
        window.scbtOptions.scbtmuted5 = items.scbtmuted5;
      } else {
        // console.log('scbtmuted5 not saved');
        scbtmuted5.checked = false;
        window.scbtOptions.scbtmuted5 = false;
      }
    }

    if (items.scbtmuted6) {
      var scbtmuted6 = document.getElementById('scbtmuted6');
      if (scbtmuted6) {
        // console.log('scbtmuted6 is saved as ' + items.scbtmuted6 )
        scbtmuted6.checked = items.scbtmuted6;
        window.scbtOptions.scbtmuted6 = items.scbtmuted6;
      } else {
        // console.log('scbtmuted6 not saved');
        scbtmuted6.checked = false;
        window.scbtOptions.scbtmuted6 = false;
      }
    }


    if (items.scbthidden1) {
      var scbthidden1 = document.getElementById('scbthidden1');
      if (scbthidden1) {
        // console.log('scbthidden1 is saved as ' + items.scbthidden1 )
        scbthidden1.checked = items.scbthidden1;
        window.scbtOptions.scbthidden1 = items.scbthidden1;
      } else {
       //  console.log('scbthidden1 not saved');
        scbthidden1.checked = false;
        window.scbtOptions.scbthidden1 = false;
      }
    }

    if (items.scbthidden2) {
      var scbthidden2 = document.getElementById('scbthidden2');
      if (scbthidden2) {
       // console.log('scbthidden2 is saved as ' + items.scbthidden2 )
        scbthidden2.checked = items.scbthidden2;
        window.scbtOptions.scbthidden2 = items.scbthidden2;
      } else {
        // console.log('scbthidden2 not saved');
        scbthidden2.checked = false;
        window.scbtOptions.scbthidden2 = false;
      }
    }

    if (items.scbthidden3) {
      var scbthidden3 = document.getElementById('scbthidden3');
      if (scbthidden3) {
        // console.log('scbthidden3 is saved as ' + items.scbthidden3 )
        scbthidden3.checked = items.scbthidden3;
        window.scbtOptions.scbthidden3 = items.scbthidden3;
      } else {
        // console.log('scbthidden3 not saved');
        scbthidden3.checked = false;
        window.scbtOptions.scbthidden3 = false;
      }
    }

    if (items.scbthidden4) {
      var scbthidden4 = document.getElementById('scbthidden4');
      if (scbthidden4) {
        // console.log('scbthidden4 is saved as ' + items.scbthidden4 )
        scbthidden4.checked = items.scbthidden4;
        window.scbtOptions.scbthidden4 = items.scbthidden4;
      } else {
        // console.log('scbthidden4 not saved');
        scbthidden4.checked = false;
        window.scbtOptions.scbthidden4 = false;
      }
    }

    if (items.scbthidden5) {
      var scbthidden5 = document.getElementById('scbthidden5');
      if (scbthidden5) {
        // console.log('scbthidden5 is saved as ' + items.scbthidden5 )
        scbthidden5.checked = items.scbthidden5;
        window.scbtOptions.scbthidden5 = items.scbthidden5;
      } else {
        // console.log('scbthidden5 not saved');
        scbthidden5.checked = false;
        window.scbtOptions.scbthidden5 = false;
      }
    }

    if (items.scbthidden6) {
      var scbthidden6 = document.getElementById('scbthidden6');
      if (scbthidden6) {
       //  console.log('scbthidden6 is saved as ' + items.scbthidden6 )
        scbthidden6.checked = items.scbthidden6;
        window.scbtOptions.scbthidden6 = items.scbthidden6;
      } else {
      //   console.log('scbthidden6 not saved');
        scbthidden6.checked = false;
        window.scbtOptions.scbthidden6 = false;
      }
    }

    if (items.scbthidden7) {
      var scbthidden7 = document.getElementById('scbthidden7');
      if (scbthidden7) {
     //    console.log('scbthidden7 is saved as ' + items.scbthidden7 )
        scbthidden7.value = items.scbthidden7;
        window.scbtOptions.scbthidden7 = items.scbthidden7;
      } else {
     //    console.log('scbthidden7 not saved');
        scbthidden7.value = '';
        window.scbtOptions.scbthidden7 = '';
      }
    }

    if (items.scbthidden8) {
      var scbthidden8 = document.getElementById('scbthidden8');
      if (scbthidden8) {
      //   console.log('scbthidden8 is saved as ' + items.scbthidden8 )
        scbthidden8.value = items.scbthidden8;
        window.scbtOptions.scbthidden8 = items.scbthidden8;
      } else {
      //   console.log('scbthidden8 not saved');
        scbthidden8.value = '';
        window.scbtOptions.scbthidden8 = '';
      }
    }

    if (items.scbthidden9) {
      var scbthidden9 = document.getElementById('scbthidden9');
      if (scbthidden9) {
        // console.log('scbthidden9 is saved as ' + items.scbthidden9 )
        scbthidden9.checked = items.scbthidden9;
        window.scbtOptions.scbthidden9 = items.scbthidden9;
      } else {
        // console.log('scbthidden9 not saved');
        scbthidden9.checked = false;
        window.scbtOptions.scbthidden9 = false;
      }
    }

    if (items.scbthidden10) {
      var scbthidden10 = document.getElementById('scbthidden10');
      if (scbthidden10) {
        // console.log('scbthidden10 is saved as ' + items.scbthidden10 )
        scbthidden10.checked = items.scbthidden10;
        window.scbtOptions.scbthidden10 = items.scbthidden10;
      } else {
        // console.log('scbthidden10 not saved');
        scbthidden10.checked = false;
        window.scbtOptions.scbthidden10 = false;
      }
    }

    if (items.scbthidden11) {
      var scbthidden11 = document.getElementById('scbthidden11');
      if (scbthidden11) {
       //  console.log('scbthidden11 is saved as ' + items.scbthidden11 )
        scbthidden11.checked = items.scbthidden11;
        window.scbtOptions.scbthidden11 = items.scbthidden11;
        scbt_helper_get_sexual_json();
      } else {
        // console.log('scbthidden11 not saved');
        scbthidden11.checked = false;
        window.scbtOptions.scbthidden11 = false;
      }
    }

    if (items.scbthidden12) {
      var scbthidden12 = document.getElementById('scbthidden12');
      if (scbthidden12) {
       //  console.log('scbthidden12 is saved as ' + items.scbthidden12 )
        scbthidden12.checked = items.scbthidden12;
        window.scbtOptions.scbthidden12 = items.scbthidden12;
        scbt_helper_get_profanity_json();
      } else {
        // console.log('scbthidden12 not saved');
        scbthidden12.checked = false;
        window.scbtOptions.scbthidden12 = false;
      }
    }

    if (items.scbthidden13) {
      var scbthidden13 = document.getElementById('scbthidden13');
      if (scbthidden13) {
        // console.log('scbthidden13 is saved as ' + items.scbthidden13 )
        scbthidden13.checked = items.scbthidden13;
        window.scbtOptions.scbthidden13 = items.scbthidden13;
        scbt_helper_get_political_json();
      } else {
        // console.log('scbthidden13 not saved');
        scbthidden13.checked = false;
        window.scbtOptions.scbthidden13 = false;
      }
    }

    if (items.scbthidden14) {
      var scbthidden14 = document.getElementById('scbthidden14');
      if (scbthidden14) {
        // console.log('scbthidden14 is saved as ' + items.scbthidden14 )
        scbthidden14.checked = items.scbthidden14;
        window.scbtOptions.scbthidden14 = items.scbthidden14;
        scbt_helper_get_negative_json();
      } else {
        // console.log('scbthidden14 not saved');
        scbthidden14.checked = false;
        window.scbtOptions.scbthidden14 = false;
      }
    }

    if (items.scbtfeature1) {
      var scbtfeature1 = document.getElementById('scbtfeature1');
      if (scbtfeature1) {
        // console.log('scbtfeature1 is saved as ' + items.scbtfeature1 )
        scbtfeature1.checked = items.scbtfeature1;
        window.scbtOptions.scbtfeature1 = items.scbtfeature1;
        if (items.scbtfeature1 === true) {
          window.scbtKeybindsOn = true;
        } else {
          window.scbtKeybindsOn = false;
        }
      } else {
       //  console.log('scbtfeature1 not saved');
        scbtfeature1.checked = false;
        window.scbtOptions.scbtfeature1 = false;
        window.scbtKeybindsOn = false;
      }
    }

    if (items.scbtfeature2) {
      var scbtfeature2 = document.getElementById('scbtfeature2');
      if (scbtfeature2) {
       //  console.log('scbtfeature2 is saved as ' + items.scbtfeature2 )
        scbtfeature2.checked = items.scbtfeature2;
        window.scbtOptions.scbtfeature2 = items.scbtfeature2;
        if (items.scbtfeature2 === true) {
          scbt_helper_options_turn_on_keybinds();
        }
      } else {
        // console.log('scbtfeature2 not saved');
        scbtfeature2.checked = false;
        window.scbtOptions.scbtfeature2 = false;
      }
    }

    if (items.scbtfeature3) {
      var scbtfeature3 = document.getElementById('scbtfeature3');
      if (scbtfeature3) {
       //  console.log('scbtfeature3 is saved as ' + items.scbtfeature3 )
        scbtfeature3.checked = items.scbtfeature3;
        window.scbtOptions.scbtfeature3 = items.scbtfeature3;
      } else {
       //  console.log('scbtfeature3 not saved');
        scbtfeature3.checked = false;
        window.scbtOptions.scbtfeature3 = false;
      }
    }

    if (items.scbtfeature4) {
      var scbtfeature4 = document.getElementById('scbtfeature4');
      if (scbtfeature4) {
       //  console.log('scbtfeature4 is saved as ' + items.scbtfeature4 )
        scbtfeature4.checked = items.scbtfeature4;
        window.scbtOptions.scbtfeature4 = items.scbtfeature4;
      } else {
      //   console.log('scbtfeature4 not saved');
        scbtfeature4.checked = false;
        window.scbtOptions.scbtfeature4 = false;
      }
    }

    if (items.scbtfeature5) {
      var scbtfeature5 = document.getElementById('scbtfeature5');
      if (scbtfeature5) {
      //   console.log('scbtfeature5 is saved as ' + items.scbtfeature5 )
        scbtfeature5.checked = items.scbtfeature5;
        window.scbtOptions.scbtfeature5 = items.scbtfeature5;
        scbt_helper_chat_auto_show();
      } else {
      //   console.log('scbtfeature5 not saved');
        scbtfeature5.checked = false;
        window.scbtOptions.scbtfeature5 = false;
      }
    }

    if (items.scbtfeature6) {
      var scbtfeature6 = document.getElementById('scbtfeature6');
      if (scbtfeature6) {
      //   console.log('scbtfeature6 is saved as ' + items.scbtfeature6 )
        scbtfeature6.value = items.scbtfeature6;
        window.scbtOptions.scbtfeature6 = items.scbtfeature6;
      } else {
      //   console.log('scbtfeature6 not saved');
        scbtfeature6.value = '';
        window.scbtOptions.scbtfeature6 = '';
      }
    }

    if (items.scbtfeature7) {
      var scbtfeature7 = document.getElementById('scbtfeature7');
      if (scbtfeature7) {
       //  console.log('scbtfeature7 left handed chat is saved as ' + items.scbtfeature7 )
        scbtfeature7.checked = items.scbtfeature7;
        window.scbtOptions.scbtfeature7 = items.scbtfeature7;
        var obj  = {};
        obj.a = 'scbtfeature7';
        obj.b = items.scbtfeature7;
        scbt_helper_apply_css_from_option(obj);
      } else {
       //  console.log('scbtfeature7 not saved');
        scbtfeature7.checked = false;
        window.scbtOptions.scbtfeature7 = false;
      }
    }

    if (items.scbtfeature8) {
      var scbtfeature8 = document.getElementById('scbtfeature8');
      if (scbtfeature8) {
       //  console.log('scbtfeature8 is saved as ' + items.scbtfeature8 )
        scbtfeature8.checked = items.scbtfeature8;
        window.scbtOptions.scbtfeature8 = items.scbtfeature8;
        var obj  = {};
        obj.a = 'scbtfeature8';
        obj.b = items.scbtfeature8;
        scbt_helper_apply_css_from_option(obj);
      } else {
       //  console.log('scbtfeature8 not saved');
        scbtfeature8.checked = false;
        window.scbtOptions.scbtfeature8 = false;
      }
    }

    if (items.scbtfeature9) {
      var scbtfeature9 = document.getElementById('scbtfeature9');
      if (scbtfeature9) {
       //  console.log('scbtfeature9 is saved as ' + items.scbtfeature9 )
        scbtfeature9.checked = items.scbtfeature9;
        window.scbtOptions.scbtfeature9 = items.scbtfeature9;
        if (items.scbtfeature9) {
          var obj = {};
          obj.a = 'scbtfeature9';
          obj.b = true;
          scbt_helper_apply_css_from_option(obj);  
        }
      } else {
       //  console.log('scbtfeature9 not saved');
        scbtfeature9.checked = false;
        window.scbtOptions.scbtfeature9 = false;
      }
    }

    if (items.scbtfeature10) {
      var scbtfeature10 = document.getElementById('scbtfeature10');
      if (scbtfeature10) {
       //  console.log('scbtfeature10 mention menu is saved as ' + items.scbtfeature10 )
        scbtfeature10.checked = items.scbtfeature10;
        window.scbtOptions.scbtfeature10 = items.scbtfeature10;
        if (items.scbtfeature10 === true) {
          scbt_helper_turn_on_mention_menu();
        } else {
          scbt_helper_turn_off_mention_menu();
        }

      } else {
       // console.log('scbtfeature10 not saved');
        scbtfeature10.checked = false;
        window.scbtOptions.scbtfeature10 = false;
        scbt_helper_turn_off_mention_menu();
      }
    }

    if (items.scbtfeature11) {
      var scbtfeature11 = document.getElementById('scbtfeature11');
      if (scbtfeature11) {
       //  console.log('scbtfeature11 press chat to mention is saved as ' + items.scbtfeature11 )
        scbtfeature11.checked = items.scbtfeature11;
        window.scbtOptions.scbtfeature11 = items.scbtfeature11;
        if (items.scbtfeature11 === true) {
          scbt_helper_turn_on_press_chat_to_mention_menu();
        } else {
          scbt_helper_turn_off_press_chat_to_mention_menu();
        }
      } else {
       //  console.log('scbtfeature11 not saved');
        scbtfeature11.checked = false;
        window.scbtOptions.scbtfeature11 = false;
        scbt_helper_turn_off_press_chat_to_mention_menu();
      }
    }

    if (items.scbtfeature12) {
      var scbtfeature12 = document.getElementById('scbtfeature12');
      if (scbtfeature12) {
        // console.log('scbtfeature12 is saved as ' + items.scbtfeature12 )
        scbtfeature12.value = items.scbtfeature12;
        window.scbtOptions.scbtfeature12 = items.scbtfeature12;
      } else {
       //  console.log('scbtfeature12 not saved');
        scbtfeature12.value = '';
        window.scbtOptions.scbtfeature12 = '';
      }
    }

    var chats = scbt_get_chat_messages(); 
    [].forEach.call(chats, function(chat) {
      scbt_helper_process_chat_line(chat, false);
    });
    scbt_helper_chat_listen();
    items = null; chat = null; chats = null;
  });
  return false;
}




function scbt_helper_turn_on_mention_menu() {
  setTimeout(function() {
    window.scbtMentionMenuRef = document.getElementById('scbtMentionMenu');
    window.scbtCloseMentionButtonRef = document.getElementById('scbtCloseMentionButton');
    window.scbtCloseMentionButtonRef.addEventListener('click', scbt_user_chat_close_mention_menu);
    window.scbtChatInputRef.addEventListener('input', scbt_user_chat_mention_menu);
    window.scbtChatSearchInputTextRef.addEventListener('input', scbt_user_chat_mention_menu);
  }, 1000);
  return false;
}


function scbt_helper_turn_off_mention_menu() {
  setTimeout(function() {
    window.scbtMentionMenuRef = document.getElementById('scbtMentionMenu');
    window.scbtCloseMentionButtonRef = document.getElementById('scbtCloseMentionButton');
    window.scbtCloseMentionButtonRef.removeEventListener('click', scbt_user_chat_close_mention_menu);
    window.scbtChatInputRef.removeEventListener('input', scbt_user_chat_mention_menu);
    window.scbtChatSearchInputTextRef.removeEventListener('input', scbt_user_chat_mention_menu);
  }, 1000);
  return false;
}


function scbt_helper_turn_on_press_chat_to_mention_menu() {
    var chats = scbt_get_chat_messages();
    if (chats) {
      [].forEach.call(chats, function(chat) {
        if (chat) {
          chat.classList.add('scbt-clickable');
        }
      });
    }
    chats = null; chat = null; 
    setTimeout(function() {
        var elements = document.getElementsByClassName('scbt-clickable');
        var arrl = elements.length;
        for (var i = 0; i < arrl; i++) {
            elements[i].addEventListener('click', scbt_helper_mention_menu_click_handler, false);
        }
        elements = null; arrl = null; return false;
    }, 2000);
}


function scbt_helper_mention_menu_click_handler(e) {
    e.preventDefault();
    var el = this.parentElement;
    if (el) {
      var elel = el.parentElement;
      if (elel) {
        var un = elel.querySelector('.chat-entry-username');
        if (un) {
          window.scbtChatInputRef.value = '@' + un.innerText + ' ';
          window.scbtChatInputRef.innerText = '@' + un.innerText + ' ';
          window.scbtChatInputRef.focus();
          window.scbtChatSearchInputTextRef.value = '@' + un.innerText + ' ';
          return false;
        }
      }
    }
};


function scbt_helper_turn_off_press_chat_to_mention_menu() {
  setTimeout(function() {
    var elements = document.getElementsByClassName('scbt-clickable');
    var arrl = elements.length;
    for (var i = 0; i < arrl; i++) {
      elements[i].removeEventListener('click', scbt_helper_mention_menu_click_handler, false);
    }
  }, 1000);
  return false;
}


function scbt_helper_get_menu(app, element, thefile, firstTime) {
    var x = document.getElementById(element);
    if (x) {  } else {
      var url = chrome.runtime.getURL(thefile);
      fetch(url)
      .then((response) => response.text())
      .then((html) => {

        app.insertAdjacentHTML('afterbegin', html );
      
        if (element == 'scbtSideMenu') {
          window.scbtSideMenuRef = document.getElementById('scbtSideMenu');
          document.getElementById('scbt2').addEventListener('click', scbt_user_toggle_options_menu);
          document.getElementById('scbt4').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt5').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt6').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt7').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt8').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt9').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt10').addEventListener('click', scbt_user_chat_non_bot);
          document.getElementById('scbt11').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt12').addEventListener('click', scbt_user_toggle_chats);
          document.getElementById('scbt13').addEventListener('click', scbt_user_chat_text_only);
          document.getElementById('scbt14').addEventListener('click', scbt_user_chat_up_to_top);
          document.getElementById('scbt15').addEventListener('click', scbt_user_chat_down_to_bottom);
          document.getElementById('scbt16').addEventListener('click', scbt_user_chat_full_screen_width);
          document.getElementById('scbt17').addEventListener('click', scbt_user_full_screen_height_chat);
          document.getElementById('scbt20').addEventListener('click', scbt_user_chat_font_size);
          document.getElementById('scbt22').addEventListener('click', scbt_user_search_chat);
          document.getElementById('scbt23').addEventListener('click', scbt_user_search_chat);
          return window.scbtSideMenuRef;
        } // if (element == 'scbtSideMenu') {


        if (element == 'scbtChatWrapper') {
          window.scbtChatWrapperRef = document.getElementById('scbtChatWrapper');
          window.scbtCloseButtonRef = document.getElementById('scbtCloseButton');
          window.scbtCloseButtonRef.addEventListener('click', scbt_user_search_chat_toggle);
          window.scbtChatARef = document.getElementById('scbtChatA');
          window.scbtChatBRef = document.getElementById('scbtChatB');
          window.scbtChatContentRef = document.getElementById('scbtChatContent');
          return window.scbtChatWrapperRef;
        }

        if (element == 'scbtChatMenu') {
          window.scbtChatMenuRef = document.getElementById('scbtChatMenu');
          window.scbtChatSearchInputTextRef = document.getElementById('scbtChatSearchInputText');
          window.scbtChatSearchStartsWithButtonRef = document.getElementById('scbtChatSearchStartsWithButton');
          window.scbtChatSearchUserButtonRef = document.getElementById('scbtChatSearchUserButton');
          window.scbtChatSearchKeywordButtonRef = document.getElementById('scbtChatSearchKeywordButton');
          window.scbtChatSearchEventsButtonRef = document.getElementById('scbtChatSearchEventsButton');
          window.scbtChatSearchFullButtonRef = document.getElementById('scbtChatSearchFullButton');

          window.scbtChatSearchFullButtonRef.addEventListener('click', scbt_user_search_saved_chat);
          window.scbtChatSearchKeywordButtonRef.addEventListener('click', scbt_user_search_saved_chat);
          window.scbtChatSearchUserButtonRef.addEventListener('click', scbt_user_search_saved_chat);
          window.scbtChatSearchEventsButtonRef.addEventListener('click', scbt_user_search_saved_chat);
          window.scbtChatSearchStartsWithButtonRef.addEventListener('click', scbt_user_search_saved_chat);
          return window.scbtChatMenuRef;
        }

        if (element == 'scbtOptionsMenu') {
          window.scbtOptionsMenuRef = document.getElementById('scbtOptionsMenu');
          window.scbtChatPreviousTitleRef = document.getElementById('scbtChatPreviousTitle');
          window.scbtChatPreviousWrapperRef = document.getElementById('scbtChatPreviousWrapper');
          window.scbtOptionsTitleRef = document.getElementById('scbtOptionsTitle');
          window.scbtOptionsWrapperRef = document.getElementById('scbtOptionsWrapper');
          window.scbtChatLogRef = document.getElementById('scbtChatLog');
          window.scbtChatPreviousContentRef = document.getElementById('scbtChatPreviousContent');
          window.scbtvideo6Ref = document.getElementById('scbtvideo6');
          window.scbtvideo7Ref = document.getElementById('scbtvideo7');
          window.scbtSocialMediaShareOptionsRef = document.getElementById('scbtSocialMediaShareOptions');
          window.scbtSocialMediaShareCustomOptionsRef = document.getElementById('scbtSocialMediaShareCustomOptions');
          window.scbtSocialSubmitButtonRef = document.getElementById('scbtSocialSubmitButton');

          scbt_helper_get_social_media_json(app);
          
          var y = document.getElementById('scbt2');
          if (y) { y.classList.add('lawngreen'); }
          scbt_user_toggle_chat_menu();
          setTimeout(function() {
            if (y) { y.classList.remove('lawngreen'); }
            scbt_user_toggle_chat_menu();
          }, 2000);

          scbt_helper_save_options();
          scbt_helper_get_options(firstTime);
          scbt_user_csv_upload_chat_log();
          
          var xx = document.getElementById('scbttwelveOptions');
          if (xx) {
            xx.addEventListener('click', scbt_helper_toggle_options_wrapper);
          }

          var scbt_user_options_menu_click_handler = function() {
            if (this.id == 'scbtOptionsSavedTitle') {
              if (document.getElementById('scbtOptionsSavedWrapper').classList.contains('scbt-bl') ) {
                document.getElementById('scbtOptionsSavedWrapper').classList.remove('scbt-bl');
                document.getElementById('scbtChatPreviousContent').innerHTML = '';
              } else {
                document.getElementById('scbtOptionsSavedWrapper').classList.add('scbt-bl');
                scbt_helper_build_list_of_all_dbs();
              }
            } 

            else if (this.id == 'scbtOptionsImportTitle') {
              if (document.getElementById('scbtOptionsImportWrapper').classList.contains('scbt-bl') ) {
                document.getElementById('scbtOptionsImportWrapper').classList.remove('scbt-bl');
              } else {
                document.getElementById('scbtOptionsImportWrapper').classList.add('scbt-bl');
              }
            }

            else {
              var z = this.nextElementSibling;
              if (z) {
                if (z.classList.contains('scbt-bl') ) {
                  z.classList.remove('scbt-bl');
                } else {
                  z.classList.add('scbt-bl');
                }
              }
            }
          };

          var arr = document.getElementsByClassName('scbt-options-title');
          for (var i = 0; i < arr.length; i++) {
            arr[i].addEventListener('click', scbt_user_options_menu_click_handler, false);
          }
          
          return window.scbtOptionsMenuRef;
        } // if (element == 'scbtOptionsMenu') {

        }).catch((error) => {
          console.log("ERROR!");
          console.error(error);
          return true;
        });
  } // if var x = document.getElementById(element);
} // end scbt_helper_get_menu


function scbt_helper_toggle_options_wrapper(e) {
  var x = document.getElementById('scbttwelveOptionsWrapper');
  if (x.classList.contains('scbt-bl') ) {
    x.classList.remove('scbt-bl');
  } else {
    x.classList.add('scbt-bl');
  }
  var x = null; return false;
}


function scbt_helper_get_social_media_json(app) {
  var url = chrome.runtime.getURL('./socialmedia.json');
  fetch(url)
  .then((response) => response.json())
  .then((json) => scbt_helper_share_build_items(json, app) );
}

function scbt_helper_get_sexual_json() {
  var url = chrome.runtime.getURL('./sexualterms.json');
  fetch(url)
  .then((response) => response.json())
  .then((json) => scbt_helper_save_word_list(json, 'sexualterms') );
}

function scbt_helper_get_profanity_json() {
  var url = chrome.runtime.getURL('./profanity.json');
  fetch(url)
  .then((response) => response.json())
  .then((json) => scbt_helper_save_word_list(json, 'profanity') );
}

function scbt_helper_get_political_json() {
  var url = chrome.runtime.getURL('./political.json');
  fetch(url)
  .then((response) => response.json())
  .then((json) => scbt_helper_save_word_list(json, 'political') );
}

function scbt_helper_get_negative_json() {
  var url = chrome.runtime.getURL('./negative.json');
  fetch(url)
  .then((response) => response.json())
  .then((json) => scbt_helper_save_word_list(json, 'negative') );
}


function scbt_helper_save_word_list(json, listType) {
  if (listType == 'sexualterms') {
    window.scbtOptions.sexualterms = json;
    if (window.scbtOptions.sexualterms && typeof window.scbtOptions.sexualterms == 'object') {
        Object.entries(window.scbtOptions.sexualterms).forEach((entry) => {
        window.scbtBlockedWords.push(entry[1]);
      });
    }
  }
  if (listType == 'profanity') {
    window.scbtOptions.profanity = json;
    if (window.scbtOptions.profanity && typeof window.scbtOptions.profanity == 'object') {
      Object.entries(window.scbtOptions.profanity).forEach((entry) => {
        window.scbtBlockedWords.push(entry[1]);
      });
    }
  }
  if (listType == 'political') {
    window.scbtOptions.political = json;
    if (window.scbtOptions.political && typeof window.scbtOptions.political == 'object') {
      Object.entries(window.scbtOptions.political).forEach((entry) => {
        window.scbtBlockedWords.push(entry[1]);
      });
    }
  }
  if (listType == 'negative') {
    window.scbtOptions.negative = json;
    if (window.scbtOptions.negative && typeof window.scbtOptions.negative == 'object') {
      Object.entries(window.scbtOptions.negative).forEach((entry) => {
        window.scbtBlockedWords.push(entry[1]);
      });
    }
  }
  var json = listType = entry = null; return false;
}


function scbt_helper_go_to_timestamp_in_video(e) {
  if (window.scbtIsVODLoaded === false) {
    if (e) {
      // e.preventDefault();
      if (e.target) {
        if (e.target.dataset) {
          if (e.target.dataset.seconds) {
            var video = document.getElementsByTagName('video')[0];
            video.autoplay = true;
            // video.muted = true;
            // video.click();
            video.currentTime = Number(e.target.dataset.seconds);
            video.play();
            window.scbtIsVODLoaded = true;
            video = null;
          }
        }
      }
    }
  }
  return false;
}


function scbt_helper_insert_name_into_chat_click_handler(e) {
  if (e) {
    e.preventDefault();
    if (e.target) {
      if (e.target.textContent) {
        var el = document.getElementById('scbtChatSearchInputText');
        if (el) {
          el.value = e.target.textContent;
        }
        el = null; e = null;
      }
    }
  }
  return false;
}


function scbt_helper_insert_name_into_chat() {
  var divs = document.body.querySelectorAll('#scbtChatContent .author-name');
  [].forEach.call(divs, function(div) {
      div.addEventListener('click', scbt_helper_insert_name_into_chat_click_handler);
  });
  var divs = div = null; return false;
}


function scbt_helper_is_element_visible(el) {
  var rect     = el.getBoundingClientRect();
  var vWidth   = window.innerWidth || document.documentElement.clientWidth;
  var vHeight  = window.innerHeight || document.documentElement.clientHeight;
  var efp      = function(x, y) { return document.elementFromPoint(x, y) };     
  if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
    return false;
  }
  return (
        el.contains(efp(rect.left,  rect.top))
    ||  el.contains(efp(rect.right, rect.top))
    ||  el.contains(efp(rect.right, rect.bottom))
    ||  el.contains(efp(rect.left,  rect.bottom))
  );
}


function scbt_helper_remove_loading() {
  var h = document.getElementsByTagName('html');
  var ll = document.body.querySelector('.lds-dual-ring');
  h[0].classList.remove('wait');
  if (ll) {
    ll.style.display = 'none';
  }
  var h = ll = null; return false;
}


function scbt_helper_save_batch(dbName, storeName, items) {
  return new Promise((resolve, reject) => {
    var resultsX = [];
    var request = window.indexedDB.open(dbName, 10);

    request.onupgradeneeded = function() {
      if (!request.result) {
        scbt_handle_db_error_blocked(e); 
        return e;
      }
      var store = request.result.createObjectStore('chat', {
        keyPath: 'id',
        autoIncrement: true,
      });

      store.createIndex('itemid', 'itemid', {unique: false});
      store.createIndex('timestamp', 'timestamp', {unique: false});
      store.createIndex('username', 'username', {unique: false});
      store.createIndex('message', 'message', {unique: false});
      store.createIndex('sub', 'sub', {unique: false});
      store.createIndex('moderator', 'moderator', {unique: false});
      store.createIndex('owner', 'owner', {unique: false});
      store.createIndex('donation', 'donation', {unique: false});
      store.createIndex('newSub', 'newSub', {unique: false});
      store.createIndex('verified', 'verified', {unique: false});
      store.createIndex('gifter', 'gifter', {unique: false});
      store.createIndex('founder', 'founder', {unique: false});
      store.createIndex('og', 'og', {unique: false});

      store.transaction.oncomplete = (eee) => {
        resolve('good');
      }

    };
    request.onsuccess = function() {
      db = request.result;
      var transaction = db.transaction('chat', 'readwrite', { durability: 'relaxed' } );
      var objectStore = transaction.objectStore('chat');
      var arrl = items.length;
      for (var i = 0; i < arrl; i++) {
      var item = items[i];
        objectStore.put(item);
      }
      transaction.commit();
    };

  });
}


function scbt_helper_process_chat_line(div, saveThisChat) {
    var obj = {};
    obj.isHighlighted = false;
    obj.isMuted = false;
    obj.isHidden = false;
    obj.timestamp = 123;
    obj.sub = 0;
    obj.moderator = 0;
    obj.owner = 0;
    obj.donation = 0;
    obj.newSub = 0;
    obj.verified = 0;
    obj.mention = 0;
    obj.isBot = 0;
    obj.gifter = 0;
    obj.founder = 0;
    obj.og = 0;

    obj = scbt_helper_chat_clean(obj, div);

    if (window.scbtOptions.scbthidden9) {
      obj = scbt_helper_chat_filter_blocked_links(obj, div);
    }
    if (window.scbtOptions.scbthidden7) {
      obj = scbt_helper_chat_filter_blocked_words(obj, div);
    }
    if (window.scbtOptions.scbthighlighted7) {
      obj = scbt_helper_chat_filter_highlighted_words(obj, div);
    }
    if (window.scbtOptions.scbthighlighted6) {
      obj = scbt_helper_chat_filter_vip_words(obj, div);
    }
    if (window.scbtOptions.scbthidden8) {
      obj = scbt_helper_chat_filter_blocked_users(obj, div);
    }

    obj = scbt_helper_chat_make_decisions(obj, div);

    if (obj.isHighlighted != false) {
      scbt_helper_chat_set_to_highlight(div, obj.isHighlighted);
    }
    if (obj.isMuted === true) {
      scbt_helper_chat_set_to_mute(div);
    }
    if (obj.isHidden === true) {
      scbt_helper_chat_set_to_hide(div);
    }

    if (window.scbtDbName) { } else { scbt_handle_db_error_blocked('scbt_helper_process_chat_line'); var div = saveThisChat = obj = null; return false; }
    if (obj.isBot > 0) {  var div = saveThisChat = obj = null; return false; }
    if ( (obj.itemid) && (obj.username) && (obj.message) ) { } else { var div = saveThisChat = obj = null; return false; }
    
    // save only unique messages
    if (window.scbtArrayOfIds.includes(obj.itemid) === false) {
      window.scbtArrayOfIds.push(obj.itemid);
      
    // click on message to mention in chat (for mobile)
    if (window.scbtOptions.scbtfeature11 === true) {
      var el = div.querySelector('.chat-entry-content');
      if (el) {
        el.addEventListener('click', scbt_helper_mention_menu_click_handler, false);  
        el = null;
      }
    }

    // speak out loud chat with keywords
    if (window.scbtOptions.scbtfeature12 && window.scbtOptions.scbtfeature12 != '' && saveThisChat === true) {
      scbt_helper_chat_speak(obj.message);
    }

    // scbt_helper_chat_auto_show
    if (window.scbtOptions.scbtfeature5 === true) {
      var classString = scbt_get_classString_for_chat(obj);
      var username = obj.username;
      if (window.scbtOptions.scbthidden10 === true) {
        username = '';
      }
      var newElement = "<p class='" + classString + "'><span>" + obj.timestamp + " : <span class='author-name'>" + username + "</span> </span><b>" + obj.message + "</b></p>";
      window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
      classString = null; username = null; newElement = null;
      scbt_user_chat_down_to_bottom();
      scbt_helper_insert_name_into_chat();
    }

    if ( (window.scbtOptions.scbtfeature4 === true) && (saveThisChat === true) && window.scbtDbName && obj ) {
      
      try {
        scbt_set_save_chat_to_db(obj);
      } catch (errorx) {
        console.log('save error ');
        console.log(errorx);
      } finally {
        // console.log('save done');
      }
      

      var div = saveThisChat = obj = null; return false;
    } else {
      var div = saveThisChat = obj = null; return false;
    }
  } // window.scbtArrayOfIds.includes(obj.itemid) === false
}


function scbt_helper_scrolling_handler() {
    if (scbt_helper_is_element_visible(el) ) {
      // back to normal as video is visible
      if (window.scbtOptions.scbtnormal8 === true) {
        if (chatMessageBox) {
          chatMessageBox.style.zIndex = 'initial';
          chatMessageBox.style.position = 'initial';
        }
        if (chatMessageInput) {
          chatMessageInput.style.zIndex = 'initial';
          chatMessageInput.style.position = 'initial';
        }
      }
      if (window.scbtOptions.scbtnormal9 === true) {
        if (window.scbtOptions.scbtnormal5 === true) {
          video.classList.remove('mini-player-left');
        } else {
          video.classList.remove('mini-player');
        }
      }

    } else {
      // Fixed chat as you scroll down
      if (window.scbtOptions.scbtnormal8 === true) {
        if (chatMessageBox) {
          chatMessageBox.style.zIndex = '2';
          chatMessageBox.style.position = 'fixed';
          chatMessageBox.style.height = 'inherit';
        }
        if (chatMessageInput) {
          chatMessageInput.style.zIndex = '2';
          chatMessageInput.style.position = 'fixed';
          chatMessageInput.style.bottom = '0';
        }
      }
      if (window.scbtOptions.scbtnormal9 === true) {
        if (window.scbtOptions.scbtnormal5 === true) {
          video.classList.add('mini-player-left');
        } else {
          video.classList.add('mini-player');
        }
      }
    }
  return false;
}


function scbt_helper_scrolling_setter() {
  el = document.body.querySelector('h5.mb-0');
  chatMessageBox = document.getElementById('chat-messages');
  chatMessageInput = document.getElementById('chat-form');
  video = document.body.querySelector('#video-column .card-body');
  window.addEventListener('scroll', scbt_helper_scrolling_handler);
  return false;
}


function scbt_helper_share_build_items(jsonSocialMedias, app) {
  window.jsonSocialMedias = jsonSocialMedias;
    
  // build initial checkboxes and custom link inputs on page in options menu
  var checkboxHTML = '';
  var customLinkHTML = '';
  var hasCustomMenu = false;
  for (var key of Object.keys(jsonSocialMedias)) {
    checkboxHTML = checkboxHTML + '<input type="checkbox" name="scbtShareTo' + key + '" id="scbtShareTo' + key + '" style="margin-top: 5px">' + key + '<br>';
    customLinkHTML = customLinkHTML + '<label for="scbtCustomLink' + key + '">If using ' + key + ' in share menu and you want easy access for yourself, the link to your ' + key + ':</label><br>';
    customLinkHTML = customLinkHTML + 'https://www.' + key + '.com/ <input type="text" name="scbtCustomLink' + key + '" id="scbtCustomLink' + key + '" style="margin-top: 5px"><hr><br>&nbsp;<br>';
    if (window.localStorage['scbtShareTo' + key] == '1') {
      hasCustomMenu = key;
    }
  }
  window.scbtSocialMediaShareOptionsRef.insertAdjacentHTML('afterbegin', checkboxHTML ); // social checkboxes  
  window.scbtSocialMediaShareCustomOptionsRef.insertAdjacentHTML('afterbegin', customLinkHTML ); // social custom write-ins
  checkboxHTML = null; customLinkHTML = null;
  // end build social media options for options menu

  // native share button for windows users
  var shareEls = document.getElementsByClassName('share-native-button');
  var arrl = shareEls.length;
  for (var i=0; i < arrl; i++) {
    scbt_helper_share_native_disabled(shareEls[i]);
    shareEls[i].addEventListener('click', scbt_user_share_native);
  }
  // end build native share button for windows users


  // build type ahead share element
  window.scbtSocialSubmitButtonRef.addEventListener('click', scbt_user_save_social_options);
  var shareEls = document.getElementsByClassName('search-share');
  var arrl = shareEls.length;
  for (var i = 0; i < arrl; i++) {
    shareEls[i].addEventListener('change', scbt_user_share_this);
  }
  scbt_helper_share_build_menu(app, true);


  // window.scbtSubmitButtonRef.addEventListener('click', scbt_user_save_options);
  // window.scbtCancelOptionsMenuRef.addEventListener('click', scbt_user_toggle_options_menu);
/*
  var x = document.getElementsByClassName('search-share');
  for (var i = 0; i < x.length; i++) {
    x[i].addEventListener('change', scbt_user_share_this);
  }
  var x = document.getElementsByClassName('share-copy-button');
  for (var i = 0; i < x.length; i++) {
    x[i].addEventListener('click', scbt_helper_copy_text_to_clipboard);
  }
  window.scbtSubmitButtonRef.addEventListener('click', scbt_user_save_options);
  window.scbtCancelOptionsMenuRef.addEventListener('click', scbt_user_toggle_options_menu);
  window.scbtSocialSubmitButtonRef.addEventListener('click', scbt_user_save_social_options);
  scbt_helper_share_build_menu(app, hasCustomMenu);
  x = null;

  scbt_helper_copy_text_to_clipboard(this.src);
  setTimeout(function(){ scbt_helper_toast('copied to clipboard'); }, 1000);
  scbt_helper_share_populate(this.src);
*/
  i = null; x = null; shareEls = null; arrl = null; x = null; jsonSocialMedias = null; app = null; return false;
}


function scbt_helper_share_build_menu(app, hasCustomMenu) {
  var theHTMLforDatalist = "<datalist id='scbtSocialMedias'><option value='Select social media...'>";

  var x = window.localStorage['scbtCustomLinkCustom'];
  if (window.localStorage['scbtShareToCustom'] == '1') {
    document.getElementById('scbtvideo6').value = x;
    theHTMLforDatalist = theHTMLforDatalist + "<option value='Custom' data-link='" + x + "' >";
  }
  var x = window.localStorage['scbtCustomLinkEmail'];
  if (window.localStorage['scbtShareToEmail'] == '1') {
    document.getElementById('scbtvideo7').value = x;
    theHTMLforDatalist = theHTMLforDatalist + "<option value='Email' data-link='" + x + "' >";
  }

  // check the social boxes and populate the custom social inputs
  for (var key of Object.keys(window.jsonSocialMedias)) {
     if (!hasCustomMenu) {
      theHTMLforDatalist = theHTMLforDatalist + "<option value='" + key + "' data-link='" + jsonSocialMedias[key] + "' >";
     }

     if (window.localStorage['scbtShareTo' + key] == '1') {
        if (hasCustomMenu) {
          theHTMLforDatalist = theHTMLforDatalist + "<option value='" + key + "' data-link='" + jsonSocialMedias[key] + "' >";
        }
        document.getElementById('scbtShareTo' + key).checked = true;
     }
     if (window.localStorage['scbtCustomLink' + key]) {
        document.getElementById('scbtCustomLink' + key).value = window.localStorage['scbtCustomLink' + key];
     }
  }

  theHTMLforDatalist = theHTMLforDatalist + '</datalist>';
  app.insertAdjacentHTML('afterbegin', theHTMLforDatalist );
  x = null; theHTMLforDatalist = null; return false;
} // end scbt_helper_share_build_menu


function scbt_helper_share_native_disabled(e) { 
  if (e) {
    if (navigator.share) { } else {
      e.classList.add('disabled');
    }
  }
  e = null; return false;
}


function scbt_helper_share_populate(toShare) {
  var shareEls = document.getElementsByClassName('share-native-button');
  var arrl = shareEls.length;
  for (var i=0; i < arrl; i++) {    
    shareEls[i].setAttribute('data-streamer', window.scbtChannelName);
    shareEls[i].setAttribute('data-share', toShare);
  }

  var shareEls = document.getElementsByClassName('search-share');
  var arrl = shareEls.length;
  for (var i=0; i < arrl; i++) {    
    shareEls[i].setAttribute('data-streamer', window.scbtChannelName);
    shareEls[i].setAttribute('data-share', toShare);
  }
  i = null; shareEls = null; arrl = null; toShare = null; return false;
}


function scbt_helper_keybind_close() {
  var x = document.getElementsByClassName('scbt-options-wrapper');
  var arrl = x.length;
  for (var i = 0; i < arrl; i++) {
    x[i].classList.remove('scbt-bl');
  }
  window.scbtOptionsMenuRef.classList.remove('scbt-bl');
  document.querySelectorAll('#message-input')[0].focus();
  x = null; arrl = null; return false;
}


function scbt_helper_options_turn_on_keybinds() {
  window.addEventListener('keydown', function(e) {

    if ( (e.keyCode == '16') && (e.altKey === true) )  {
      console.log('you pressed shift + Alt to toggle the main menu');
      e.preventDefault();
      if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
        window.scbtSideMenuRef.classList.remove('scbt-bl');
        document.querySelectorAll('#message-input')[0].focus();
        return false;
      } else {
        window.scbtSideMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbt2')[0].focus();
        return false;
      }
    }

    if ( (e.keyCode == '90') && (e.altKey === true) )  {
      console.log('you pressed Z + Alt to toggle the options menu');
      e.preventDefault();
      if (window.scbtOptionsMenuRef.classList.contains('scbt-bl') ) {
        scbt_helper_keybind_close();
        return false;
      } else {
        window.scbtOptionsMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbt2')[0].focus();
        return false;
      }
    }

    if ( (e.keyCode == '88') && (e.altKey === true) )  {
      console.log('you pressed X + Alt to toggle the options menu bring up hide menu');
      e.preventDefault();
      if (window.scbtOptionsMenuRef.classList.contains('scbt-bl') ) {
        scbt_helper_keybind_close();
        return false;
      } else {
        window.scbtOptionsMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbtOptionsHideTitle')[0].click();
        setTimeout(function() {
          document.querySelectorAll('#scbtOptionsHideWrapper')[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          document.querySelectorAll('#scbthidden1')[0].focus();
          return false;
        }, 1500);
      }
    }

    if ( (e.keyCode == '67') && (e.altKey === true) )  {
      console.log('you pressed C + Alt to toggle the options menu bring up feature menu');
      e.preventDefault();
      if (window.scbtOptionsMenuRef.classList.contains('scbt-bl') ) {
        scbt_helper_keybind_close();
        return false;
      } else {
        window.scbtOptionsMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbtOptionsFeaturesTitle')[0].click();
        setTimeout(function() {
          document.querySelectorAll('#scbtOptionsFeaturesWrapper')[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          document.querySelectorAll('#scbtfeature1')[0].focus();
          return false;
        }, 1500);
      }
    }

    if ( (e.keyCode == '86') && (e.altKey === true) )  {
      console.log('you pressed V + Alt to toggle the options menu bring up save menu');
      e.preventDefault();
      if (window.scbtOptionsMenuRef.classList.contains('scbt-bl') ) {
        scbt_helper_keybind_close();
        return false;
      } else {
        window.scbtOptionsMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbtOptionsSavedTitle')[0].click();
        setTimeout(function() {
          document.querySelectorAll('#scbtOptionsSavedWrapper')[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          return false;
        }, 1500);
      }
    }

    if ( (e.keyCode == '66') && (e.altKey === true) )  {
      console.log('you pressed B + Alt to toggle the options menu bring up share menu');
      e.preventDefault();
      if (window.scbtOptionsMenuRef.classList.contains('scbt-bl') ) {
        scbt_helper_keybind_close();
        return false;
      } else {
        window.scbtOptionsMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbtOptionsShareTitle')[0].click();
        setTimeout(function() {
          document.querySelectorAll('#scbtOptionsShareWrapper')[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          document.querySelectorAll('#scbtSocialMediasList')[0].focus();
          return false;
        }, 1500);
      }
    }



    if ( (e.keyCode == '16') && (e.altKey === true) )  {
      console.log('you pressed shift + Alt to toggle the main menu');
      e.preventDefault();
      if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
        window.scbtSideMenuRef.classList.remove('scbt-bl');
        document.querySelectorAll('#message-input')[0].focus();
        return false;
      } else {
        window.scbtSideMenuRef.classList.add('scbt-bl');
        document.querySelectorAll('#scbt2')[0].focus();
        return false;
      }
    }

    if ( (e.keyCode == '81') && (e.altKey === true) )  {
      console.log('you pressed Q + Alt to toggle Broadcaster Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('owner');
      return false;
    }
    if ( (e.keyCode == '87') && (e.altKey === true) )  {
      console.log('you pressed W + Alt to toggle Moderator Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('moderator');
      return false;
    }
    if ( (e.keyCode == '69') && (e.altKey === true) )  {
      console.log('you pressed E + Alt to toggle Sub Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('sub');
      return false;
    }
    if ( (e.keyCode == '82') && (e.altKey === true) )  {
      console.log('you pressed R + Alt to toggle Sub + Moderator Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('mod_sub');
      return false;
    }
    if ( (e.keyCode == '84') && (e.altKey === true) )  {
      console.log('you pressed T + Alt to toggle VIP Only');
      e.preventDefault();
      scbt_user_toggle_chats('vip');
      return false;
    }
    if ( (e.keyCode == '89') && (e.altKey === true) )  {
      console.log('you pressed Y + Alt to toggle Donation Chats Only');
      e.preventDefault();
      scbt_user_toggle_chats('donation');
      return false;
    }
    if ( (e.keyCode == '85') && (e.altKey === true) )  {
      console.log('you pressed U + Alt to toggle Mention Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('mention');
      return false;
    }
    if ( (e.keyCode == '73') && (e.altKey === true) )  {
      console.log('you pressed I + Alt to toggle Hashtag Messages Only');
      e.preventDefault();
      scbt_user_toggle_chats('hashtag');
      return false;
    }
    if ( (e.keyCode == '79') && (e.altKey === true) )  {
      console.log('you pressed O + Alt to toggle OG Messages Only'); 
      e.preventDefault();
      scbt_user_toggle_chats('og');
      return false;
    }
    if ( (e.keyCode == '80') && (e.altKey === true) )  {
      console.log('you pressed P + Alt to toggle text only chat');  // scbt13
      e.preventDefault();
      scbt_user_chat_text_only();
      return false;
    }
    if ( (e.keyCode == '219') && (e.altKey === true) )  {
      console.log('you pressed [ + Alt to  View Top of Chat'); // scbt14
      e.preventDefault();
      scbt_user_chat_up_to_top();
      return false;
    }
    if ( (e.keyCode == '221') && (e.altKey === true) )  {
      console.log('you pressed ] + Alt to  View Bottom of Chat'); // scbt15
      e.preventDefault();
      scbt_user_chat_down_to_bottom();
      return false;
    }
    if ( (e.keyCode == '220') && (e.altKey === true) )  {
      console.log('you pressed  + Alt to  Change Chat Font Size'); // scbt20
      e.preventDefault();
      scbt_user_chat_font_size();
      return false;
    }
    e = null; return false;
  });
} // end helper_turn_on_keybinds_from_options


function scbt_helper_toast(theText) {
  window.scbtSnackbarRef.innerText = theText;
  window.scbtSnackbarRef.className = 'show';
  setTimeout(function(){ window.scbtSnackbarRef.className = window.scbtSnackbarRef.className.replace('show', ''); }, 2500);
  return false;
}


function scbt_make_toast() {
  var x = document.getElementById('scbtSnackbar');
  if (x) { } else {
    var newElement = "<div id='scbtSnackbar'></div><div id='scbtLoading'></div>";
    document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', newElement);
    window.scbtSnackbarRef = document.getElementById('scbtSnackbar');
    setTimeout(function(){ scbt_helper_toast('Status: building menus'); }, 500);
  }
  x = null; newElement = null; return false;
}


function scbt_set_chat_parameter(parameter, visibility) {
  var displayText = '';
  
  if (parameter == 'owner') {
    if (visibility == 0) {
      displayText = ' - broadcaster chats -';
    }
    if (visibility == 1) {
      displayText = ' - non broadcaster chats -';
    }
  }

  if (parameter == 'moderator') {
    if (visibility == 0) {
      displayText = ' - mod chats -';
    }
    if (visibility == 1) {
      displayText = ' - non mod chats -';
    }
  }

  if (parameter == 'sub') {
    if (visibility == 0) {
      displayText = ' - member chats -';
    }
    if (visibility == 1) {
      displayText = ' - non member chats -';
    }
  }

  if (parameter == 'newSub') {
    if (visibility == 0) {
      displayText = ' - new member chats -';
    }
    if (visibility == 1) {
      displayText = ' - non new member events -';
    }
  }

  if (parameter == 'mod_sub') {
    if (visibility == 0) {
      displayText = ' - member+mod chats -';
    }
    if (visibility == 1) {
      displayText = ' - non member+mod chats -';
    }
  }

  if ( (parameter == 'vip') || (parameter == 'verified') ) {
    if (visibility == 0) {
      displayText = ' - vip/verified chats -';
    }
    if (visibility == 1) {
      displayText = ' - non vip/verified chats -';
    }
  }

  if (parameter == 'donation') {
    if (visibility == 0) {
      displayText = ' - donation chats -';
    }
    if (visibility == 1) {
      displayText = ' - non donation chats -';
    }
  }
  
  if (parameter == 'mention') {
    if (visibility == 0) {
      displayText = ' - mention chats -';
    }
    if (visibility == 1) {
      displayText = ' - non mention chats -';
    }
  }

  if (parameter == 'hashtag') {
    if (visibility == 0) {
      displayText = ' - hashtag chats -';
    }
    if (visibility == 1) {
      displayText = ' - non hashtag chats -';
    }
  }

  parameter = null; visibility = null; return displayText;
}





function scbt_user_chat_delete_by_video_id(e) {
  e.preventDefault();
  window.scbtStreamList = [];
  var dbName = 'savedchat' + '&' + e.srcElement.dataset.service + '&' + e.srcElement.dataset.channelid + '&' + e.srcElement.dataset.videoid;
  var request = window.indexedDB.deleteDatabase(dbName);
  request.onsuccess = function(e) {
    console.log('Database deleted successfully');
    setTimeout(function(){ scbt_helper_toast('Status: Chat messages from this stream successfully deleted'); scbt_user_toggle_options_menu(); }, 1000);
    e = dbName = request = error = null; return false;
  }
  request.onerror = function(error) {
    scbt_handle_db_error_blocked(error);
    e = dbName = request = error = null; return false;
  };
  request.onblocked = function(error) {
    scbt_handle_db_error_blocked(error);
    e = dbName = request = error = null; return false;
  };
}


function scbt_user_chat_down_to_bottom() {
  if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
    window.scbtChatContentRef.scrollTop = window.scbtChatContentRef.scrollHeight - window.scbtChatContentRef.clientHeight;
  } else {
      var y = window.scbtZ.document.getElementById('item-scroller');
      if (y) {
        y.scrollTop = y.scrollHeight - y.clientHeight;
      }
    }
  x = null; y = null; return false;
}


function scbt_user_chat_export_by_video_id(event) {
  event.preventDefault();
  var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null;
  window.scbtUniqueMessageIds = [];
  var dbName = 'savedchat' + '&' + event.srcElement.dataset.service + '&' + event.srcElement.dataset.channelid + '&' + event.srcElement.dataset.videoid;
  var request = window.indexedDB.open(dbName, 10);

  request.onsuccess = function(e) {
    console.log(e);
    console.log(request.result);
    if (!request.result) { setTimeout(function(){ scbt_helper_toast('Error: get database result for chat export result failed.'); }, 2700); var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false; }
    var db = request.result;
    var transaction = db.transaction('chat', 'readonly');
    transaction.oncomplete = function() {
    };
    transaction.onabort = function() {
      scbt_handle_db_error_blocked(transaction.error);
    };
    var store = transaction.objectStore('chat'); 
    
    store.getAll().onsuccess = function(e2) {
      var chats = e2.target.result;
      if (chats.length < 1) { setTimeout(function(){ scbt_helper_toast('Error: this stream chat not found for display'); }, 2700); var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false; }
      chats = scbt_get_sort_times(chats);
      var output = [];
      var titles = 'initial, message, itemid, timestamp, username, sub, moderator, owner, donation, newSub, VIP, gifter, founder, og, id';
      output.push(titles);
      output.push('\n');
      
      [].forEach.call(chats, function(item) {
        if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
          window.scbtUniqueMessageIds.push(item.itemid);
          var row = '';
          var username = item.username;
          username = username.replace(/[^a-zA-Z0-9!._\-@\s]/g, ' ');
          username = username.replace(/(\r\n|\n|\r)/gm, "");
          username = username.replaceAll(',', ' ');
          username = username.trim();
          var message = item.message;
          // message = message.replace(/[^a-zA-Z0-9!._\-@\s]/g, ' ');
          message = message.replace(/\/‘’,‚“”„"`~«´<>/g, ' ');
          message = message.replace(/(\r\n|\n|\r)/gm, "");
          message = message.replaceAll(',', ' ');
          message = message.trim();

          row = row + message + ',';
          row = row + item.itemid + ',';
          row = row + item.timestamp + ',';
          row = row + username + ',';
          row = row + item.sub + ',';
          row = row + item.moderator + ',';
          row = row + item.owner + ',';
          row = row + item.donation + ',';
          row = row + item.newSub + ',';
          row = row + item.verified + ',';
          row = row + item.gifter + ',';
          row = row + item.founder + ',';
          row = row + item.og + ',';
          row = row + item.id;

          output.push(row);
          output.push('\n');
        }
      });
    
      var csvString = output.join();
      var output = null;
      csvString = csvString.replace(/\/'"`/g, '');
      csvString = csvString.replace(/%3D/g, '');
      var blob = scbt_get_csv_file_from_string(csvString);
      var csvName = 'savedchat' + '&' + event.srcElement.dataset.service + '&' + event.srcElement.dataset.channelid + '&' + event.srcElement.dataset.videoid + '&' + new Date().toISOString().slice(0, 10) + '-chatlog.csv';
      scbt_helper_csv_download(blob, csvName);
      return false;
    };
    store.getAll().onerror = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false;
    };
    store.getAll().onblocked = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false;
    };
  };

  request.onerror = function(error) {
    scbt_handle_db_error_blocked(error);
    var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false;
  };
  request.onblocked = function(error) {
    scbt_handle_db_error_blocked(error);
    var el = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = dbName = chats = output = titles = row = username = message = csvString = csvName = blob = null; return false;
  };

}


// put cursor into chat box to type via keybind
function scbt_user_chat_focus(e) {
  window.scbtChatInputRef.focus();
  e = null; x = null; return false;
}


function scbt_user_chat_font_size() {
  if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
    var divs = window.scbtChatWrapperRef.querySelectorAll('p b');
  } else {
    var divs = window.scbtZ.document.body.querySelectorAll('#items .yt-live-chat-item-list-renderer .yt-live-chat-text-message-renderer span');
  }

  if (window.scbtFontUp < 6) {
    if (window.scbtFontSize == 'initial') {
      window.scbtFontSize = 1;
    }
    if (window.scbtHeightSize == 'initial') {
      window.scbtHeightSize = 'auto'; 
    }
    window.scbtFontSize = window.scbtFontSize - -.25;
    var p = window.scbtFontSize + 'em';
    window.scbtFontUp = window.scbtFontUp - -1;
  } else {
    window.scbtFontSize = 'initial';
    var p = 'initial';
    window.scbtHeightSize = 'initial';
    var h = 'initial';
    window.scbtFontUp = 1;
  }

  [].forEach.call(divs, function(div) {
      div.style.setProperty('font-size', p, 'important');
      div.style.height = h;
  });
  p = h = x = div = divs = null; return false;
}


window.isdoFullScreenWidth = 0;
function scbt_user_chat_full_screen_width() {
    if (window.isdoFullScreenWidth === 0) {
      var x = document.getElementById('chat');
      x.style.width = '34vw';
      var x = document.getElementById('primary');
      x.style.paddingRight = '0px';
      window.isdoFullScreenWidth = 1;
      x = null; return false;
    }

    if (window.isdoFullScreenWidth === 1) {
      var x = document.getElementById('chat');
      x.style.width = 'initial';
      var x = document.getElementById('primary');
      x.style.paddingRight = 'initial';
      window.isdoFullScreenWidth = 0;
      x = null; return false;
    }
}


function scbt_user_chat_load_by_video_id(e) {
  window.scbtDbNameToSearch = 'savedchat' + '&' + e.srcElement.dataset.service + '&' + e.srcElement.dataset.channelid + '&' + e.srcElement.dataset.videoid, e.srcElement.dataset.service, e.srcElement.dataset.channelid, e.srcElement.dataset.videoid;
  scbt_helper_build_chat_by_id('savedchat' + '&' + e.srcElement.dataset.service + '&' + e.srcElement.dataset.channelid + '&' + e.srcElement.dataset.videoid, e.srcElement.dataset.service, e.srcElement.dataset.channelid, e.srcElement.dataset.videoid);

  if (window.scbtIsMobile === true) {
    window.scbtSideMenuRef.classList.add('scbt-fl');
  } else {
    window.scbtSideMenuRef.classList.add('scbt-bl');
  }

  window.scbtOptionsMenuRef.classList.remove('scbt-bl');
  window.scbtChatWrapperRef.classList.add('scbt-bl');
  // window.scbtChatContentRef.classList.add('scbt-bl');
  
  window.scbtChatMenuRef.classList.add('scbt-fl');  
  window.isdoSearch = 1;
  return false;
}


function scbt_user_chat_close_mention_menu(username) {
  if (!username.target) {
      if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
          var orig = window.scbtChatSearchInputTextRef.value;
          if (orig.indexOf(username) == -1) {
            window.scbtChatSearchInputTextRef.value = '@' + username + ' ';
          }
          window.scbtChatSearchInputTextRef.focus();
      } else {
          var orig = window.scbtChatInputRef.value;
          if (orig.indexOf(username) == -1) {
            window.scbtChatInputRef.value = orig + username + ' ';
          }
          window.scbtChatInputRef.focus();
      }
  }
  window.scbtMentionMenuRef.classList.remove('scbt-bl');
  username == null; orig = null; return false;
}


function scbt_user_do_search_chat_mention_users(e) {
  var chats = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null;
  window.scbtUniqueMessageIds = [];
  var request = window.indexedDB.open(window.scbtDbName, 10);
  request.onsuccess = function(e) {
    if (!request.result) { setTimeout(function(){ scbt_helper_toast('Error: get database result for mention chat failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; return false; }
    var db = request.result;
    var transaction = db.transaction('chat', 'readonly');
    transaction.oncomplete = function() {
    };
    transaction.onabort = function() {
      scbt_handle_db_error_blocked(transaction.error);
    };
    var store = transaction.objectStore('chat'); 
    store.getAll().onsuccess = function(e2) {
      if (!e2) { setTimeout(function(){ scbt_helper_toast('Error: get database result e2 for mention chat failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false; }
      if (!e2.target) { setTimeout(function(){ scbt_helper_toast('Error: get database result e2 target for mention chat failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false; }
      if (!e2.target.result) { setTimeout(function(){ scbt_helper_toast('Error: get database result e2 targe result for mention chat failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false; }

      var chats = e2.target.result;
      if (chats.length < 1) { setTimeout(function(){ scbt_helper_toast('Error: this stream chat not found for display'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false; }
      sortedchats = [];
      var sortedchats = chats.sort(function(a, b) {
        var nameA = a.username.toUpperCase(); 
        var nameB = b.username.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      var i = 0;
      [].forEach.call(sortedchats, function(item) {
        if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
          window.scbtUniqueMessageIds.push(item.itemid);
          var theHTML = '';
          if ( window.usernamesArr.indexOf(item.username) < 0) {
            theHTML = theHTML + "<li><button id='scbtusername" + i + "' tabindex='0'>" + item.username + "</button></li>";
            i = i + 1;
            window.usernamesArr.push(item.username);
            var x = window.scbtMentionMenuRef.querySelector('ul');
            x.insertAdjacentHTML('afterbegin', theHTML );
          }
        }
      });
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false;      
    };
    store.getAll().onerror = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false;
    };
    store.getAll().onblocked = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false;
    };
  }
  request.onerror = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false;
    return false;
  };
  request.onblocked = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = sortedchats = nameA = nameB =  null; window.usernamesArr = []; return false;
  };
  
}


function scbt_user_chat_mention_menu(e1) {
  if (e1.data == '@') {
      scbt_user_do_search_chat_mention_users();
      window.scbtMentionMenuRef.classList.add('scbt-bl');

      handlerAt = function(e3) {
        if (e3.key == 'ArrowUp')  {
          e3.preventDefault();
          var selectedElem = document.activeElement;
          if (selectedElem) {
            var parentElm = selectedElem.parentElement;
            if (parentElm) {
              var previousElm = parentElm.previousSibling;
              if (previousElm) {
                var previousElm1 = previousElm.querySelectorAll('button');
                if (previousElm1[0]) {
                  previousElm1[0].focus();
                }
              }
            }
          }
          return false;
        }

        if (e3.key == 'ArrowDown')  {
          e3.preventDefault();
          var selectedElem = document.activeElement;
          if (selectedElem) {
            var parentElm = selectedElem.parentElement;
            if (parentElm) {
              var nextElm = parentElm.nextSibling;
              if (nextElm) {
                var nextElm1 = nextElm.querySelectorAll('button');
                if (nextElm1[0]) {
                  nextElm1[0].focus();
                }
              }
            }
          }
          return false;
        }

        if (e3.key == 'Escape')  {
          e3.preventDefault();
          window.document.removeEventListener('keydown', handlerAt);  
          scbt_user_chat_close_mention_menu('');
          return false;
        }

        if (e3.key == 'Enter')  {
          e3.preventDefault();
          window.document.removeEventListener('keydown', handlerAt);
          var selectedElem = document.activeElement;
          var theText = '';
          if (selectedElem) {
            theText = selectedElem.innerText;
          }
          scbt_user_chat_close_mention_menu(theText);
          return false;
        }

      };
      window.document.addEventListener('keydown', handlerAt);


      var x = document.getElementById('scbtusername1');
      if (x) {
        x.focus();
      }
      x = null;

      mentionMenuClickHandler = function(e4) {
        e4.preventDefault();
        window.document.removeEventListener('keydown', handlerAt);
        window.scbtmentionMenuClickHandler = 1;
        scbt_user_chat_close_mention_menu(e4.target.innerText);
        return false;
      };      

      var divs = document.body.querySelectorAll('#scbtMentionMenu button');
      [].forEach.call(divs, function(div) {
        div.addEventListener('click', mentionMenuClickHandler);
      });
    }

  return false;
}


window.isdoNonBots = 0;
function scbt_user_chat_non_bot() {
  if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
  } else {
      
      var divs = scbt_get_chat_messages();
      var toSearchFor = '';
      var toSearchFor2 = '';

      if (window.isdoNonBots === 0) {
          window.scbtChatBRef.innerText = ' - non bot chats -';
          [].forEach.call(divs, function(div) {
            var msg = div.querySelector('#message');
            if (msg) {
              var t = msg.innerText;
              if (t.charAt(0) == '!') {
                div.style.opacity = '.2';
              }
            }
            
            var arr = div.querySelectorAll('#author-name');
            if (arr.length > 0) {
              [].forEach.call(arr, function(message) {
                var name = message.innerText;
                name = name.toLowerCase();
                if ( ( name.indexOf('bot') > -1 ) || ( name == 'streamelements') || ( name == 'streamlabs') || ( name == 'tifa lockhart') || ( name == 'oaty') || ( name == 'glimboi') || ( name == 'loeyalist') || (name.indexOf('!') == '0') ) {
                  div.style.opacity = '.2';
                }
              });
            }
          });

        window.isdoNonBots = 1;
        m = null; um = null; username = null; u = null; divs = null; div = null; return false;
      }

      if (window.isdoNonBots === 1) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.opacity = 1;
          div.parentElement.style.opacity = 1;
        });
        window.isdoNonBots = 0;
        divs = null; div = null; return false;
      }

    }
  return false;
}


window.isdoTextOnlys = 0;
function scbt_user_chat_text_only() {
  if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
      var divs = window.scbtChatWrapperRef.querySelectorAll('span');

      if (window.isdoTextOnlys === 0) {
        window.scbtChatBRef.innerText = ' - text only chats -';
        [].forEach.call(divs, function(div) {
          div.style.display = 'none';
        });
        window.isdoTextOnlys = 1;
        return false;
      }

      if (window.isdoTextOnlys === 1) {            
        window.scbtChatBRef.innerText = ' - non text only chats -';
        [].forEach.call(divs, function(div) {
            div.style.display = 'inline-block';
            scbt_helper_chat_blur(div);
        });
        window.isdoTextOnlys = 2;
        x = null; divs = null; div = null; return false;
      }


      if (window.isdoTextOnlys === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.display = 'inline-block';
          scbt_helper_chat_off(div);
        });
        window.isdoTextOnlys = 0;
        x = null; divs = null; div = null; return false;
      }

    } else {
      
      var divs = window.scbtZ.document.body.querySelectorAll('.yt-live-chat-text-message-renderer .yt-live-chat-text-message-renderer');
      var toSearchFor = '.chat-history--username';

      if (window.isdoTextOnlys === 0) {
        window.scbtChatBRef.innerText = ' - text only chats -';

        [].forEach.call(divs, function(div) {
            scbt_helper_chat_on(div);
            if (div.id != 'message') {
              // div.style.opacity = 0;
              div.style.display = 'none';
            }
        });

        window.isdoTextOnlys = 1;
        is = null; i = null; x = null; divs = null; div = null; return false;
      }


      if (window.isdoTextOnlys === 1) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
            scbt_helper_chat_off(div);
            div.style.display = 'inline';
            var x = div.querySelectorAll(toSearchFor);
            if (x[0]) {
              // x[0].style.opacity = 1;
              x[0].style.display = 'inline';
            }
          var imgs = div.querySelectorAll('img');
          [].forEach.call(imgs, function(img) {
            // img.style.opacity = 1;
            img.style.display = 'inline';
          });
        });
        window.isdoTextOnlys = 0;
        is = null; i = null; x = null; divs = null; div = null; return false;
      }
      
    }
}


function scbt_user_chat_up_to_top() {
  if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
    window.scbtChatContentRef.scrollTop = 0;
  } else {
    var y = window.scbtZ.document.getElementById('item-scroller');
    if (y) {
      y.scrollTop = 0;  
    }
  }
  x = null; y = null; return false;
}


function scbt_user_command1() {
  scbt_user_theatre_mode();
  return false; 
}

function scbt_user_command2() {
  if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
    window.scbtSideMenuRef.classList.remove('scbt-bl');
  } else {
    window.scbtSideMenuRef.classList.add('scbt-bl');
  }
  var e = {};
  e.target = {};
  e.target.id = 'scbt22';
  scbt_user_search_chat_toggle(e);
  setTimeout(function() {
    if (window.isdoSearch === 1) {
      var e = {};
      e.target = {};
      e.target.id = 'scbtChatSearchFullButton';
      e.delay = 1;
      scbt_user_search_saved_chat(e);
    }
    e = null; return false;
  }, 2000);
}

function scbt_user_command3() {
  if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
    window.scbtSideMenuRef.classList.remove('scbt-bl');
  } else {
    window.scbtSideMenuRef.classList.add('scbt-bl');
  }
  var e = {};
  e.target = {};
  e.target.id = 'scbt22';
  scbt_user_search_chat_toggle(e);
  e = null; return false;
}

function scbt_user_command4() {
  if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
    window.scbtSideMenuRef.classList.remove('scbt-bl');
  } else {
    window.scbtSideMenuRef.classList.add('scbt-bl');
  }
  var e = {};
  e.target = {};
  e.target.id = 'scbt23';
  scbt_user_search_chat_toggle(e);
  e = null; return false;
}


function scbt_user_csv_upload_chat_log(e) {
  window.scbtChatLogRef.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      var myFile = this.files[0];
      if (myFile.name.substring(myFile.name.length - 11) != 'chatlog.csv') {
        return false;
      }
      if ( (myFile.size < 8) || (myFile.size > 100000000) ) {
        return false;
      }
      if ( myFile.type != 'text/csv' ) {
        return false; 
      }
      window.scbtFileName = myFile.name;
      var reader = new FileReader();
      reader.addEventListener('load', function(e) {
        var csvdata = e.target.result;
        scbt_helper_csv_parse_chat_log(csvdata);
      });
      reader.readAsBinaryString(myFile);
    }
  });
}


// view stream in full screen mode
function scbt_user_full_screen() {
  var x = document.getElementById('video-player');
  if (x) {
    if (x.requestFullscreen) {
      x.requestFullscreen();
    } else if (x.mozRequestFullScreen) {
      x.mozRequestFullScreen();
    } else if (x.webkitRequestFullscreen) {
      x.webkitRequestFullscreen();
    } else if (x.msRequestFullscreen) { 
      x.msRequestFullscreen();
    }
  }
  x = null; return false;
}


window.isdoFullScreenHeight = 0;
function scbt_user_full_screen_height_chat() {
  if (window.isdoFullScreenHeight === 0) {
   var x = document.getElementById('chat');
   x.style.height = '96vh';
   var x = document.getElementById('secondary');
   x.style.paddingTop = '0px';
   window.isdoFullScreenHeight = 1;
   scbt_user_chat_down_to_bottom();
   x = null; return false;
  }

  if (window.isdoFullScreenHeight === 1) {
    var x = document.getElementById('chat');
    x.style.height = 'initial';
    var x = document.getElementById('secondary');
    x.style.paddingTop = 'initial';
    window.isdoFullScreenHeight = 0;
    scbt_user_chat_down_to_bottom();
    x = null; return false;
  }

}


function scbt_user_go_to_stream(e) {
  if (e) {
    if (e.target) {
      if (e.target.dataset) {
        if (e.target.dataset.channelid) {
          var name = e.target.dataset.channelid;
          if (e.target.dataset.service == 'youtube') {
            name = name.replace(/ /g, '+');
            window.open('https://www.youtube.com/results?search_query='+name,'_blank');
          }
        }
      }
    }
 }
  e = null; name = null; return false;
}


function scbt_user_search_chat(e) {
  scbt_user_search_chat_toggle(e);
}


window.isdoSearch = 0;
function scbt_user_search_chat_toggle(e) {
  
  if (window.scbtvideoID && window.scbtDbName) { } else { scbt_helper_toast('You can only search a stream chat on a livestream. Please find an active livestream.'); return false; }
  if (e) {
    if (e.target) {
      if (e.target.id == 'scbt22') {
        window.scbtSearchChat = 'current';
        window.scbtChatSearchStartsWithButtonRef.classList.remove('scbt-multiple');
        window.scbtChatSearchUserButtonRef.classList.remove('scbt-multiple');
        window.scbtChatSearchKeywordButtonRef.classList.remove('scbt-multiple');
      }
      if (e.target.id == 'scbt23') {
        window.scbtSearchChat = 'previous';
        window.scbtChatSearchStartsWithButtonRef.classList.add('scbt-multiple');
        window.scbtChatSearchUserButtonRef.classList.add('scbt-multiple');
        window.scbtChatSearchKeywordButtonRef.classList.add('scbt-multiple');
      }
    }
  }

  // opening
  if (window.isdoSearch === 0) {
    window.scbtChatContentRef.innerHTML = '';
    if (window.scbtSearchChat == 'current') {
      window.scbtChatARef.innerText = 'Search this stream chat';
    } else {
      window.scbtChatARef.innerText = 'Search previous stream chat';
    }
    if (window.scbtIsMobile === true) {
      window.scbtSideMenuRef.classList.add('scbt-fl');
    }
    
    window.scbtChatMenuRef.classList.add('scbt-fl');
    window.scbtChatWrapperRef.classList.add('scbt-bl');
    window.scbtChatSearchInputTextRef.value = '';
    window.scbtChatSearchInputTextRef.focus();
    window.isdoSearch = 1;
    return false;
  }

  // closing
  if (window.isdoSearch === 1) {
    window.scbtChatContentRef.innerHTML = '';
    window.scbtChatARef.innerText = '';
    window.scbtChatBRef.innerText = '';
    if (window.scbtIsMobile === true) { 
      window.scbtSideMenuRef.classList.remove('scbt-fl');
    } else {
      window.scbtSideMenuRef.classList.remove('scbt-bl');
    }
    window.scbtChatMenuRef.classList.remove('scbt-fl');
    window.scbtChatWrapperRef.classList.remove('scbt-bl');
    window.scbtChatSearchStartsWithButtonRef.classList.remove('scbt-multiple');
    window.scbtChatSearchUserButtonRef.classList.remove('scbt-multiple');
    window.scbtChatSearchKeywordButtonRef.classList.remove('scbt-multiple');
    window.scbtChatSearchInputTextRef.value = '';
    window.scbtChatSearchInputTextRef.blur();
    window.isdoSearch = 0;
    window.scbtDbNameToSearch = window.scbtDbName;
    return false;
  }

}


function scbt_user_search_chat_by_keyword(e) {
  scbt_user_search_chat();
  var e = {};
  e.target = {};
  e.target.id = 'scbtChatSearchKeywordButton';
  scbt_user_search_saved_chat(e);
  e = null; return false;
}


function scbt_user_search_chat_by_user(e) {
  scbt_user_search_chat();
  var e = {};
  e.target = {};
  e.target.id = 'scbtChatSearchUserButton';
  scbt_user_search_saved_chat(e);
  e = null; return false;
}

function scbt_user_search_chat_by_events(e) {
  scbt_user_search_chat();
  var e = {};
  e.target = {};
  e.target.id = 'scbtChatSearchEventsButton';
  scbt_user_search_saved_chat(e);
  e = null; return false;
}

function scbt_user_search_chat_full(e) {
  scbt_user_search_chat();
  var e = {};
  e.target = {};
  e.target.id = 'scbtChatSearchFullButton';
  scbt_user_search_saved_chat(e);
  e = null; return false;
}


function scbt_user_search_chat_starts_with(e) {
  scbt_user_search_chat();
  var e = {};
  e.target = {};
  e.target.id = 'scbtChatSearchStartsWithButton';
  scbt_user_search_saved_chat(e);
  e = null; return false;
}


function scbt_user_search_multiple_saved_chat(e) {
  var chats = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null;
  if (e) {
    // if ( e.preventDefault ) { e.preventDefault(); }
  }
  var t = scbt_get_chat_search_text();

  searchType = '';
  toastMessage = 'Searching...';
  toastMessage2 = '';
  labelMessage = ''; 
  if (e.target.id == 'scbtChatSearchStartsWithButton') {
    searchType = 'startswith';
    toastMessage = t + ' beginning a message is being searched for';
    toastMessage2 = t + ' not found starting message';
    labelMessage = 'Chat starting with: ' + t;
  }
  if (e.target.id == 'scbtChatSearchUserButton') {
    searchType = 'byuser';
    toastMessage = ' messages from ' + t + ' being searched for ';
    toastMessage2 = t + ' username has no saved chat messages';
    labelMessage = 'Chat from username: ' + t;
  }
  if (e.target.id == 'scbtChatSearchKeywordButton') {
    searchType = 'bykeyword';
    toastMessage = t + ' in a message is being searched for ';
    toastMessage2 = t + ' not found in chat';
    labelMessage = 'Chat by phrase: ' + t;
  }
  if (e.target.id == 'scbtChatSearchEventsButton') {
    searchType = 'byevent';
    toastMessage = ' stream event search ';
    toastMessage2 = ' events not found ';
    labelMessage = 'Stream events';
  }
  if (e.target.id == 'scbtChatSearchFullButton') {
    searchType = 'full';
    t = 'test';
    toastMessage = ' full chat search ';
    toastMessage2 = ' chat not found ';
    labelMessage = 'Full stream chat';
  }
  if (t.length < 3) { var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
  window.scbtChatContentRef.innerHTML = '';
  scbt_helper_toast(toastMessage);  
  window.scbtStreamList = [];

  window.indexedDB.databases().then((arr) => {
    if (arr.length > 0) {
      var arrl = arr.length;
      for (var i = 0; i < arrl; i++) {
        var dbName = arr[i].name;
        if (dbName.startsWith('savedchat') ) {
          window.scbtStreamList.push(dbName);
          var service = '';
          var videoID = '';
          var channelName = '';
          var theDate = '';
          var dbArr = dbName.split('savedchat');
          var dbString = dbArr[1];
          var dbArr2 = dbString.split('&');
          service = dbArr2[1];
          channelName = dbArr2[2];
          videoID = dbArr2[3];
          // theDate = dbArr2[4];
            
          (async () => {
            var request = await window.indexedDB.open(dbName, 10);
            request.onsuccess = function(e) {
              if (!request.result) { setTimeout(function(){ scbt_helper_toast('Error: get database for multiple search chat result failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
              window.scbtUniqueMessageIds = [];
              var db = request.result;
              var transaction = db.transaction('chat', 'readonly');
              transaction.oncomplete = function() {
              };
              transaction.onabort = function() {
                scbt_handle_db_error_blocked(transaction.error);
              };
              var store = transaction.objectStore('chat'); 
              // (async () => {
              store.getAll().onsuccess = function(e2) {
                if (!e2) { setTimeout(function(){ scbt_helper_toast('Error: get database for multiple search chat e2 failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
                if (!e2.target) { setTimeout(function(){ scbt_helper_toast('Error: get database for multiple search chat e2 target failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
                if (!e2.target.result) { setTimeout(function(){ scbt_helper_toast('Error: get database for multiple search chat e2 target result failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
                var chats = e2.target.result;
                if (chats.length < 1) { scbt_helper_toast('Error: this stream chat not found for display'); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
                window.scbtChatARef.innerText = 'Saved Chat From '; // + channelId + ' on ' + service + ' ' + theDate
                window.scbtChatBRef.innerText = '';
                chats = scbt_get_sort_times(chats);
                window.scbtChatWrapperRef.classList.add('scbt-bl');

                if (searchType == 'bykeyword') {
                  [].forEach.call(chats, function(item) {
                    if (item.message.indexOf(t) > -1) {
                      if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
                        window.scbtUniqueMessageIds.push(item.itemid);
                        var classString = scbt_get_classString_for_chat(item);
                        var newElement = "<p class='" + classString + "'><span>" + chats[0].username + ' stream on ' + chats[0].message + ' : ' + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
                        window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
                      }
                    }
                  });
                }

                if (searchType == 'byuser') {
                  [].forEach.call(chats, function(item) {
                    if (item.username.indexOf(t) > -1) {
                      if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
                        window.scbtUniqueMessageIds.push(item.itemid);
                        var classString = scbt_get_classString_for_chat(item);
                        var newElement = "<p class='" + classString + "'><span>" + chats[0].username + ' stream on ' + chats[0].message + ' : ' + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
                        window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
                      }
                    }
                  });
                }

                if (searchType == 'full') {
                  [].forEach.call(chats, function(item) {
                      if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
                        window.scbtUniqueMessageIds.push(item.itemid);
                        var classString = scbt_get_classString_for_chat(item);
                        var newElement = "<p class='" + classString + "'><span>" + chats[0].username + ' stream on ' + chats[0].message + ' : ' + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
                        window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
                      }
                  });
                }

                if (searchType == 'startswith') {
                  [].forEach.call(chats, function(item) {
                    if (item.message.indexOf(t) == 0) {
                      if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
                        window.scbtUniqueMessageIds.push(item.itemid);
                        var classString = scbt_get_classString_for_chat(item);
                        var newElement = "<p class='" + classString + "'><span>" + chats[0].username + ' stream on ' + chats[0].message + ' : ' + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
                        window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
                      }
                    }
                  });
                }

                scbt_helper_insert_name_into_chat();
                if (e.delay) {
                  scbt_user_chat_down_to_bottom();
                }
            };
            store.getAll().onerror = function(error2) {
              scbt_handle_db_error_blocked(error2);
              var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
            };
            store.getAll().onblocked = function(error2) {
              scbt_handle_db_error_blocked(error2);
              var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
            };
          }; // request.onsuccess
          request.onerror = function(error) {
            scbt_handle_db_error_blocked(error);
            var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
          };
          request.onblocked = function(error) {
            scbt_handle_db_error_blocked(error);
            var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
          };
      })(); // async

        }
      }
    }
  }); // window.indexedDB.databases().then
return false;
}


function scbt_user_search_saved_chat(e) {
  window.scbtUniqueMessageIds = [];
  var chats = x = option = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null;
  if (e) {
    // if ( e.preventDefault ) { e.preventDefault(); }
  }
  var t = scbt_get_chat_search_text();

  if (e.target.classList) {
    if (e.target.classList.contains('scbt-multiple') ) {
      if (e.target.id == 'scbtChatSearchStartsWithButton') {
        scbt_user_search_multiple_saved_chat(e);
        return false;
      }
      if (e.target.id == 'scbtChatSearchUserButton') {
        scbt_user_search_multiple_saved_chat(e);
        return false;
      }
      if (e.target.id == 'scbtChatSearchKeywordButton') {
        scbt_user_search_multiple_saved_chat(e);
        return false;
      }
    }
  }

  searchType = '';
  toastMessage = 'Searching...';
  toastMessage2 = '';
  labelMessage = ''; 
  if (e.target.id == 'scbtChatSearchStartsWithButton') {
    searchType = 'startswith';
    toastMessage = t + ' beginning a message is being searched for';
    toastMessage2 = t + ' not found starting message';
    labelMessage = 'Chat starting with: ' + t;
  }
  if (e.target.id == 'scbtChatSearchUserButton') {
    searchType = 'byuser';
    toastMessage = ' messages from ' + t + ' being searched for ';
    toastMessage2 = t + ' username has no saved chat messages';
    labelMessage = 'Chat from username: ' + t;
  }
  if (e.target.id == 'scbtChatSearchKeywordButton') {
    searchType = 'bykeyword';
    toastMessage = t + ' in a message is being searched for ';
    toastMessage2 = t + ' not found in chat';
    labelMessage = 'Chat by phrase: ' + t;
  }
  if (e.target.id == 'scbtChatSearchEventsButton') {
    searchType = 'byevent';
    t = 'test';
    toastMessage = ' stream events ';
    toastMessage2 = ' events not found ';
    labelMessage = 'Stream event chat';
  }
  if (e.target.id == 'scbtChatSearchFullButton') {
    searchType = 'full';
    t = 'test';
    toastMessage = ' full chat search ';
    toastMessage2 = ' chat not found ';
    labelMessage = 'Full stream chat';
  }

  if (t.length < 3) { var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }

  window.scbtChatContentRef.innerHTML = '';
  scbt_helper_toast(toastMessage);
  var request = window.indexedDB.open(window.scbtDbNameToSearch, 10);

  request.onsuccess = function(e) {
    if (!request.result) { scbt_helper_toast('Error: get database for live stream chat failed.'); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
    var db = request.result;
    var transaction = db.transaction('chat', 'readonly');
    transaction.oncomplete = function() {
      
    };
    transaction.onabort = function() {
      scbt_handle_db_error_blocked(transaction.error);
    };
    var store = transaction.objectStore('chat'); 
    store.getAll().onsuccess = function(e2) {
      
      if (!e2) { setTimeout(function(){ scbt_helper_toast('Error: get database for search chat e2 failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
      if (!e2.target) { setTimeout(function(){ scbt_helper_toast('Error: get database for search chat e2 target failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
      if (!e2.target.result) { setTimeout(function(){ scbt_helper_toast('Error: get database for search chat e2 target result failed.'); }, 2700); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
      var chats = e2.target.result;
      if (chats.length < 1) { scbt_helper_toast('Error: this stream chat not found for display'); var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false; }
      window.scbtChatContentRef.innerHTML = '';
      window.scbtChatARef.innerText = 'Saved Chat From '; 
      window.scbtChatBRef.innerText = '';
      chats = scbt_get_sort_times(chats);
      window.scbtChatWrapperRef.classList.add('scbt-bl');
      
      if (searchType == 'byevent') {
        
      }

      if (searchType == 'bykeyword') {
        [].forEach.call(chats, function(item) {
          if (item.message.indexOf(t) > -1) {
            if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
              window.scbtUniqueMessageIds.push(item.itemid);
              var classString = scbt_get_classString_for_chat(item);
              var newElement = "<p class='" + classString + "'><span>" + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
              window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
            }
          }
        });
      }

      if (searchType == 'byuser') {
        [].forEach.call(chats, function(item) {
          if (item.username.indexOf(t) > -1) {
            if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
              window.scbtUniqueMessageIds.push(item.itemid);
              var classString = scbt_get_classString_for_chat(item);
              var newElement = "<p class='" + classString + "'><span>" + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
              window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
            }
          }
        });
      }

      if (searchType == 'full') {
        [].forEach.call(chats, function(item) {
            if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
              window.scbtUniqueMessageIds.push(item.itemid);
              var classString = scbt_get_classString_for_chat(item);
              var newElement = "<p class='" + classString + "'><span>" + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
              window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
            }
        });
      }

      if (searchType == 'startswith') {
        [].forEach.call(chats, function(item) {
          if (item.message.indexOf(t) == 0) {
            if (window.scbtUniqueMessageIds.includes(item.itemid) === false) {
              window.scbtUniqueMessageIds.push(item.itemid);
              var classString = scbt_get_classString_for_chat(item);
              var newElement = "<p class='" + classString + "'><span>" + item.timestamp + " : <span class='author-name'>" + item.username + "</span> </span><b>" + item.message + "</b></p>";
              window.scbtChatContentRef.insertAdjacentHTML('beforeend', newElement);
            }
          }
        });
      }

      scbt_helper_insert_name_into_chat();
      if (e.delay) {
        scbt_user_chat_down_to_bottom();
      }
    }; // store.getAll().onsuccess
    store.getAll().onerror = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
    };
    store.getAll().onblocked = function(error2) {
      scbt_handle_db_error_blocked(error2);
      var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
    };
  }; // request.onsuccess
  request.onerror = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
  };
  request.onblocked = function(error) {
    scbt_handle_db_error_blocked(error);
    var chats = x = option = e = e2 = error = error2 = request = obj = db = transaction = store = x = theHTML = newElement = classString = item = t = searchType = toastMessage = toastMessage2 = labelMessage = arr = arrl = dbName = service = videoID = channelName = theDate = dbArr = dbString = dbArr2 = null; return false;
  };

}


function scbt_user_share_native(e) {
  var toShare = '';
  if (e) {
    if (e.target) {
      if (e.target.dataset) {
        if (e.target.dataset.share) {
          toShare = e.target.dataset.share;
        }
      }
    }
  }
  if (navigator.share) {
    navigator.share({
      title: 'From ' + window.scbtChannelName + ' on ' + window.scbtService,
      text: toShare,
      url: window.location.href,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }

  e = null; toShare = null; return false;
}


function scbt_user_share_this(e) {
  var selectedSocialMedia = e.target.value;
  if ( (selectedSocialMedia == '') || (selectedSocialMedia == 'Select social media...') || (selectedSocialMedia == null) ) {
    return false;
  }
  var toShare = window.location.href;
  if (typeof e == 'string') {
    toShare = e;
  } else {
    if (e) {
      if (e.target) {
        if (e.target.dataset) {
          if (e.target.dataset.share) {
            toShare = e.target.dataset.share;
          }
        }
      }
    }
  }

  navigator.clipboard.writeText(toShare).then(function() {
      
      if (selectedSocialMedia == 'Custom') {
        theLink = window.localStorage['scbtCustomLinkCustom'];
        window.open(theLink);
        e = null; selectedSocialMedia = null; toShare = null; theLink = null;
        return false;
      }

      if (selectedSocialMedia == 'Email') {
        var emailShare = document.getElementById('scbtvideo7Email');
        if (emailShare) { } else {
          var theHTML = "<a id='scbtvideo7Email' href='mailto:' style='visibility: hidden;'>Email</a>";
          window.scbtXRef.insertAdjacentHTML('afterbegin', theHTML );
          var emailShare = document.getElementById('scbtvideo7Email');
        }
        if ( window.localStorage['scbtCustomLinkEmail'] ) {
          emailShare.href = 'mailto:' + window.localStorage['scbtCustomLinkEmail'] + '?subject=' + e.target.dataset.streamer + '%20streaming&body=' + toShare;
        } else {
          emailShare.href = 'mailto:me@mail.com?subject=' + e.target.dataset.streamer + '%20streaming&body=' + toShare;
        }
        emailShare.click();
        e = null; selectedSocialMedia = null; toShare = null; theLink = null; emailShare = null;
        return false;
      }

      var theLink = toShare;
      if ( window.jsonSocialMedias[selectedSocialMedia] ) {
          theLink = window.jsonSocialMedias[selectedSocialMedia];
          if ( window.localStorage['scbtCustomLink' + selectedSocialMedia] ) {
            theLink = theLink + '/' + window.localStorage['scbtCustomLink' + selectedSocialMedia];
          }
      } else {
        var theLink = 'https://' + e.target.value;
      }
      
      window.open(theLink);
      e = null; selectedSocialMedia = null; toShare = null; theLink = null; return false;
  }, function(err) {
      console.log('copy error');
      alert(err);
  });
}


// view stream in theatre mode
function scbt_user_theatre_mode() {
 var x = document.getElementById('secondary');
  if (x) {
    if (x.style.display == 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }
  x = null; y = null; return false;
}


function scbt_user_toggle_chat_menu() {
  if (window.scbtIsMobile === true) {
    if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
      window.scbtSideMenuRef.classList.remove('scbt-bl');
      // window.scbtChatMenuRef.classList.remove('scbt-fl');
    } else {
      window.scbtSideMenuRef.classList.add('scbt-bl');
      // window.scbtChatMenuRef.classList.add('scbt-fl');
    }
  } else {
    if (window.scbtSideMenuRef.classList.contains('scbt-bl') ) {
      window.scbtSideMenuRef.classList.remove('scbt-bl');
      window.scbtChatMenuRef.classList.remove('scbt-fl');
    } else {
      window.scbtSideMenuRef.classList.add('scbt-bl');
      window.scbtChatMenuRef.classList.add('scbt-fl');
    }
  }

  return false;
}


window.scbtVisibility = 0;
function scbt_user_toggle_chats(e) {

  var parameter = '';
  if (e) {
    if (typeof e == 'string') {
      parameter = e;
    } else {
      e.preventDefault();
      if (e.target) {
        if (e.target.id) {
          switch ( e.target.id ) {
            case 'scbt4':
              parameter = 'owner';
              break;
            case 'scbt5':
              parameter = 'moderator';
              break;
            case 'scbt6':
               parameter = 'sub';
              break;
            case 'scbt7':
              parameter = 'mod_sub';
              break;
            case 'scbt8':
              parameter = 'vip';
              break;
            case 'scbt9':
              parameter = 'donation';
              break;
            case 'scbt11':
              parameter = 'mention';
              break;
            case 'scbt12':
              parameter = 'hashtag';
              break;
            case 'scbt29':
              parameter = 'newSub';
              break;
          } // end switch
        } // if e target id
      }   // e target
    }     // if e is not a string 

  }       // if e

  if (parameter) {
    
    // saved chat 
    if (parameter == 'vip') {
      parameter = 'verified';
    }

    if (window.scbtChatWrapperRef.classList.contains('scbt-bl') ) {
      var divs = window.scbtChatWrapperRef.querySelectorAll('p');
      if (window.scbtVisibility === 0) {
        window.scbtChatBRef.innerText = scbt_set_chat_parameter(parameter, window.scbtVisibility);
        [].forEach.call(divs, function(div) {

          if (parameter == 'mod_sub') {
              if ( (div.classList.contains('sub')) || (div.classList.contains('moderator')) ) {
                scbt_helper_chat_on(div);
                div.style.display = 'block';
              } else {
                div.style.display = 'none';
              }
            } else if ( (parameter == 'mention') || (parameter == 'hashtag') ) {
              var t = div.querySelectorAll('b');
              if (t[0]) { t = t[0].innerText; } else { t = div.innerText; }
              if ( ((parameter == 'mention') && (t.indexOf('@') > -1) ) || ((parameter == 'hashtag') && ( t.indexOf('#') > -1) ) ) {  
                scbt_helper_chat_on(div);
                div.style.display = 'block';
              } else {
                div.style.display = 'none';
              }
            } else {
            if (div.classList.contains(parameter) ) {
              scbt_helper_chat_on(div);
              div.style.display = 'block';
            } else {
              div.style.display = 'none';
            }
          }

        });
        window.scbtVisibility = 1; 
        t = null; parameter = null; divs = null; div = null; return false;
      }

      if (window.scbtVisibility === 1) {
        window.scbtChatBRef.innerText = scbt_set_chat_parameter(parameter, window.scbtVisibility);
        [].forEach.call(divs, function(div) {
            
            if (parameter == 'mod_sub') {
              if ( (div.classList.contains('sub')) || (div.classList.contains('moderator')) ) {
                div.style.display = 'none';
              } else {
                div.style.display = 'block';
                scbt_helper_chat_blur(div);
              }
            } else if ( (parameter == 'mention') || (parameter == 'hashtag') ) {
              var t = div.querySelectorAll('b');
              if (t[0]) { t = t[0].innerText; } else { t = div.innerText; }
              if ( ((parameter == 'mention') && (t.indexOf('@') > -1) ) || ((parameter == 'hashtag') && ( t.indexOf('#') > -1) ) ) {  
                div.style.display = 'none';
              } else {
                div.style.display = 'block';
                scbt_helper_chat_blur(div);
              }
            } else {
              if (div.classList.contains(parameter) ) {
                div.style.display = 'none';
              } else {
                div.style.display = 'block';
                scbt_helper_chat_blur(div);
              }
            }

        });
        window.scbtVisibility = 2;
        t = null; parameter = null; divs = null; div = null; return false;
      }

      if (window.scbtVisibility === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.display = 'block';
          scbt_helper_chat_off(div);
        });
        window.scbtVisibility = 0;
        parameter = null; divs = null; div = null; return false;
      }

      // live chat
    } else {
      var divs = window.scbtDivs;
      var toSearchFor = window.scbtToSearchFor;

      if ( (parameter == 'mention') || (parameter == 'hashtag') ) {
        divs = window.scbtZ.document.body.querySelectorAll('.yt-live-chat-text-message-renderer .yt-live-chat-text-message-renderer');
      } else {
        divs = scbt_get_chat_messages();
      }
      toSearchFor = 'xyz';

      if (window.scbtVisibility === 0) {
        window.scbtChatBRef.innerText = scbt_set_chat_parameter(parameter, window.scbtVisibility);
        [].forEach.call(divs, function(div) {
          div.style.opacity = 0;

            if ( (parameter == 'owner') || (parameter == 'moderator') || (parameter == 'sub') || (parameter == 'member') || (parameter == 'mod_sub') ) {
              if (parameter == 'sub') { parameter = 'member'; }
              if ( div.getAttribute('author-type') ) { 
                toSearchFor = div.getAttribute('author-type');
              } else {
                toSearchFor = 'xyz';
              }
              if ( (parameter != 'mod_sub' && toSearchFor == parameter) || (parameter == 'mod_sub' && toSearchFor != 'xyz') ) {
              // if (toSearchFor.indexOf(parameter) > -1 ) {
                scbt_helper_chat_on(div);
                div.style.opacity = 1;
              }
            }
            
            if ( (parameter == 'vip') || (parameter == 'verified') ) {
              if (div.classList.contains('vip') ) {
                scbt_helper_chat_on(div);
                div.style.opacity = 1;
              }
              var x = div.querySelector('#chip-badges .yt-live-chat-author-chip');
              if (x) {
                if (x.ariaLabel == 'Verified') {
                  div.style.opacity = 1;
                }
              }
              var arr = div.querySelectorAll('.vip');
              [].forEach.call(arr, function(message) {
                  div.style.opacity = 1;
              });
            }

            if (parameter == 'donation') {
              var arr = div.querySelectorAll('#card.yt-live-chat-paid-sticker-renderer, #card.yt-live-chat-paid-message-renderer');
              [].forEach.call(arr, function(message) {
                div.style.opacity = 1;
              });
            }

            if (parameter == 'mention') {
              if (div.id == 'message') {
                var t = div.innerText;
                if ( t.indexOf('@') > -1 ) {
                  scbt_helper_chat_on(div);
                  div.style.opacity = 1;
                }
              }
            }

            if (parameter == 'hashtag') {
              if (div.id == 'message') {
                var t = div.innerText;
                if ( t.indexOf('#') > -1 ) {
                  scbt_helper_chat_on(div);
                  div.style.opacity = 1;
                }
              }
            }

      });
      window.scbtVisibility = 1;
      t = null; a = null; alt = null; divs = null; div = null; toSearchFor = null; arr = null; return false;
    }


      if (window.scbtVisibility === 1) {
        window.scbtChatBRef.innerText = scbt_set_chat_parameter(parameter, window.scbtVisibility);
        [].forEach.call(divs, function(div) {
            div.style.opacity = 1;
            scbt_helper_chat_blur(div);

            if ( (parameter == 'owner') || (parameter == 'moderator') || (parameter == 'sub') || (parameter == 'member') || (parameter == 'mod_sub') ) {
                if (parameter == 'sub') { parameter = 'member'; }
                if (parameter == 'sub') { parameter = 'member'; }
                if ( div.getAttribute('author-type') ) { 
                  toSearchFor = div.getAttribute('author-type');
                } else {
                  toSearchFor = 'xyz';
                }
                if ( (parameter != 'mod_sub' && toSearchFor == parameter) || (parameter == 'mod_sub' && toSearchFor != 'xyz') ) {
                  div.style.opacity = 0;
                }
              }

              if ( (parameter == 'vip') || (parameter == 'verified') ) {
                var x = div.querySelector('#chip-badges .yt-live-chat-author-chip');
                if (x) {
                  if (x.ariaLabel == 'Verified') {
                    div.style.opacity = 0;
                  }
                }
                var arr = div.querySelectorAll('.vip');
                [].forEach.call(arr, function(message) {
                    div.style.opacity = 0;
                });

                if (div.classList.contains('vip') ) {
                  div.style.opacity = 0;
                }
              }

              if (parameter == 'donation') {
                var arr = div.querySelectorAll('#card.yt-live-chat-paid-sticker-renderer, #card.yt-live-chat-paid-message-renderer');
                [].forEach.call(arr, function(message) {
                  div.style.opacity = 0;
                });
              }

              if (parameter == 'mention') {
                if (div.id == 'message') {
                  var t = div.innerText;
                  if ( t.indexOf('@') > -1 ) {
                    div.style.opacity = 0;
                  }
                }
              }

              if (parameter == 'hashtag') {
                if (div.id == 'message') {
                  var t = div.innerText;
                  if ( t.indexOf('#') > -1 ) {
                    scbt_helper_chat_on(div);
                    div.style.opacity = 0;
                  }
                }
              }

          });
          window.scbtVisibility = 2;
          t = null; a = null; alt = null; divs = null; div = null; toSearchFor = null; arr = null; return false;
      }

      if (window.scbtVisibility === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          scbt_helper_chat_off(div);
          div.style.opacity = 1;
        });
        window.scbtVisibility = 0;
         divs = null; div = null; toSearchFor = null; arr = null; return false;
      }

    }


  } else {
    // TODO: no parameter
  }

  return false;
}


function scbt_user_toggle_menu(element, dType) {
  if (typeof element == 'object') {
    var id = element.target.id;
    if (id == 'scbt0') {
      var x = window.scbtKeyboardContainerRef;
    }
    if (id == 'scbt3') {
      var x = window.scbtHighlightsMenuRef;
    }
    dType = 'block';
  } else {
    var x = document.getElementById(element);
  }

  if (x) { 
    if (x.style.display == dType) {
      x.style.display = 'none';
    } else {
      x.style.display = dType;
      setTimeout(function(){ document.body.scrollTop = 0; document.documentElement.scrollTop = 0; }, 1500);
    }
  } else {
    setTimeout(function(){ scbt_helper_toast('Error: Please refresh page to fix menu'); }, 1500);
  }
  element = null; dType = null; id = null; x = null; return false;
}


function scbt_user_toggle_options_menu(e) {
  if (e) {
    e.preventDefault();
    if (e.target) {
      if (e.target.id == 'scbt2') {
        if (e.target.classList.contains('focused') ) {
          e.target.classList.remove('focused');
        } else {
          e.target.classList.add('focused');
        }
      } 
    }
  }

  var x = document.getElementById('scbtOptionsMenu');
  if (x.className.match('scbt-bl') ) { 
    x.classList.remove('scbt-bl');
  } else {
    x.classList.add('scbt-bl');
  }

  document.body.scrollTop = document.documentElement.scrollTop = 0;
  return false;
}


window.isdoSubs = 0;
function scbt_user_toggle_sub_event_chats() {
  if (window.scbtChatWrapperRef.classList.contains('scbtSearchOpen') ) {
      var divs = window.scbtChatWrapperRef.querySelectorAll('p');

      if (window.isdoSubs === 0) {
        window.scbtChatBRef.innerText = ' - new member events -';
        [].forEach.call(divs, function(div) {
            if (div.classList.contains('newSub') ) {
              div.style.display = 'block';
            } else {
              div.style.display = 'none';
            }
        });
        window.isdoSubs = 1;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoSubs === 1) {
        window.scbtChatBRef.innerText = ' - non member events -';
        [].forEach.call(divs, function(div) {
            if (div.classList.contains('newSub') ) {
              div.style.display = 'none';
            } else {
              div.style.display = 'block';
              scbt_helper_chat_blur(div);
            }
        });
        window.isdoSubs = 2;
        x = null; divs = null; div = null; return false;
      }


      if (window.isdoSubs === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.display = 'block';
          scbt_helper_chat_off(div);
        });
        window.isdoSubs = 0;
        x = null; divs = null; div = null; return false;
      }

    } else {
      var divs = scbt_get_chat_messages();

      if (window.isdoSubs === 0) {
        window.scbtChatBRef.innerText = ' - new member events -';
        [].forEach.call(divs, function(div) {
          div.style.opacity = 0;
          if (div.classList.contains('bg-secondary') ) {
            div.style.opacity = 1;
          }            
        });
        window.isdoSubs = 1;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoSubs === 1) {
        window.scbtChatBRef.innerText = ' - non member events -';
        [].forEach.call(divs, function(div) {
            div.style.opacity = 1;
            if (div.classList.contains('bg-secondary') ) {
              div.style.opacity = 0;
            }            
        });
        window.isdoSubs = 2;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoSubs === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.opacity = 1;
        });
        window.isdoSubs = 0;
        x = null; divs = null; div = null; return false;
      }
  }
  return false;
}


window.isdoVerifiedChats = 0;
function scbt_user_toggle_verified_chats() {
  if (window.scbtChatWrapperRef.classList.contains('scbtSearchOpen') ) {
      var divs = window.scbtChatWrapperRef.querySelectorAll('p');

      if (window.isdoVerifiedChats === 0) {
        window.scbtChatBRef.innerText = ' - VIP chats -';
        [].forEach.call(divs, function(div) {
            if (div.classList.contains('verified') ) {
              div.style.display = 'block';
            } else {
              div.style.display = 'none';
            }
        });
        window.isdoVerifiedChats = 1;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoVerifiedChats === 1) {
        window.scbtChatBRef.innerText = ' - non VIP chats -';
        [].forEach.call(divs, function(div) {
            if (div.classList.contains('verified') ) {
              div.style.display = 'none';
            } else {
              div.style.display = 'block';
              scbt_helper_chat_blur(div);
            }
        });
        window.isdoVerifiedChats = 2;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoVerifiedChats === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          div.style.display = 'block';
          scbt_helper_chat_off(div);
        });
        window.isdoVerifiedChats = 0;
        x = null; divs = null; div = null; return false;
      }

    } else {
      var divs = scbt_get_chat_messages();

      if (window.isdoVerifiedChats === 0) {
        window.scbtChatBRef.innerText = ' - VIP chats -';
        [].forEach.call(divs, function(div) {
          div.style.opacity = 0;
          var arr = div.querySelectorAll('.badge');
          [].forEach.call(arr, function(message) {
            var t = message.innerText;
            if (t == 'VIP') {
              scbt_helper_chat_on(div);
              div.style.opacity = 1;
            }
          });            
        });
        window.isdoVerifiedChats = 1;
        x = null; divs = null; div = null; return false;
      }

      if (window.isdoVerifiedChats === 1) {
        window.scbtChatBRef.innerText = ' - non VIP chats -';
        [].forEach.call(divs, function(div) {
            div.style.opacity = 1;
            scbt_helper_chat_blur(div);
            var arr = div.querySelectorAll('.badge');
            [].forEach.call(arr, function(message) {
              var t = message.innerText;
              if (t == 'VIP') {
                div.style.opacity = 0;
              }
            });            
          });
          window.isdoVerifiedChats = 2;
          x = null; divs = null; div = null; return false;
      }

      if (window.isdoVerifiedChats === 2) {
        window.scbtChatBRef.innerText = '';
        [].forEach.call(divs, function(div) {
          scbt_helper_chat_off(div);
          div.style.opacity = 1;
        });
        window.isdoVerifiedChats = 0;
        x = null; divs = null; div = null; return false;
      }
    }
  return false;
}


function scbt_user_turn_off_voice_commands() {
  window.recognition = null;
  window.SpeechRecognition = null;
  window.SpeechGrammarList = null;
  window.SpeechRecognitionEvent = null;
  return false;
}


function scbt_user_turn_on_voice_commands() {
      window.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
      // var recognition = new SpeechRecognition();
      window.recognition.continuous = true;
      window.recognition.lang = 'en-US';
      window.recognition.interimResults = false;
      window.recognition.maxAlternatives = 1;
      window.recognition.start();

      window.recognition.onresult = function(event) {
        if (event) {
          var t = event.results[event.results.length - 1][0].transcript;
          if (t) {
            t = t.replace(/[^a-zA-Z0-9_\-@\s]/g, '');
            t = t.trim();
            t = t.toLowerCase();
            console.log('Result received: ' + t);
            
            if (t == 'computer toggle chat') {
              scbt_user_command1();
              return false;
            }
            if (t == 'computer search chat') {
              scbt_user_command2();
              return false;
            }
            if (t == 'computer search all chat') {
              scbt_user_command4();
              return false;
            }
            if (t == 'computer chat top') {
              scbt_user_chat_up_to_top();
              return false;
            }
            if (t == 'computer chat bottom') {
              scbt_user_chat_down_to_bottom();
              return false;
            }
          }
        }
      }

      window.recognition.onspeechend = function() {
        console.log('onspeechend');
        window.recognition.stop();
        sctb_turn_off_voice_commands();
        sctb_turn_on_voice_commands();
      }

      window.recognition.onnomatch = function(event) {
        console.log('onnomatch');
      }

      window.recognition.onerror = function(event) {
        console.log('on speech error');
        console.log('Error occurred in recognition: ' + event.error);
        sctb_turn_off_voice_commands();
        sctb_turn_on_voice_commands();
        return false;
      }
}


function scbt_user_save_social_options() {
  var socialMediaShareOptions = document.body.querySelectorAll('#scbtSocialMediaShareOptions input');
  var socialMediaShareCustomOptions = document.body.querySelectorAll('#scbtSocialMediaShareCustomOptions input');

  [].forEach.call(socialMediaShareOptions, function(anOption) {
      var theId = anOption.id;

      if (anOption.checked) {
        window.localStorage[theId] = '1';
      } else {
        window.localStorage[theId] = '0';
      }
  });

  [].forEach.call(socialMediaShareCustomOptions, function(anOptionCustom) {
      if (anOptionCustom.value) {
        var theId = anOptionCustom.id;
        window.localStorage[theId] = anOptionCustom.value;
      }
  });

  if (window.scbtvideo6Ref.value) {
    window.localStorage['scbtShareToCustom'] = '1';
    window.localStorage['scbtCustomLinkCustom'] = window.scbtvideo6Ref.value;
  } else {
    window.localStorage['scbtShareToCustom'] = '0';
    window.localStorage['scbtCustomLinkCustom'] = null;
  }

  if (window.scbtvideo7Ref.value) {
    window.localStorage['scbtShareToEmail'] = '1';
    window.localStorage['scbtCustomLinkEmail'] = window.scbtvideo7Ref.value;
  } else {
    window.localStorage['scbtShareToEmail'] = '0';
    window.localStorage['scbtCustomLinkEmail'] = null;
  }

  window.scbtSocialSubmitButtonRef.textContent = 'Social settings saved.';
  scbt_helper_toast('Status: Social settings saved.');
  setTimeout(function() {
    window.scbtSocialSubmitButtonRef.textContent = 'Save Social';
    return false;
  }, 1000);
}


function scbt_start_setup() {
    var myInterval = setInterval(function () {
      var x = document.body.querySelectorAll('iframe#chatframe');
      if (x) {
        var y = x[0];
        if (y) {
          var z = y.contentWindow.document.body.querySelectorAll('#items');
          if (z) {
            window.scbtC = z;
            window.scbtZ = x[0].contentWindow;
            clearInterval(myInterval);
          }
        }
      }
  }, 3000);


    var myInterval2 = setInterval(function () {
      if (window.scbtIsMobile === true) {
          var a = document.getElementById('app');
          var b = document.body.querySelectorAll('.mobile-topbar-header-content')[0];
          if (a && b) {
            window.scbtA = a;
            window.scbtB = b;
            clearInterval(myInterval2);
            scbt_helper_build_all_menus(window.scbtA, window.scbtB, window.scbtC);
          }
      } else {
        var a = document.getElementById('content');
        if (a) {
          window.scbtA = a;
          window.scbtB = a;
          clearInterval(myInterval2);
          scbt_helper_build_all_menus(window.scbtA, window.scbtB, window.scbtC);
        }
      }
  }, 3000);

}


function scbt_get_channel_name() {
  var isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
  if (isMobile === true) {

    var myInterval = setInterval(function () {
      var x = document.body.querySelector('.slim-owner-channel-name');
      if (x) {
        window.scbtChannelName = x.innerText;
        window.scbtChannelName = window.scbtChannelName.trim();
        window.scbtChannelName = window.scbtChannelName.replace(/ /g, '_');
        window.scbtChannelName = window.scbtChannelName.replace(/\W/g, '');
        clearInterval(myInterval);
        var videoID = new Date().toISOString().slice(0, 10) + '&streamer';
        if (window.location.search == '') {
          var path = window.location.pathname;
          if (path.indexOf('live') > -1) {
            var whatarr = path.split('/');
            videoID = new Date().toISOString().slice(0, 10) + '&' + whatarr[2];
          }
        } else {
          var arr = window.location.search.split('?');
          var arr2 = arr[1].split('=');
          var arr3 = arr2[1].split('&');
          videoID = arr3[0];
        }
        window.scbtvideoID = videoID;
        scbt_get_db_name('startSaving');
        return false;
      }
    }, 2000);

  } else {

    var myInterval = setInterval(function () {
      var x = document.body.querySelector('.ytd-channel-name');
      if (x && window.scbtZ) {
        window.scbtChannelName = x.innerText;
        window.scbtChannelName = window.scbtChannelName.trim();
        window.scbtChannelName = window.scbtChannelName.replace(/ /g, '_');
        window.scbtChannelName = window.scbtChannelName.replace(/\W/g, '');
        clearInterval(myInterval);
        var videoID = new Date().toISOString().slice(0, 10) + '&streamer';
        if (window.location.search == '') {
          var path = window.location.pathname;
          if (path.indexOf('live') > -1) {
            var whatarr = path.split('/');
            videoID = new Date().toISOString().slice(0, 10) + '&' + whatarr[2];
          }
        } else {
          var arr = window.location.search.split('?');
          var arr2 = arr[1].split('=');
          var arr3 = arr2[1].split('&');
          videoID = arr3[0];
        }
        window.scbtvideoID = videoID;
        scbt_get_db_name('startSaving');
        return false;
      }
    }, 2000);  

  }
}



window.onload = function() { 
  scbt_get_service();
  scbt_make_toast();

  if ( window.hasOwnProperty('scbtChannelName') ) {  } else { window.scbtChannelName = null; }
  if ( window.hasOwnProperty('scbtvideoID') ) {  } else { window.scbtvideoID = null; }
  if ( window.hasOwnProperty('scbtDbName') ) {  } else { window.scbtDbName = null; }
  if ( window.hasOwnProperty('scbtDbNameToSearch') ) {  } else { window.scbtDbNameToSearch = null; }
  if ( window.hasOwnProperty('scbtCurrentURL') ) {  } else { window.scbtCurrentURL = null; }
  if ( window.hasOwnProperty('scbtisVOD') ) {  } else { window.scbtisVOD = null; }

  if ( window.hasOwnProperty('scbtA') ) {  } else { window.scbtA = null; }
  if ( window.hasOwnProperty('scbtB') ) {  } else { window.scbtB = null; }
  if ( window.hasOwnProperty('scbtC') ) {  } else { window.scbtC = null; }
  if ( window.hasOwnProperty('scbtZ') ) {  } else { window.scbtZ = null; }

  if ( window.hasOwnProperty('scbtOptions') ) {  } else { window.scbtOptions = {}; }
  if ( window.scbtOptions.hasOwnProperty('scbtBorderColor') ) {  } else { window.scbtOptions.scbtBorderColor = '#ff0000'; }
  if ( window.scbtOptions.hasOwnProperty('scbtfeature4') ) {  } else { window.scbtOptions.scbtfeature4 = false; }
  if ( window.scbtOptions.hasOwnProperty('scbtfeature5') ) {  } else { window.scbtOptions.scbtfeature5 = false; }
  if ( window.hasOwnProperty('scbtIsyoutube') ) {  } else { window.scbtIsyoutube = true; }
  if ( window.hasOwnProperty('scbtIsVODLoaded') ) {  } else { window.scbtIsVODLoaded = false; }
  if ( window.hasOwnProperty('scbtKeybindsOn') ) {  } else { window.scbtKeybindsOn = false; }
  if ( window.hasOwnProperty('scbtisVOD') ) {  } else { window.scbtisVOD = false; }
  if ( window.hasOwnProperty('scbtIsMobile') ) {  } else { window.scbtIsMobile = false; }
  if ( window.hasOwnProperty('scbtHeightSize') ) {  } else { window.scbtHeightSize = 1; }
  if ( window.hasOwnProperty('scbtFontSize') ) {  } else { window.scbtFontSize = 1; }
  if ( window.hasOwnProperty('scbtFontUp') ) {  } else { window.scbtFontUp = 1; }
  if ( window.hasOwnProperty('scbtStreamList') ) {  } else { window.scbtStreamList = []; }
  if ( window.hasOwnProperty('scbtSpoken') ) {  } else { window.scbtSpoken = []; }
  if ( window.hasOwnProperty('scbtArrayOfIds') ) {  } else { window.scbtArrayOfIds = []; }
  if ( window.hasOwnProperty('scbtUniqueMessageIds') ) {  } else { window.scbtUniqueMessageIds = []; }
  if ( window.hasOwnProperty('scbtBlockedWords') ) {  } else { window.scbtBlockedWords = []; }

  scbt_get_channel_name();

  var x = document.getElementById('scbtX');
  if (x) { } else {
    var newElement = "<div id='scbtX'>  <button id='scbtToggleButton2' class='icon-button topbar-menu-button-avatar-button' aria-label='Click Me' aria-haspopup='false'><div></div><div></div><div></div></button>  <button id='scbtToggleButton' class='icon-button topbar-menu-button-avatar-button' aria-label='Click Me' aria-haspopup='false'>⚙</button></div>";
    document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', newElement);
    setTimeout(function(){ window.scbtXRef = document.getElementById('scbtX'); }, 500);
    window.scbtMentionMenuRef = window.scbtXRef;
    window.scbtCloseMentionButtonRef = window.scbtXRef;

    window.scbtChatInputRef = window.scbtXRef;
    window.scbtChatSettingsMenuRef = window.scbtXRef;
    window.scbtChatWrapperLiveRef = window.scbtXRef;
    window.scbtSideMenuRef = window.scbtXRef;
    
    window.scbtChatWrapperRef = window.scbtXRef;
    window.scbtChatARef = window.scbtXRef;
    window.scbtChatBRef = window.scbtXRef;
    window.scbtCloseButtonRef = window.scbtXRef;
    window.scbtChatContentRef = window.scbtXRef;
    
    window.scbtChatMenuRef = window.scbtXRef;
    window.scbtChatSearchInputTextRef = window.scbtXRef;
    window.scbtChatSearchStartsWithButtonRef = window.scbtXRef;
    window.scbtChatSearchUserButtonRef = window.scbtXRef;
    window.scbtChatSearchKeywordButtonRef = window.scbtXRef;
    window.scbtChatSearchEventsButtonRef = window.scbtXRef;
    window.scbtChatSearchFullButtonRef = window.scbtXRef;

    window.scbtChatPreviousTitleRef = window.scbtXRef;
    window.scbtChatPreviousWrapperRef = window.scbtXRef;
    window.scbtOptionsTitleRef = window.scbtXRef;
    window.scbtOptionsWrapperRef = window.scbtXRef;

    window.scbtChatLogRef = window.scbtXRef;
    window.scbtChatPreviousContentRef = window.scbtXRef;
    window.scbtvideo6Ref = window.scbtXRef;
    window.scbtvideo7Ref = window.scbtXRef;
    window.scbtSocialMediaShareOptionsRef = window.scbtXRef;
    window.scbtSocialMediaShareCustomOptionsRef = window.scbtXRef;
    window.scbtSubmitButtonRef = window.scbtXRef;
    window.scbtStatusRef = window.scbtXRef;
    window.scbtCancelOptionsMenuRef = window.scbtXRef;
    
    window.scbtHighlightsMenuRef = window.scbtXRef;
    window.scbtKeyboardContainerRef = window.scbtXRef;
  }
  x = null; newElement = null;
  var body = document.getElementsByTagName('body')[0];
  body.classList.add('scbt-youtube');
  var isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
  if (isMobile) {
    window.scbtIsMobile = true;
    // body.classList.add('scbt-mobile');
  } else {
    body.classList.add('scbt-desktop');
  }

  scbt_start_setup();
};


document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress') {
      window.scbtChannelName = null;
      window.scbtvideoID = null;
      window.scbtDbName = null;
      window.scbtDbNameToSearch = null;
      if (window.location.href.indexOf('https://www.youtube.com/watch?v=') > -1) {
        scbt_start_setup();
        scbt_get_channel_name();
      }
    }
});

document.addEventListener('spfdone', function() {
    
});

window.addEventListener('unhandledrejection', e => {
  console.log('Browser database error: unhandled rejection: ');
  var request = e.target; 
  var error = e.reason; 
  console.error({ request, error });
  console.error(e);
  e = null; request = null; error = null;
});

chrome.runtime.onMessage.addListener(
  function(request, sender, goCapture) {

    if (request.message === 'clicked' || request.message === 'reggiechatloaded') {
      console.log('reggiechatloaded');
      scbt_start_setup();
    }
    if (window.scbtKeybindsOn === true) {
      if (request.message === 'reggiecommand1') {
        console.log('reggiecommand1 command');
        scbt_user_command1();
      }
      if (request.message === 'reggiecommand2') {
        scbt_user_command2();
      }
      if (request.message === 'reggiecommand3') {
        scbt_user_command3();
      }
      if (request.message === 'reggiecommand4') {
        scbt_user_command4();
      }
    }
});