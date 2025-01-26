// Emoji data with labels
const emojis = [
    { symbol: "😍", label: "In Love" },
    { symbol: "🥳", label: "Party Time" },
    { symbol: "😎", label: "Feeling Cool" },
    { symbol: "😢", label: "Sad Vibes" },
    { symbol: "😂", label: "LOL Mood" },
    { symbol: "🤬", label: "Angry AF" },
    { symbol: "❤️", label: "Pure Love" },
    { symbol: "🔥", label: "Fire Track" },
    { symbol: "💃", label: "Dance Mood" }
];

// DOM Elements
const youtubeInput = document.getElementById('youtube-link');
const previewBtn = document.getElementById('preview-btn');
const videoPreview = document.getElementById('video-preview');
const message = document.getElementById('message');
const emojiGrid = document.querySelector('.emoji-grid');

// Initialize emoji grid
function initializeEmojiGrid() {
    emojiGrid.innerHTML = emojis.map(emoji => `
        <div class="emoji-container">
            <button class="emoji-btn" data-emoji="${emoji.symbol}">${emoji.symbol}</button>
            <div class="emoji-label">${emoji.label}</div>
        </div>
    `).join('');
}

// YouTube URL parsing regex
const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

// State
let selectedEmoji = null;
let currentVideoId = null;

// Functions
function extractVideoId(url) {
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
}

function updateVideoPreview(videoId) {
    if (!videoId) {
        videoPreview.innerHTML = '<p class="error">Invalid YouTube URL</p>';
        return;
    }

    currentVideoId = videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    videoPreview.innerHTML = `
        <iframe
            src="${embedUrl}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
}

function handleEmojiSelection(emoji, button) {
    // Remove selection from previously selected emoji container
    document.querySelector('.emoji-container.selected')?.classList.remove('selected');
    
    // Find the container of the clicked button
    const container = button.closest('.emoji-container');
    
    // Update selection
    selectedEmoji = emoji;
    container.classList.add('selected');
    
    // Show message
    message.textContent = `You chose ${emoji}!`;
    message.style.opacity = 1;

    // Fade out message after 2 seconds
    setTimeout(() => {
        message.style.opacity = 0;
    }, 2000);
}

// Event Listeners
previewBtn.addEventListener('click', () => {
    const url = youtubeInput.value.trim();
    const videoId = extractVideoId(url);
    updateVideoPreview(videoId);
});

youtubeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const url = youtubeInput.value.trim();
        const videoId = extractVideoId(url);
        updateVideoPreview(videoId);
    }
});

// Initialize emoji grid and set up event listeners
initializeEmojiGrid();

// Add click event listeners to emoji buttons
document.querySelectorAll('.emoji-btn').forEach(button => {
    button.addEventListener('click', () => {
        const emoji = button.getAttribute('data-emoji');
        handleEmojiSelection(emoji, button);
    });
});

// Add input validation visual feedback
youtubeInput.addEventListener('input', () => {
    const url = youtubeInput.value.trim();
    const isValid = youtubeRegex.test(url);
    youtubeInput.style.borderColor = isValid ? 'var(--primary-color)' : '#ff3333';
});
