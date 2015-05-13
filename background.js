// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function(){
  $.ajaxSetup({
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
  });
})();

//chrome.cookies.onChanged.addListener(function(info) {
//  console.log("onChanged" + JSON.stringify(info));
//});

chrome.tabs.onCreated.addListener(function(tabId, info, tab){
  

  $.ajax({
    method: "GET",
    url: "http://localhost:3000/posts.json"
  }).done(function(res){
    console.log("reponse..." + res);
  });

  /**
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/posts.json",
    data:{
      post: {
        title: "hogehoge33333333",
        url: "htttp://fugafuga.com/hogehoge.com",
        content: "someone!",
        user_id: "1"
      }
    }
  }).done(function(res){
    console.log("reponse..." + res);
  });
  **/

  /**
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/posts.json", true);
  xhr.onreadystatechange = function(){
    console.log("ready state")
    if (xhr.readyState == 4) {
      console.log("resp...." +  xhr.responseText);
    }
  }
  **/
});

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  var manager_url = chrome.extension.getURL("manager.html");
  focusOrCreateTab(manager_url);
});
