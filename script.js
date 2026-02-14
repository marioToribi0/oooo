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
    { "image": "2.png", "text": "Tu sonrisa ilumina mis días." },
    { "image": "3.png", "text": "Junto a Molly, hacemos el mejor equipo." },
    { "image": "4.png", "text": "Eres mi persona favorita en el mundo." },
    { "image": "5.png", "text": "Gracias por tanto amor." },
    { "image": "6.png", "text": "San Valentín es mejor a tu lado." },
    { "image": "7.png", "text": "No cambiaría nada de nosotros." },
    { "image": "8.png", "text": "Eres magia pura, Caroline." },
    { "image": "9.png", "text": "Contigo todo es más bonito." },
    { "image": "10.png", "text": "Mi compañera de aventuras." },
    { "image": "11.png", "text": "Te amo más de lo que las palabras pueden decir." },
    { "image": "12.png", "text": "Por muchos más momentos así." },
    { "image": "13.png", "text": "Simplemente, tú." },
    { "image": "14.png", "text": "Feliz Día de San Valentín, mi amor." }
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
    loadGallery();
    bgMusic.play().catch(e => console.log("User interaction needed for audio"));
}
