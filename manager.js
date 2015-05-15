var manager = {
  init: function(){
    var that = this;
    $("#button").on("click", function(){
      data = that.parameters()
      that.auth(data)
    })
  },
  auth: function(data){
    var prefix = chrome.runtime.id
    localStorage.setItem("login", data.login)
    localStorage.setItem("password", data.password)
    chrome.runtime.sendMessage(data, function(response) {
      if (response.msg == "get_lucky"){
        chrome.tabs.getCurrent(function(tab){
          chrome.tabs.remove(tab.id);
        });
      }else{
        alert("認証失敗だよ〜ん")
        localStorage.removeItem("login", data.login)
        localStorage.removeItem("password", data.password)
      }
    });
  },
  parameters: function(){
    var login =  $("#login").val()
    var password = $("#password").val()
    if((login !== "") & (password !== "")){
      return {
        login: login,
        password: password
      }
    }
  }
}

$(document).ready(function(){
  manager.init()
})
