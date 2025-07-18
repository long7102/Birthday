// DOM elements
const loveLetter = document.getElementById('loveLetter');
const letterContent = document.getElementById('letterContent');
const musicControl = document.getElementById('musicControl');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicIcon = document.querySelector('.music-icon');
const musicText = document.querySelector('.music-text');

// State
let isLetterOpened = false;
let isMusicPlaying = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll reveal
    initScrollReveal();
    
    // Add event listeners
    loveLetter.addEventListener('click', toggleLetter);
    musicControl.addEventListener('click', toggleMusic);
    
    // Add scroll listener for scroll reveal
    window.addEventListener('scroll', handleScrollReveal);
    
    // Trigger initial scroll reveal check
    handleScrollReveal();
});

// Letter functionality
function toggleLetter() {
    isLetterOpened = !isLetterOpened;
    
    if (isLetterOpened) {
        loveLetter.classList.add('opened');
        // Add a gentle vibration effect if supported
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    } else {
        loveLetter.classList.remove('opened');
    }
}

// Music functionality
function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Phát nhạc';
        isMusicPlaying = false;
    } else {
        // Try to play music
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicIcon.textContent = '🔇';
                    musicText.textContent = 'Tắt nhạc';
                    isMusicPlaying = true;
                })
                .catch(error => {
                    console.log('Không thể phát nhạc tự động:', error);
                    // Fallback: show message to user
                    alert('Vui lòng nhấn vào nút nhạc để phát nhạc nền!');
                });
        }
    }
}

// Scroll reveal functionality
function initScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    // Add initial delay for staggered animation
    scrollElements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.2}s`;
    });
}

function handleScrollReveal() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    // Create trailing hearts effect on mouse move (subtle)
    if (Math.random() > 0.98) {
        createTrailingHeart(e.clientX, e.clientY);
    }
});

function createTrailingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '12px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.opacity = '0.7';
    heart.style.transition = 'all 2s ease-out';
    
    document.body.appendChild(heart);
    
    // Animate the heart
    setTimeout(() => {
        heart.style.transform = 'translateY(-50px) scale(0)';
        heart.style.opacity = '0';
    }, 100);
    
    // Remove the heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 2100);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'L' to toggle letter
    if (e.key.toLowerCase() === 'l') {
        toggleLetter();
    }
    
    // Press 'M' to toggle music
    if (e.key.toLowerCase() === 'm') {
        toggleMusic();
    }
    
    // Press 'Space' to toggle music
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        toggleMusic();
    }
});

// Add special birthday effects
function createBirthdayEffect() {
    const colors = ['#ff69b4', '#ffc0cb', '#ffb6c1', '#ff1493', '#dc143c'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Trigger birthday effect when letter is opened for the first time
let birthdayEffectTriggered = false;
loveLetter.addEventListener('click', function() {
    if (!birthdayEffectTriggered && isLetterOpened) {
        setTimeout(createBirthdayEffect, 1000);
        birthdayEffectTriggered = true;
    }
});

// Add touch support for mobile
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e) {
    // Prevent bounce effect on iOS
    if (e.touches[0].clientY > touchStartY) {
        e.preventDefault();
    }
}, { passive: false });

// Performance optimization: throttle scroll events
let ticking = false;
function throttledScrollReveal() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleScrollReveal();
            ticking = false;
        });
        ticking = true;
    }
}

window.removeEventListener('scroll', handleScrollReveal);
window.addEventListener('scroll', throttledScrollReveal);