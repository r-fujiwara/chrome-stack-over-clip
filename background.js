// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function(){
  console.log("hogehoge");
  $.ajaxSetup({
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
  });
})();

//chrome.cookies.onChanged.addListener(function(info) {
//  console.log("onChanged" + JSON.stringify(info));
//});

chrome.tabs.onCreated.addListener(function(tab){
  var resource_token;
  var authorization;
  var _res;

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/oauth/token?grant_type=password&username=r-fujiwara@nekojarashi.com&password=ne5suke38&client_id=c57c4ee639eb5922fff55a592c74ebf99845a5a13e8f4f0b87b8ac251a88aa89&client_secret=4f95408f81887be0b32e24fdd2bbc5d05db159b1343f4020337e4516e79f5cc4"
  }).done(function(res){
      _res = res;
      console.log(res);
      resource_token = res.access_token
  });
  authorization = "Bearer " + resource_token
  console.log("tab_url..." + tab.url);

/*
  if(tab.url.indexOf("http://stackoverflow.com/questions/") < 0){
    return
  }
*/

  $.ajax({
    method: "GET",
    beforeSend: function(xhr){
      debugger
      xhr.setRequestHeader("Authorization", authorization);
    },
    url: "http://localhost:3000/posts.json"
  }).done(function(res){
    res.map(function(r){
      console.log("title..." + r.title);
    });
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
