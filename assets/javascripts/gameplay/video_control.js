var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    game_status.player = new YT.Player('ytplayer', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    changePlayerGameStatus(event.data);
//    document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
}

function changePlayerGameStatus(playerStatus) {
    game_status.player_status = playerStatus;
}

function onPlayerStateChange(event) {
    changePlayerGameStatus(event.data);
}

//function changeBorderColor(playerStatus) {
//    var color;
//    if (playerStatus == -1) {
//        color = "#37474F"; // unstarted = gray
//    } else if (playerStatus == 0) {
//        color = "#FFFF00"; // ended = yellow
//    } else if (playerStatus == 1) {
//        color = "#33691E"; // playing = green
//    } else if (playerStatus == 2) {
//        color = "#DD2C00"; // paused = red
//    } else if (playerStatus == 3) {
//        color = "#AA00FF"; // buffering = purple
//    } else if (playerStatus == 5) {
//        color = "#FF6DOO"; // video cued = orange
//    }
//    if (color) {
//        document.getElementById('existing-iframe-example').style.borderColor = color;
//    }
//}
