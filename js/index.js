var spotifyPlayer = new SpotifyPlayer({exchangeHost:"https://playing-spotify-server.onrender.com"});
var show_bg, show_name, show_artist, show_album, show_status, show_bar;

function updateSettings() {
  show_bg = $("#menu-show-bg").prop("checked");
  show_name = $("#menu-show-name").prop("checked");
  show_artist = $("#menu-show-artist").prop("checked");
  show_album = $("#menu-show-album").prop("checked");
  show_status = $("#menu-show-status").prop("checked");
  show_bar = $("#menu-show-bar").prop("checked");
};

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

$(document).ready(function () {
  $("#js-btn-login").click(function () {
    spotifyPlayer.login();
  });
  $("#js-btn-logout").click(function () {
    spotifyPlayer.logout();
  });
  $("#js-btn-togglePlayback").click(function () {
    spotifyPlayer.togglePlayback();
  })
  
  var idleMouseTimer;
  var forceMouseHide = false;

  $("body").css('cursor', 'none');

  $("body").mousemove(function(ev) {
          if(!forceMouseHide) {
                  $("body").css('cursor', '');

                  clearTimeout(idleMouseTimer);

                  idleMouseTimer = setTimeout(function() {
                          $("body").css('cursor', 'none');

                          forceMouseHide = true;
                          setTimeout(function() {
                                  forceMouseHide = false;
                          }, 200);
                  }, 1000);
          }
  });
  
  $(":input").click(updateSettings);
  
  updateSettings();
});

$(document).keydown(function (keyEvent) {
  if (keyEvent.keyCode == 77) {
    $("#js-menu-container").animate({width: "toggle", opacity: "toggle"});
  };
});

spotifyPlayer.on('update', response => {
  if (!response) {
    $(".now-playing__name").show().text("Nothing playing ...")
    
    $(".background").css("background-image", "");
    
    $(".now-playing__artist").hide();
    $(".now-playing__album").hide();
    
    $(".now-playing__status").hide();
    $(".progress__bar").parent().hide();
  }
  else {
    $(".now-playing__img").html("<img src="+response.item.album.images[0].url+">");
    
    show_bg ? $(".background").css("background-image", "url("+response.item.album.images[0].url+")") : $(".background").css("background-image", "");
    
    show_name ? $(".now-playing__name").show().text(response.item.name) : $(".now-playing__name").hide();
    show_artist ? $(".now-playing__artist").show().text(response.item.artists[0].name) : $(".now-playing__artist").hide();
    show_album ? $(".now-playing__album").show().text(response.item.album.name) : $(".now-playing__album").hide();
    
    var symbol = response.is_playing ? '► ' : '❙❙ ';
    show_status ? $(".now-playing__status").show().text(symbol + millisToMinutesAndSeconds(response.progress_ms) + " / " + millisToMinutesAndSeconds(response.item.duration_ms)) : $(".now-playing__status").hide();
    show_bar ? $(".progress__bar").css("width", response.progress_ms * 100 / response.item.duration_ms+"%").parent().show() : $(".progress__bar").parent().hide();
  }
});

spotifyPlayer.on('login', user => {
  if (user === null) {
    $("#js-login-container").css("display", "block");
    $("#js-main-container").css("display", "none");
  } else {
    $("#js-login-container").css("display", "none");
    $("#js-main-container").css("display", "block");
  }
});

spotifyPlayer.init();