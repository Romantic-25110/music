const audio = document.querySelector('audio');
const cover = document.querySelector('.cover img');
const playerInfo = document.querySelector('.player-info');
const songName = document.querySelector('.player-info .name');
const singerAlbum = document.querySelector('.player-info .singer-album');
const currentTimeSpan = document.querySelector('.current-time');
const totalTimeSpan = document.querySelector('.time, .total-time');
const progressBar = document.querySelector('.music_progress_bar');
const progressLine = document.querySelector('.music_progress_line');
const prevBtn = document.querySelector('.control img:nth-child(1)');
const playBtn = document.querySelector('.control img:nth-child(2)');
const nextBtn = document.querySelector('.control img:nth-child(3)');
const listBtn = document.querySelector('.control img:nth-child(4)');
const maskBg = document.querySelector('.mask_bg');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const musicList = document.querySelector('.music-list');
const card = document.querySelector('.player-warp .player-info')
const card2 = document.querySelector('.player-info')
let musicData = [];
let currentIndex = 0;
let isPlaying = false;

// 加载音乐数据
async function loadMusicData() {

    const response = await fetch('music.json');
    musicData = await response.json();
    renderMusicList();
    loadMusic(currentIndex);
}

// 渲染播放列表
function renderMusicList() {
    if (!musicList) return;
    musicList.innerHTML = '';
    musicData.forEach((music, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${idx + 1}. ${music.name} - ${music.singer}</span>
            <span class="fa fa-play-circle play-circle">
                <img class="play" src="./music/暂停.png" alt="">
            </span>`;
        li.querySelector('.play-circle').onclick = () => {
            loadMusic(idx);
            playMusic();
        };
        musicList.appendChild(li);
    });
}

// 加载音乐
function loadMusic(index) {
    const music = musicData[index];
    if (!music) return;
    audio.src = music.audio_url;
    cover.src = music.avatar;
    maskBg.style.backgroundImage = `url(${music.cover})`;
    songName.textContent = music.name;
    singerAlbum.textContent = `${music.singer} - ${music.album}`;
    currentIndex = index;
    // 尝试自动播放
    setTimeout(() => {
        if (isPlaying) playMusic();
        else pauseMusic();
    }, 100);
}

// 播放
function playMusic() {
    audio.play();
    isPlaying = true;
    playBtn.src = './music/播放.png';
    document.querySelector('.cover').style.animationPlayState = 'running';
    card.style.top = '-86px';
}
// 暂停
function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playBtn.src = './music/暂停.png';
    document.querySelector('.cover').style.animationPlayState = 'paused';
    card.style.top = '0px';
}

// 上一首
prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + musicData.length) % musicData.length;
    loadMusic(currentIndex);
    playMusic();
};
// 下一首
nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % musicData.length;
    loadMusic(currentIndex);
    playMusic();
};
// 播放/暂停
playBtn.onclick = () => {
    if (isPlaying) pauseMusic();
    else playMusic();
};
// 列表按钮
if (listBtn && modal) {
    listBtn.onclick = () => { modal.style.display = 'block'; };
}
if (modalClose && modal) {
    modalClose.onclick = () => { modal.style.display = 'none'; };
}

// 进度条
if (audio) {
    audio.ontimeupdate = () => {
        if (!audio.duration) return;
        const percent = audio.currentTime / audio.duration * 100;
        progressLine.style.width = percent + '%';
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    };
    audio.onloadedmetadata = () => {
        if (totalTimeSpan) totalTimeSpan.textContent = formatTime(audio.duration);
    };
    audio.onended = () => {
        currentIndex = (currentIndex + 1) % musicData.length;
        loadMusic(currentIndex);
        playMusic();
    };
}
if (progressBar) {
    progressBar.onclick = (e) => {
        const percent = e.offsetX / progressBar.offsetWidth;
        audio.currentTime = percent * audio.duration;
    };
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 初始化
loadMusicData();
