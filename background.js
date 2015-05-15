// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//

(function(){
  var LOGIN_URL = "chrome-extension://" + chrome.runtime.id + "/manager.html"

  $.ajaxSetup({
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
  });
  if (Notification.permission !== "granted")
    Notification.requestPermission();

  var initialSetup =  function(){
    if((localStorage.getItem("login") == undefined) & (localStorage.getItem("password") == undefined)){
      chrome.tabs.getAllInWindow(function(tabs){
        var urls = _.map(tabs, function(tab){ return tab.url})
        if(!(_.contains(urls, LOGIN_URL))){
          return window.open(LOGIN_URL)
        }
      })
    }
  }
  initialSetup()

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if((request.login == localStorage.getItem("login")) && (request.password == localStorage.getItem("password"))){
        sendResponse({msg: "get_lucky"});
      }else{
        sendResponse({msg: "お前の席ねーから!"});
      }
    }
  )
})();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  console.log("url....", tab.url);

  console.log("status" + changeInfo.status);

  if(changeInfo.status != "complete")
    return;

  console.log("complete")
  var resource_token;
  var authorization;
  var username = localStorage.getItem("login")
  var password = localStorage.getItem("password")
  var client_id = "f935d2d9325dbf8a1ad8a6b4298fd3d306f308e7a2868e01e2281c0ce4d3f179"
  var client_secret = "e22c1f307d524761a7357f36e274adc57d1df326c2a807051e065284d7bd8fcd"
  var url = "http://api.localhost:3000/oauth/token?grant_type=password&username=" + username + "&password=" + password + "&client_id=" + client_id + "&client_secret=" + client_secret

  $.ajax({
    method: "POST",
    url: url
  }).done(function(res){

    resource_token = res.access_token;

    authorization = "Bearer " + resource_token;
    console.log("request with token")
    resourceTokenCallBack(tab, authorization);
  });
});

var resourceTokenCallBack = function(tab, auth_token){
  if(tab.url.indexOf("http://stackoverflow.com/questions/") < 0){
    return
  }

  $.ajax({
    method: "POST",
    url: "http://api.localhost:3000/posts.json",
    beforeSend: function(xhr){
      xhr.setRequestHeader("Authorization", auth_token);
    },
    data:{
      post: {
        title: tab.title,
        url: tab.url,
        content: "someone!",
        user_id: 1
      }
    }
  }).done(function(res){
    if(res.refer_recent){
      notifyAlert();
    }
  });
}

var notifyAlert = function(){
  var  imgNumber = Math.floor(Math.random()*(6 - 0));
  var  icon_path = "img/" + imgNumber + ".jpg"
  var notification = new Notification('街コン速報', {
    lang: "EUC-JP",
    icon: icon_path,
    body: "5/22(金)は、街コン(青山)"
  });
}
