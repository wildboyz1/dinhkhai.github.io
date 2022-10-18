const song = document.getElementById("song");
const playBtn = document.querySelector(".player-inner");
const nextBtn = document.querySelector(".play-forward");
const prevBtn = document.querySelector(".play-back");
const durationTime = document.querySelector(".duration");
const remainingTime = document.querySelector(".remaining");
const rangeBar = document.querySelector(".range");
const musicName = document.querySelector(".music-name");
const musicThumbnail = document.querySelector(".music-thumb");
const musicImage = document.querySelector(".music-thumb img");
const playRepeat = document.querySelector(".play-repeat");

let isPlaying = true;
let indexSong = 0;
let isRepeat = false;

const musics = [
  {
    id: 1,
    title: "Trap Queen",
    file: "trap-queen.mp3",
    image:
      "https://play-lh.googleusercontent.com/YxPaSbwThpWlm2XPCdRmwtw_H02uqV-O8OhOwtSHheH3BehgXSBfq8AkmHXt-XYGhyQO",
  },
  {
    id: 2,
    title: "Shape Of You",
    file: "Shape Of You.mp3",
    image:
      "https://play-lh.googleusercontent.com/YxPaSbwThpWlm2XPCdRmwtw_H02uqV-O8OhOwtSHheH3BehgXSBfq8AkmHXt-XYGhyQO",
  },
  
];
let timer;
let repeatCount = 0;
playRepeat.addEventListener("click", function () {
  if (isRepeat) {
    isRepeat = false;
    playRepeat.removeAttribute("style");
  } else {
    isRepeat = true;
    playRepeat.style.color = "#ffb86c";
  }
});
nextBtn.addEventListener("click", function () {
  changeSong(1);
});
prevBtn.addEventListener("click", function () {
  changeSong(-1);
});
song.addEventListener("ended", handleEndedSong);
function handleEndedSong() {
  repeatCount++;
  if (isRepeat && repeatCount === 1) {
    // handle repeat song
    isPlaying = true;
    playPause();
  } else {
    changeSong(1);
  }
}
function changeSong(dir) {
  if (dir === 1) {
    // next song
    indexSong++;
    if (indexSong >= musics.length) {
      indexSong = 0;
    }
    isPlaying = true;
  } else if (dir === -1) {
    // prev song
    indexSong--;
    if (indexSong < 0) {
      indexSong = musics.length - 1;
    }
    isPlaying = true;
  }
  init(indexSong);
  // song.setAttribute("src", `./music/${musics[indexSong].file}`);
  playPause();
}
playBtn.addEventListener("click", playPause);
function playPause() {
  if (isPlaying) {
    musicThumbnail.classList.add("is-playing");
    song.play();
    playBtn.innerHTML = `<ion-icon name="pause-circle"></ion-icon>`;
    isPlaying = false;
    timer = setInterval(displayTimer, 500);
  } else {
    musicThumbnail.classList.remove("is-playing");
    song.pause();
    playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
    isPlaying = true;
    clearInterval(timer);
  }
}
function displayTimer() {
  const { duration, currentTime } = song;
  rangeBar.max = duration;
  rangeBar.value = currentTime;
  remainingTime.textContent = formatTimer(currentTime);
  if (!duration) {
    durationTime.textContent = "00:00";
  } else {
    durationTime.textContent = formatTimer(duration);
  }
}
function formatTimer(number) {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number - minutes * 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}
rangeBar.addEventListener("change", handleChangeBar);
function handleChangeBar() {
  song.currentTime = rangeBar.value;
}
function init(indexSong) {
  song.setAttribute("src", `./music/${musics[indexSong].file}`);
  musicImage.setAttribute("src", musics[indexSong].image);
  musicName.textContent = musics[indexSong].title;
}
displayTimer();
init(indexSong);

(function () {
  var Upload = function () {
      var self = this;
      this.selector = {
          fileInput: document.getElementById('UploadInput'),
          fileInputBtn: document.getElementById('UploadInputBtn'),
          Preview: document.getElementById('Preview'),
          status: document.getElementById('uploadFileStatus'),
          sendBtn: document.getElementById('sendData'),
          infoName: document.getElementById('fileInfomation_name'),
          infoType: document.getElementById('fileInfomation_type'),
          infoSize: document.getElementById('fileInfomation_size')
      };
      this.eData = "";
      this.fileTypes = ['mp3', 'wav'];
      this.maxSize = 30 * 1024 * 1024; // 30MB
      this.uploadUrl = 'https://tutrithuc.com/TestAPI/imageUpload';
      this.onChangeInput = function (e) {
          // Reset file data / image preview
          self.selector.status.innerHTML = '';
          self.selector.Preview.setAttribute('src', "img/default.jpg");
          self.Data='';
          
          // Get the current file upload
          var file = e.target.files[0];
          this.selector.infoName.innerHTML = file.name;
          this.selector.infoType.innerHTML = file.type;
          this.selector.infoSize.innerHTML = file.size + " bytes"; // in bytes

          // Validate file type
          if (this.fileTypes.indexOf(file.type) == -1) {
              self.selector.status.innerHTML = "File không hợp lệ ";
              return;
          }
          
          // Validate file size
          if (file.size > this.maxSize) {
              self.selector.status.innerHTML = "Dung lượng file vượt quá giới hạn (tối đa 30MB được chấp nhận)";
              return;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
              self.Data = e.target.result;
              
              // Validate file content
              self.selector.Preview.onerror = function(){
                  self.Data = "";
                  self.selector.Preview.setAttribute('src', "img/default.jpg");
                  self.selector.status.innerHTML = 'Nội dung không hợp lệ';
              };
              self.selector.Preview.setAttribute('src', self.Data);
          };
          reader.readAsDataURL(file);
      };
      this.sendData = function () {
          // Validate when file content is empty
          if (this.Data == ""){
              self.selector.status.innerHTML = 'Vui lòng bài hát để tải lên';
              return;
          }
          
          // Prevent double click
          var data = {
              'Data': this.Data
          };
          this.Data = "";
          
          var request = new XMLHttpRequest();
          request.open("POST", this.uploadUrl);
          request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          request.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
                  self.selector.status.innerHTML = "Upload thành công";
              } else {
                  console.log(this.responseText);
                  self.selector.status.innerHTML = "Đã có lỗi xảy ra, không upload được ";
              }
          };

          // Send request to server
          request.send(JSON.stringify(data));
      };

      /*
       * Event trigger
       */
      this.selector.fileInput.addEventListener('change', function (e) {
          self.onChangeInput(e);
      });
      this.selector.fileInputBtn.addEventListener('click', function () {
          self.selector.fileInput.click();
      });
      this.selector.sendBtn.addEventListener('click', function () {
          self.sendData();
      });
  };
  window.addEventListener("DOMContentLoaded", function () {
      console.log('DOM is loaded');
      new Upload();
  });
})();