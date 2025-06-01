// State Management
let currentPage = 0;
const totalPages = 5;
let musicPlaying = false;

// DOM Elements
const surpriseContainer = document.getElementById('surprise-container');
const flipbookContainer = document.getElementById('flipbook-container');
const giftIcon = document.getElementById('gift-icon');
const flipbook = document.getElementById('flipbook');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageCounter = document.getElementById('page-counter');
const virtualHug = document.getElementById('virtual-hug');
const hugBtn = document.getElementById('hug-btn');
const hugAnimation = document.getElementById('hug-animation');
const birthdayMusic = document.getElementById('birthday-music');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    setupEventListeners();
    
    // Initialize page display
    updatePageDisplay();
    
    // Start background music after user interaction
    setupMusicAutoplay();
});

// Setup all event listeners
function setupEventListeners() {
    // Gift icon click - main surprise trigger
    giftIcon.addEventListener('click', openSurprise);
    
    // Navigation buttons
    prevBtn.addEventListener('click', goToPreviousPage);
    nextBtn.addEventListener('click', goToNextPage);
    
    // Virtual hug button
    hugBtn.addEventListener('click', showVirtualHug);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Click outside hug animation to close
    hugAnimation.addEventListener('click', hideVirtualHug);
    
    // Prevent propagation on hug content
    const hugContent = hugAnimation.querySelector('.hug-content');
    if (hugContent) {
        hugContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Setup music autoplay with user interaction
function setupMusicAutoplay() {
    const startMusic = () => {
        if (!musicPlaying) {
            birthdayMusic.play().catch(error => {
                console.log('Autoplay prevented:', error);
            });
            musicPlaying = true;
        }
    };
    
    // Try to play music on first user interaction
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
}

// Open the surprise flipbook with animation
function openSurprise() {
    // Add clicking animation to gift
    giftIcon.style.transform = 'scale(0.9) rotate(-5deg)';
    
    setTimeout(() => {
        giftIcon.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            // Hide surprise container
            surpriseContainer.classList.add('hidden');
            
            // Show flipbook with animation
            flipbookContainer.classList.remove('hidden');
            
            // Start music if not already playing
            if (!musicPlaying) {
                birthdayMusic.play().catch(error => {
                    console.log('Music play failed:', error);
                });
                musicPlaying = true;
            }
            
            // Initialize first page
            currentPage = 0;
            updatePageDisplay();
            
        }, 200);
    }, 150);
}

// Navigate to previous page
function goToPreviousPage() {
    if (currentPage > 0) {
        console.log('Going to previous page from', currentPage, 'to', currentPage - 1);
        currentPage--;
        updatePageDisplay();
    }
}

// Navigate to next page
function goToNextPage() {
    if (currentPage < totalPages - 1) {
        console.log('Going to next page from', currentPage, 'to', currentPage + 1);
        currentPage++;
        updatePageDisplay();
    }
}

// Animate page flip effect
function animatePageFlip(direction) {
    const pages = document.querySelectorAll('.page');
    const currentPageElement = pages[currentPage];
    
    if (currentPageElement) {
        // Add flipping animation class
        currentPageElement.classList.add('flipping');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            currentPageElement.classList.remove('flipping');
            if (direction === 'next') {
                currentPageElement.classList.add('flipped');
            } else {
                currentPageElement.classList.remove('flipped');
            }
        }, 400);
    }
}

// Update page display and navigation
function updatePageDisplay() {
    const pages = document.querySelectorAll('.page');
    
    // Reset all pages
    pages.forEach((page, index) => {
        page.style.display = 'none';
        page.style.zIndex = 1;
        page.style.transform = 'rotateY(0deg)';
        page.classList.remove('flipping', 'flipped');
    });
    
    // Show current page
    if (pages[currentPage]) {
        pages[currentPage].style.display = 'block';
        pages[currentPage].style.zIndex = 10;
    }
    
    // Update navigation buttons
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
    
    // Update page counter
    pageCounter.textContent = `${currentPage + 1} / ${totalPages}`;
    
    // Show virtual hug button on last page
    if (currentPage === totalPages - 1) {
        virtualHug.classList.remove('hidden');
    } else {
        virtualHug.classList.add('hidden');
    }
    
    // Add entrance animation for new page
    if (pages[currentPage]) {
        pages[currentPage].style.animation = 'fadeIn 0.6s ease-out';
    }
    
    console.log('Current page:', currentPage, 'Total pages:', totalPages);
}

// Handle keyboard navigation
function handleKeyboardNavigation(event) {
    if (flipbookContainer.classList.contains('hidden')) return;
    
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            goToPreviousPage();
            break;
        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            goToNextPage();
            break;
        case 'Home':
            event.preventDefault();
            goToPage(0);
            break;
        case 'End':
            event.preventDefault();
            goToPage(totalPages - 1);
            break;
        case 'Escape':
            if (!hugAnimation.classList.contains('hidden')) {
                hideVirtualHug();
            }
            break;
        case 'Enter':
        case ' ':
            if (currentPage === totalPages - 1) {
                event.preventDefault();
                showVirtualHug();
            }
            break;
    }
}

// Go to specific page
function goToPage(pageNumber) {
    if (pageNumber >= 0 && pageNumber < totalPages && pageNumber !== currentPage) {
        const direction = pageNumber > currentPage ? 'next' : 'prev';
        currentPage = pageNumber;
        animatePageFlip(direction);
        updatePageDisplay();
    }
}

// Show virtual hug animation
function showVirtualHug() {
    hugAnimation.classList.remove('hidden');
    
    // Add entrance animation
    const hugContent = hugAnimation.querySelector('.hug-content');
    if (hugContent) {
        hugContent.style.animation = 'hugFadeIn 0.5s ease-out';
    }
    
    // Play hug sound effect
    playHugEffect();
    
    // Trigger bear animation
    const bearAnimation = hugAnimation.querySelector('.bear-animation');
    if (bearAnimation) {
        bearAnimation.style.animation = 'hugBear 2s ease-in-out infinite';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (!hugAnimation.classList.contains('hidden')) {
            hideVirtualHug();
        }
    }, 5000);
}

// Hide virtual hug animation
function hideVirtualHug() {
    hugAnimation.classList.add('hidden');
}

// Play hug sound effect
function playHugEffect() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Audio context not supported:', error);
    }
}

// Add smooth page transition effects
function addPageTransitionEffects() {
    const pages = document.querySelectorAll('.page');
    
    pages.forEach((page, index) => {
        // Add hover effects for interactive elements
        const photos = page.querySelectorAll('.photo-placeholder');
        photos.forEach(photo => {
            photo.addEventListener('mouseenter', () => {
                photo.style.transform = 'scale(1.02)';
                photo.style.transition = 'transform 0.3s ease';
            });
            
            photo.addEventListener('mouseleave', () => {
                photo.style.transform = 'scale(1)';
            });
        });
        
        // Add click effect to photos
        photos.forEach(photo => {
            photo.addEventListener('click', () => {
                photo.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    photo.style.animation = '';
                }, 600);
            });
        });
    });
}

// Enhanced gift box animation
function enhanceGiftAnimation() {
    const giftBox = document.querySelector('.gift-box');
    const ribbonV = document.querySelector('.gift-ribbon-v');
    const ribbonH = document.querySelector('.gift-ribbon-h');
    
    if (giftBox && ribbonV && ribbonH) {
        giftIcon.addEventListener('mouseenter', () => {
            giftBox.style.animation = 'bounce 0.6s ease-in-out';
            ribbonV.style.animation = 'shimmer 1s ease-in-out infinite';
            ribbonH.style.animation = 'shimmer 1s ease-in-out infinite 0.2s';
        });
        
        giftIcon.addEventListener('mouseleave', () => {
            giftBox.style.animation = '';
            ribbonV.style.animation = '';
            ribbonH.style.animation = '';
        });
    }
}

// Add dynamic heart animations
function addDynamicHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    
    // Create additional hearts on page interactions
    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.className = 'floating-heart';
        heart.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
        `;
        
        // Add CSS animation for floating up
        if (!document.querySelector('#floating-heart-style')) {
            const style = document.createElement('style');
            style.id = 'floating-heart-style';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px) scale(1.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
    
    // Add hearts on navigation clicks
    nextBtn.addEventListener('click', (e) => {
        const rect = nextBtn.getBoundingClientRect();
        createFloatingHeart(rect.left + rect.width / 2, rect.top);
    });
    
    prevBtn.addEventListener('click', (e) => {
        const rect = prevBtn.getBoundingClientRect();
        createFloatingHeart(rect.left + rect.width / 2, rect.top);
    });
}

// Music control functions
function toggleMusic() {
    if (birthdayMusic.paused) {
        birthdayMusic.play().catch(error => {
            console.log('Music play failed:', error);
        });
        musicPlaying = true;
    } else {
        birthdayMusic.pause();
        musicPlaying = false;
    }
}

// Add music control button (optional)
function addMusicControl() {
    const musicBtn = document.createElement('button');
    musicBtn.innerHTML = '🎵';
    musicBtn.className = 'music-control';
    musicBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1003;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    musicBtn.addEventListener('click', toggleMusic);
    musicBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
        this.style.transform = 'scale(1.1)';
    });
    musicBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(musicBtn);
}

// Initialize all enhancements
function initializeEnhancements() {
    addPageTransitionEffects();
    enhanceGiftAnimation();
    addDynamicHearts();
    addMusicControl();
}

// Auto-advance demo (optional - can be enabled for presentation)
function startAutoAdvance(interval = 3000) {
    let autoAdvanceInterval;
    
    function autoAdvance() {
        if (currentPage < totalPages - 1) {
            goToNextPage();
        } else {
            clearInterval(autoAdvanceInterval);
        }
    }
    
    // Start auto-advance after first manual interaction
    let hasInteracted = false;
    
    const checkInteraction = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            setTimeout(() => {
                autoAdvanceInterval = setInterval(autoAdvance, interval);
            }, interval);
        }
    };
    
    prevBtn.addEventListener('click', checkInteraction);
    nextBtn.addEventListener('click', checkInteraction);
    document.addEventListener('keydown', checkInteraction);
}

// Performance optimization
function optimizePerformance() {
    // Lazy load animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all pages
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page);
    });
}

// Error handling and fallbacks
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('Error caught:', e.error);
        // Fallback behavior - ensure basic functionality works
        if (surpriseContainer && !surpriseContainer.classList.contains('hidden')) {
            // If there's an error during surprise opening, show flipbook anyway
            setTimeout(() => {
                surpriseContainer.classList.add('hidden');
                flipbookContainer.classList.remove('hidden');
            }, 1000);
        }
    });
    
    // Handle audio errors gracefully
    birthdayMusic.addEventListener('error', () => {
        console.log('Audio failed to load, continuing without music');
        musicPlaying = false;
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupErrorHandling();
    initializeEnhancements();
    optimizePerformance();
    
    // Optional: Uncomment to enable auto-advance demo
    // startAutoAdvance(4000);
});

// Export functions for external use (if needed)
window.FlipbookControls = {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    showVirtualHug,
    toggleMusic,
    openSurprise
};