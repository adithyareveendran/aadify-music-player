
let currentSong = new Audio();


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}


const playMusic = (track , pause=false)=>{
    //let audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
    }
        play.src = "pause.svg"
        document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){ 

    //get the list of songs
    let songs = await getSongs();
    console.log(songs);

    playMusic(songs[0],true);

    //To put all the song list in the library

    let songUL = document.querySelector(".songLists").getElementsByTagName("ul")[0];
    
    
    for (const song of songs) {
       songUL.innerHTML = songUL.innerHTML + `<li> 
       
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div class="songname">
                                ${song.replaceAll("%20" , " ")}
                                </div>
                                <div class="songartist">
                                    song artist
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img src="play.svg" class=""  alt="">
                            </div>

        </li>`;
    }
    
    //Attach an Event listener to each song..
    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    
    
    //Attach an event listener to play previous and next song
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "playsong.svg"

        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration*100) + "%" ;
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener for the hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
        
    })

    //Add event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%" ;
    })
}

main()