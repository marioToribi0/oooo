console.log("San Valentín para Caroline ❤️");

// Elements
const landing = document.getElementById('landing');
const lockScreen = document.getElementById('lock-screen');
const mainExperience = document.getElementById('main-experience');
const startBtn = document.getElementById('start-btn');
const unlockBtn = document.getElementById('unlock-btn');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const hintMsg = document.getElementById('hint-msg');
const attemptsMsg = document.getElementById('attempts-msg');
const chestImg = document.getElementById('chest-img');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

// State
let musicPlaying = false;
let attempts = 5;
const TARGET_DATE = "2024-05-17";

// Event Listeners
startBtn.addEventListener('click', () => {
    // Start Music
    bgMusic.play().then(() => {
        musicPlaying = true;
    }).catch(e => console.log("Audio play failed initially", e));

    // Transition to Lock Screen
    gsap.to(landing, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            landing.classList.add('hidden');
            lockScreen.classList.remove('hidden');
            gsap.fromTo(lockScreen, { opacity: 0 }, { opacity: 1, duration: 1 });
            gsap.fromTo('.chest-container', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "bounce.out" });
        }
    });
});

unlockBtn.addEventListener('click', checkDate);

function checkDate() {
    const day = dayInput.value.padStart(2, '0');
    const month = monthInput.value.padStart(2, '0');
    const year = yearInput.value;

    if (!day || !month || !year) return;

    const inputDate = `${year}-${month}-${day}`;

    if (inputDate === TARGET_DATE) {
        unlockChest();
    } else {
        handleWrongDate(inputDate);
    }
}

function handleWrongDate(inputDate) {
    attempts--;
    attemptsMsg.textContent = `Intentos restantes: ${attempts}`;

    // Shake animation
    const chestContainer = document.querySelector('.chest-container');
    chestContainer.classList.add('shake');
    setTimeout(() => chestContainer.classList.remove('shake'), 500);

    // Hints
    const target = new Date(TARGET_DATE);
    const input = new Date(inputDate);
    const diffTime = Math.abs(target - input);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (attempts <= 0) {
        hintMsg.textContent = "La fecha es en Mayo... ❤️";
        hintMsg.style.color = "#d63384";
        attempts = 1; // Give infinite tries effectively now, or reset
        attemptsMsg.textContent = "¡Inténtalo de nuevo!";
        return;
    }

    if (input < target) {
        hintMsg.textContent = "Es después de esa fecha...";
    } else {
        hintMsg.textContent = "Es antes de esa fecha...";
    }

    if (diffDays < 30) {
        hintMsg.textContent += " ¡Estás muy cerca!";
    } else if (diffDays < 7) {
        hintMsg.textContent += " ¡ARDIENDO! 🔥";
    }
}

function unlockChest() {
    hintMsg.textContent = "¡Correcto! ❤️";
    hintMsg.style.color = "#d63384";
    attemptsMsg.style.display = 'none';
    unlockBtn.style.display = 'none';
    document.querySelector('.date-inputs').style.display = 'none';

    // Open Chest Animation
    chestImg.src = "images/chest_open.png";

    gsap.to(chestImg, {
        scale: 1.2,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
            // Change music to One Republic
            bgMusic.pause();
            bgMusic.src = "future_looks_good.mp3";
            bgMusic.load();
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.textContent = "🎵";
            }).catch(e => console.log("Audio switch failed", e));

            // Explode hearts or light?
            createHearts(); // Start heart rain early

            // Wait and then go to gallery
            setTimeout(() => {
                gsap.to(lockScreen, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        lockScreen.classList.add('hidden');
                        mainExperience.classList.remove('hidden');
                        gsap.fromTo(mainExperience, { opacity: 0 }, { opacity: 1, duration: 1 });

                        // Initialize Gallery
                        loadGallery();
                    }
                });
            }, 2000);
        }
    });

}

musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = "🔇";
    } else {
        bgMusic.play();
        musicToggle.textContent = "🎵";
    }
    musicPlaying = !musicPlaying;
});

const phrases = [
    { "image": "1.png", "text": "Cada momento contigo es un regalo..." },
    { "image": "IMG_20241012_140700.jpg", "text": "Me encanta coleccionar momentos a tu lado." },
    { "image": "2.png", "text": "Los momentos que paso contigo me hacen muy feliz." },
    { "image": "IMG_20241208_141836.jpg", "text": "Tu sonrisa es lo más bonito que tengo." },
    { "image": "4.png", "text": "Eres mi persona favorita en el mundo." },
    { "image": "PXL_20250727_203348418.jpg", "text": "Eres el regalo más lindo que Dios me dio." },
    { "image": "5.png", "text": "Gracias por tanto amor." },
    { "image": "PXL_20250830_231047463.jpg", "text": "Ojalá todos mis días fueran contigo." },
    { "image": "6.png", "text": "No cambiaría nada de nosotros." },
    { "image": "IMG_20241221_121333.jpg", "text": "Cada día te quiero muchoo más." },
    { "image": "7.png", "text": "Cuando me caigo se que puedo confiar en ti." },
    { "image": "PXL_20250927_224123468.jpg", "text": "Aventuras, risas y mucho amor juntos." },
    { "image": "8.png", "text": "Cuando no sé que hacer me das la respuesta." },
    { "image": "PXL_20250928_002300433.NIGHT~2.jpg", "text": "Contigo hasta la noche más oscura brilla." },
    { "image": "14.png", "text": "Con Molly todo es más lindo." },
    { "image": "PXL_20251019_201713495.PORTRAIT.jpg", "text": "Simplemente perfecta para mí." },
    { "image": "9.png", "text": "Te quiero mucho, nunca lo olvides." },
    { "image": "IMG_20241231_210154.jpg", "text": "Empezar y terminar el año contigo es mi deseo." },
    { "image": "10.png", "text": "Espero seguir contigo muchoos dias mas." },
    { "image": "PXL_20251225_165718771.jpg", "text": "Celebrar la vida contigo es mi bendición." },
    { "image": "11.png", "text": "Le doy gracias a Dios haberte tenido en mi vida." },
    { "image": "12.png", "text": "Por muchos más momentos así." },
    { "image": "13.png", "text": "Gracias, por hacerme tan feliz." },
    { "image": "3.png", "text": "Feliz Día de San Valentín, mi amor." }
];

function loadGallery() {
    console.log("Loading gallery...");
    const container = document.querySelector('.gallery-container');
    container.innerHTML = '';

    // Reverse data for stacking order
    const reversedData = [...phrases].reverse();

    reversedData.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('photo-card');

        const rotation = (Math.random() * 10) - 5;
        gsap.set(card, { rotation: rotation });

        card.innerHTML = `
            <div class="img-container" style="width:100%; height:250px; overflow:hidden;">
                    <img src="images/${item.image}" alt="Moment" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <p>${item.text}</p>
        `;

        card.addEventListener('click', () => {
            throwCard(card);
        });

        container.appendChild(card);
    });

    // Proposal Logic Setup moved to end of flow

    // Start Lyrics Sync immediately when gallery loads
    syncLyrics();
}

function throwCard(card) {
    // Random direction throw
    const xDest = (Math.random() * 500) - 250; // -250 to 250
    const yDest = -500; // Fly up and away
    const rotationDest = (Math.random() * 90) - 45;

    gsap.to(card, {
        x: xDest,
        y: yDest,
        rotation: rotationDest,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
            card.remove(); // Remove from DOM after animation

            // Check if we revealed everything
            const remainingCards = document.querySelectorAll('.photo-card');
            if (remainingCards.length === 0) {
                showFinalVideo();
            }
        }
    });
}

function showFinalVideo() {
    const videoScreen = document.getElementById('final-video-screen');
    const video = document.getElementById('final-video');

    videoScreen.classList.remove('hidden');
    gsap.fromTo(videoScreen, { opacity: 0 }, { opacity: 1, duration: 1 });

    // Mute background music if it's playing so we can hear the video
    if (bgMusic.paused === false) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicPlaying = false;
    }

    // Try to autoplay video
    video.play().catch(e => console.log("Video autoplay failed", e));

    // Hide Lyrics
    const lyricsContainer = document.getElementById('lyrics-container');
    gsap.to(lyricsContainer, { opacity: 0, duration: 0.5 });
}

const lrcContent = `
[00:15.66]Woke up staring at this, staring at this empty room
[00:23.51]Looked at, a thousand different pictures that your mother took of you
[00:30.31]You see, I had this crazy dream last night, this man he talked to me
[00:38.25]He told me everything that’s good and bad about my history
[00:45.39]
[00:45.39]And he said that you are, you are the future
[00:53.47]He said that you are, you are the future
[01:00.53]And the future looks good
[01:08.65]The future looks good
[01:10.56]
[01:16.49]Oh, call me anytime and every time you’re losing it
[01:24.83]And tell me anyone and everyone that makes you feel like ****
[01:32.38]Because you know anybody, everybody else can lie
[01:39.03]But honey, I won’t see you with a, see you with a broken set of eyes
[01:47.65]
[01:47.65]And I swear that you are, you are the future
[01:55.02]I said that you are, you are the future
[02:02.66]And the future looks good (Oh yeah)
[02:09.36]The future looks good (Oh yeah)
[02:16.73]
[02:33.45]The future looks good (Oh yeah)
[02:41.39]The future looks good (Oh yeah)
[02:47.79]
[02:47.79]Ooh
[02:52.04]Ooh
[02:53.83]Ooh
[02:57.81]Ooh
[02:59.71]Ooh
[03:01.63]Ooh
[03:03.83]
[03:05.83]Woke up staring at this, staring at this empty room
[03:13.47]Looked at a thousand different pictures that your mother took of you
[03:21.53]
`;

// Parse LRC
const lyricsData = lrcContent.split('\n').filter(line => line.trim() !== '').map(line => {
    const timeRegex = /\[(\d{2}):(\d{2}\.\d{2})\]/;
    const match = line.match(timeRegex);
    if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        const text = line.replace(timeRegex, '').trim();
        return { time, text };
    }
    return null;
}).filter(item => item !== null);

function syncLyrics() {
    const lyricsContainer = document.getElementById('lyrics-container');
    const audio = document.getElementById('bg-music');

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const delay = 0; // 5 seconds delay
        const adjustedTime = Math.max(0, currentTime - delay);

        // Find current line
        const currentLine = lyricsData.find((line, index) => {
            const nextLine = lyricsData[index + 1];
            return adjustedTime >= line.time && (!nextLine || adjustedTime < nextLine.time);
        });

        if (currentLine) {
            if (lyricsContainer.textContent !== currentLine.text) {
                // Exit current text
                gsap.to(lyricsContainer, {
                    opacity: 0,
                    y: -20,
                    filter: "blur(10px)",
                    duration: 0.5,
                    onComplete: () => {
                        lyricsContainer.textContent = currentLine.text;
                        // Animate in new text
                        gsap.fromTo(lyricsContainer,
                            { opacity: 0, y: 20, filter: "blur(10px)" },
                            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
                        );
                    }
                });
            }
        } else {
            // If no current line (instrumental or silence), fade out
            if (lyricsContainer.style.opacity == 1) {
                gsap.to(lyricsContainer, { opacity: 0, duration: 0.5 });
            }
        }
    });
}



function createHearts() {
    const heartContainer = document.createElement('div');
    heartContainer.style.position = 'absolute';
    heartContainer.style.top = '0';
    heartContainer.style.left = '0';
    heartContainer.style.width = '100%';
    heartContainer.style.height = '100%';
    heartContainer.style.pointerEvents = 'none';
    heartContainer.style.zIndex = '0';
    heartContainer.style.overflow = 'hidden';
    document.body.appendChild(heartContainer);

    // Create hearts periodically
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';

        heartContainer.appendChild(heart);

        // Animate with GSAP falling down
        gsap.to(heart, {
            y: '100vh',
            rotation: 360,
            duration: Math.random() * 3 + 4,
            ease: "none",
            onComplete: () => heart.remove()
        });
    }, 300);
}

// Debug Mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('debug') && urlParams.get('debug') === 'video') {
    console.log("Debug mode: Skipping to Final Video");
    landing.classList.add('hidden');
    lockScreen.classList.add('hidden');
    mainExperience.classList.add('hidden');
    showFinalVideo();
}
if (urlParams.has('debug') && urlParams.get('debug') === 'gallery') {
    console.log("Debug mode: Skipping to Gallery");
    landing.classList.add('hidden');
    lockScreen.classList.add('hidden');
    mainExperience.classList.remove('hidden');

    // Switch to correct music for gallery
    bgMusic.src = "future_looks_good.mp3";
    bgMusic.load();

    loadGallery();

    // Attempt play (might need interaction)
    bgMusic.play().then(() => {
        musicPlaying = true;
        musicToggle.textContent = '🎵';
    }).catch(e => {
        console.log("User interaction needed for audio", e);
        // Optional: Add a visible button to force start if needed
    });
}
