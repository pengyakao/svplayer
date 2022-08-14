var wrapper = document.querySelector(".wrapper");
var musicImg = wrapper.querySelector(".song_img img");
var musicName = wrapper.querySelector(".song_and_singer .song");
var musicSinger = wrapper.querySelector(".song_and_singer .singer");
var mainAudio = wrapper.querySelector("#main-audio");
var playPauseBtn = wrapper.querySelector(".play_pause");
var nextBtn = wrapper.querySelector("#next");
var prevBtn = wrapper.querySelector("#prev");
var repeatBtn = wrapper.querySelector('#loop_mode'); //循環模式切換
var progressArea = wrapper.querySelector(".progress-area"); //進度條區塊
var progressBar = wrapper.querySelector(".progress-bar"); //進度條
var lyricsTitle = wrapper.querySelector(".lyrics-title"); //歌詞標題
var lyricsText = wrapper.querySelector(".lyrics-text"); //歌詞
var favoriteIcon = wrapper.querySelector("#favorite"); //我的最愛狀態
var width = document.documentElement.scrollWidth;
// console.log(width);

var musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
    // console.log(lyricsTitle,lyricsText);
    loadLyrics(musicIndex);
    console.log(musicName, musicSinger, musicImg, mainAudio);
});

// load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].song_name;
    musicSinger.innerText = allMusic[indexNumb - 1].singer;
    musicImg.src = `img/${allMusic[indexNumb - 1].img}.jpg`;  // 資料夾路徑
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
    favoriteIcon.innerText = wrapper.querySelector(`#list_favorite_${indexNumb}`).innerText;
};

// 切換歌詞
function loadLyrics(a) {
    lyricsTitle.innerText = allLyrics[a - 1].lyrics_title;
    lyricsText.innerHTML = allLyrics[a - 1].lyrics_text;
}

// get favorite icon
function favoritebtn() {
    var FavId = `list_favorite_${musicIndex}`// 取得目前歌曲ID
    var getFavBtn = wrapper.querySelector(`#${FavId}`);  //取得目前狀態
    var getFavText = getFavBtn.innerText;
    // console.log(FavId); //list_favorite_12
    // console.log(getFavBtn); //
    // console.log(getFavText); //favorite_border
    if (getFavText != 'favorite_border') {
        wrapper.querySelector(`#${FavId}`).innerText = "favorite_border";
        favoriteIcon.innerText = "favorite_border";
    }
    else {
        wrapper.querySelector(`#${FavId}`).innerText = "favorite";
        favoriteIcon.innerText = "favorite";
    };
}


// playMusic function
function playMusic() {
    wrapper.classList.add("pause");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
};

// pauseMusic function
function pauseMusic() {
    wrapper.classList.remove("pause");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
};

// play or pause btn
playPauseBtn.addEventListener('click', function () {
    var isMusicPaused = wrapper.classList.contains("pause");
    if (isMusicPaused) { pauseMusic() }
    else { playMusic() };
});

// 下一首nextMusic function
function nextMusic() {
    musicIndex++;
    if (musicIndex > allMusic.length) { musicIndex = 1 }; //如果超過全部首歌曲數回到第一首
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    loadLyrics(musicIndex);
};
// 下一首 nextbtn
nextBtn.addEventListener("click", () => {
    nextMusic();
})

// 上一首prevMusic function
function prevMusic() {
    musicIndex--;
    if (musicIndex < 1) { musicIndex = allMusic.length }; //如果超過全部首歌曲數回到第一首
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    loadLyrics(musicIndex);
};

// 上一首 prevBtn
prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow();
    loadLyrics(musicIndex);
});

// 循環模式切換
repeatBtn.addEventListener("click", function () {
    var getText = repeatBtn.innerText; //先取得目前的狀態
    if (getText == 'repeat') {
        repeatBtn.innerText = 'repeat_one';
        repeatBtn.setAttribute("title", "song looped");
    }
    else if (getText == 'repeat_one') {
        repeatBtn.innerText = 'shuffle';
        repeatBtn.setAttribute("title", "Playback shuffle");
    }
    else {
        repeatBtn.innerText = 'repeat';
        repeatBtn.setAttribute("title", "Playlist looped");
    }
});

//動態進度條
mainAudio.addEventListener("timeupdate", function (e) {
    // console.log(e);  //播放資訊查看
    var currentTime = e.target.currentTime; //現在播放時間
    var duration = e.target.duration; //整首歌的時間
    var progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    var musicCurrentTime = wrapper.querySelector(".current"); //每首歌的現在時間
    var musicDuration = wrapper.querySelector(".duration"); // 每首歌的總時間
    mainAudio.addEventListener("loadeddata", function () {
        //更新每首歌的總時間
        var audioDuration = mainAudio.duration;
        var totalMin = Math.floor(audioDuration / 60);
        var totalSec = Math.floor(audioDuration % 60);
        totalSec = totalSec.toString();
        totalSec = totalSec.padStart(2, '0');
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    //更新每首歌的播放時間
    var currentMin = Math.floor(currentTime / 60);
    var currentSec = Math.floor(currentTime % 60);
    currentSec = currentSec.toString();
    currentSec = currentSec.padStart(2, '0');
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//點進度條調整音樂
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;//getting width of progress bar
    let clickedoffSetX = parseInt(e.offsetX);//getting offset x value
    // console.log(e);
    // console.log(parseInt(e.offsetX));
    let songDuration = mainAudio.duration;//getting song total duration
    mainAudio.currentTime = (clickedoffSetX / progressWidthval) * songDuration;
    // console.log(mainAudio.currentTime);
    playMusic();
    playingNow();
    loadLyrics(musicIndex);
});

// 當歌曲結束時
mainAudio.addEventListener("ended", function () {
    var getText = repeatBtn.innerText; //先取得目前循環的狀態
    if (getText == 'repeat') {
        nextMusic();
    }
    else if (getText == 'repeat_one') {
        mainAudio.currentTime = 0; //讓播放時間變回0
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        loadLyrics(musicIndex);
    }
    else {
        var randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        while (randIndex == musicIndex) {
            randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }
        musicIndex = randIndex;
        // console.log(randIndex);
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        loadLyrics(musicIndex);
    }
});

// 換顏色
function chcolor(x) {
    document.getElementById(x).style.color = '#F9595F';
};
// 換回原本顏色
function chcolored(x) {
    document.getElementById(x).style.color = '#cecaca';
};

function playingNow() {
    for (var j = 1; j <= allMusic.length; j++) {
        var listNum = wrapper.querySelector(`#list${j}`);
        var listNumber = listNum.id;
        if (listNumber != `list${musicIndex}`) {
            listNum.classList.remove("playing");
            chcolored(listNumber);
            console.log(listNumber);
        };
        if (listNumber == `list${musicIndex}`) {
            listNum.classList.add("playing");
            console.log(`現在播放${j}`);
            chcolor(listNumber);
        };
        listNum.setAttribute("onclick", "clicked(this)");   //??????????
    }
}


//點擊清單播放
function clicked(element) {
    var getLiIndex = element.getAttribute("li-index");
    console.log(getLiIndex);
    musicIndex = getLiIndex;
    console.log(getLiIndex);
    loadMusic(getLiIndex);
    playMusic();
    playingNow();
    loadLyrics(musicIndex);
};

//右側
// 查看播放列表
function listbtn() {
    wrapper.querySelector(".muisic_list").style.display = "block";
    wrapper.querySelector("#list-btn").style.color = "#F9595F";
    wrapper.querySelector(".music_lyrics").style.display = "none";
    wrapper.querySelector("#lyrics-btn").style.color = "#cecaca";
};


// 查看歌詞
function lyricsbtn() {
    wrapper.querySelector(".muisic_list").style.display = "none";
    wrapper.querySelector("#list-btn").style.color = "#cecaca";
    wrapper.querySelector(".music_lyrics").style.display = "block";
    wrapper.querySelector("#lyrics-btn").style.color = "#F9595F";

};



















