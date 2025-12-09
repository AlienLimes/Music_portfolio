const audioFiles = {
     ad1: {
        url:'audio/SETArenaVO.mp3',
        duration: '0:32'
    },

    ad2: {
        url: 'audio/Bounce_6.wav',      
        duration: '0:30'
    },
 
    ad3: {
        url: 'audio/FINAL_MASTER.mp3',
        duration: '0:42'
    },
    mashup: {
        url: 'audio/MASHUP_FINAL.mp3',
        duration: '1:00'
    }
};


const headerAudio = new Audio('audio/techgadgets-ad.mp3'); 
      
        const audioElements = {};
        let currentPlaying = null;

      
        Object.keys(audioFiles).forEach(audioId => {
            const audio = new Audio(audioFiles[audioId].url);
            audio.preload = 'metadata';
            audioElements[audioId] = audio;
          
            document.getElementById(`duration-${audioId}`).textContent = audioFiles[audioId].duration;
        });

    
    
        headerAudio.preload = 'metadata';
        headerAudio.volume = 0.5;

        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', function() {
                const audioId = this.getAttribute('data-audio') || 'header';
                const audio = audioId === 'header' ? headerAudio : audioElements[audioId];
                const progressBar = document.getElementById(`progress-${audioId}`);
                const currentTimeEl = document.getElementById(`current-${audioId}`);
                const playIcon = this.querySelector('i');
                
             
                if (currentPlaying && currentPlaying !== audio) {
                    currentPlaying.pause();
                    const currentButton = document.querySelector(`.play-btn[data-audio="${currentPlaying.id}"]`);
                    if (currentButton) {
                        currentButton.querySelector('i').className = 'fas fa-play';
                    }
                }
                
               
                if (audio.paused) {
                    audio.play();
                    playIcon.className = 'fas fa-pause';
                    currentPlaying = audio;
                    
                 
                    audio.ontimeupdate = function() {
                        const progressPercent = (audio.currentTime / audio.duration) * 100;
                        if (progressBar) progressBar.style.width = `${progressPercent}%`;
                        
                     
                        const mins = Math.floor(audio.currentTime / 60);
                        const secs = Math.floor(audio.currentTime % 60);
                        if (currentTimeEl) currentTimeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                    };
                    
                   
                    audio.onended = function() {
                        playIcon.className = 'fas fa-play';
                        if (progressBar) progressBar.style.width = '0%';
                        if (currentTimeEl) currentTimeEl.textContent = '0:00';
                        currentPlaying = null;
                    };
                } else {
                    audio.pause();
                    playIcon.className = 'fas fa-play';
                    currentPlaying = null;
                }
            });
        });

        
        document.querySelectorAll('.progress-container').forEach(container => {
            container.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                
                let audioId = null;
                if (this.parentElement.classList.contains('audio-controls')) {
                    const button = this.parentElement.querySelector('.play-btn');
                    audioId = button.getAttribute('data-audio');
                } else if (this.id === 'header-progress') {
                    audioId = 'header';
                }
                
                if (audioId) {
                    const audio = audioId === 'header' ? headerAudio : audioElements[audioId];
                    const newTime = clickPosition * audio.duration;
                    
                    if (!isNaN(newTime)) {
                        audio.currentTime = newTime;
                        
                      
                        if (audio.paused && audioId !== 'header') {
                            const playButton = document.querySelector(`.play-btn[data-audio="${audioId}"]`);
                            if (playButton) {
                                playButton.click();
                            }
                        }
                    }
                }
            });
        });

      
        document.getElementById('header-play').addEventListener('click', function() {
            const playIcon = this.querySelector('i');
            
            if (headerAudio.paused) {
                headerAudio.play();
                playIcon.className = 'fas fa-pause';
                
                headerAudio.ontimeupdate = function() {
                    const progressPercent = (headerAudio.currentTime / headerAudio.duration) * 100;
                    document.getElementById('header-progress').style.width = `${progressPercent}%`;
                };
                
                headerAudio.onended = function() {
                    playIcon.className = 'fas fa-play';
                    document.getElementById('header-progress').style.width = '0%';
                };
            } else {
                headerAudio.pause();
                playIcon.className = 'fas fa-play';
            }
        });