// ============================================
// MUSIC APP - JAVASCRIPT FUNCTIONALITY
// ============================================

// API Configuration
const SPOTIFY_API = 'https://api.spotify.com/v1';
const LAST_FM_API = 'https://ws.audioscrobbler.com/2.0/';
const LAST_FM_KEY = '6526d4f1e8b9a3f1d8c5e2b9a4f7c1e5';

// Mock data for demonstration
const mockSongs = [
    {
        id: 1,
        title: 'Midnight Dreams',
        artist: 'Luna Echo',
        duration: 243,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        id: 2,
        title: 'Electric Vibes',
        artist: 'Neon Lights',
        duration: 267,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        id: 3,
        title: 'Ocean Waves',
        artist: 'Coastal Breeze',
        duration: 289,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        id: 4,
        title: 'Urban Jungle',
        artist: 'City Sounds',
        duration: 256,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
        id: 5,
        title: 'Starlight',
        artist: 'Cosmic Journey',
        duration: 278,
        image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
        id: 6,
        title: 'Summer Nights',
        artist: 'Tropical Vibes',
        duration: 245,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=croph=300https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=cropfit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    }
];

// State Management
const state = {
    currentSong: null,
    isPlaying: false,
    queue: [...mockSongs],
    currentIndex: 0,
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    playlists: JSON.parse(localStorage.getItem('playlists')) || [],
    shuffle: false,
    repeat: 0, // 0: no repeat, 1: repeat all, 2: repeat one
    volume: 70,
    searchResults: []
};

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressInput = document.getElementById('progress-input');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeInput = document.getElementById('volume-input');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const queueBtn = document.getElementById('queue-btn');
const searchInput = document.getElementById('search-input');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerAlbumArt = document.getElementById('player-album-art');
const recommendationsContainer = document.getElementById('recommendations');
const searchResultsContainer = document.getElementById('search-results');
const favoritesContainer = document.getElementById('favorites-list');
const playlistsContainer = document.getElementById('playlists-list');
const queueModal = document.getElementById('queue-modal');
const playlistModal = document.getElementById('playlist-modal');
const queueList = document.getElementById('queue-list');
const navItems = document.querySelectorAll('.nav-item');
const sectionTitle = document.getElementById('section-title');
const sections = document.querySelectorAll('.section');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    setupEventListeners();
    renderRecommendations();
    renderPlaylists();
    setVolume(state.volume);
    loadCurrentSong();
}

function setupEventListeners() {
    // Player Controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    progressInput.addEventListener('input', seekSong);
    volumeInput.addEventListener('input', (e) => setVolume(e.target.value));
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    queueBtn.addEventListener('click', openQueueModal);
    
    // Audio Events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleSongEnd);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });
    
    // Search
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            searchSongs(e.target.value);
        }
    });
    
    // Music Cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.music-card-btn.play')) {
            const card = e.target.closest('.music-card');
            const songId = parseInt(card.dataset.songId);
            playSong(songId);
        }
        if (e.target.closest('.music-card-btn.favorite')) {
            const card = e.target.closest('.music-card');
            const songId = parseInt(card.dataset.songId);
            toggleFavorite(songId);
        }
    });
    
    // Modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });
    
    document.getElementById('create-playlist-btn').addEventListener('click', openPlaylistModal);
    document.getElementById('cancel-playlist-btn').addEventListener('click', () => {
        playlistModal.classList.remove('active');
    });
    document.getElementById('save-playlist-btn').addEventListener('click', createPlaylist);
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ============================================
// PLAYER FUNCTIONS
// ============================================

function playSong(songId) {
    const song = state.queue.find(s => s.id === songId);
    if (!song) return;
    
    state.currentSong = song;
    state.currentIndex = state.queue.findIndex(s => s.id === songId);
    
    audioPlayer.src = song.url;
    audioPlayer.play();
    state.isPlaying = true;
    
    updatePlayerUI();
    updatePlayButton();
    saveSongToHistory();
}

function togglePlay() {
    if (!state.currentSong) {
        playSong(state.queue[0].id);
        return;
    }
    
    if (state.isPlaying) {
        audioPlayer.pause();
        state.isPlaying = false;
    } else {
        audioPlayer.play();
        state.isPlaying = true;
    }
    
    updatePlayButton();
}

function previousSong() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
    } else {
        state.currentIndex = state.queue.length - 1;
    }
    playSong(state.queue[state.currentIndex].id);
}

function nextSong() {
    if (state.shuffle) {
        state.currentIndex = Math.floor(Math.random() * state.queue.length);
    } else {
        if (state.currentIndex < state.queue.length - 1) {
            state.currentIndex++;
        } else {
            state.currentIndex = 0;
        }
    }
    playSong(state.queue[state.currentIndex].id);
}

function handleSongEnd() {
    if (state.repeat === 2) {
        // Repeat one
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        nextSong();
    }
}

function seekSong(e) {
    const percentage = e.target.value;
    audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
}

function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percentage + '%';
        progressInput.value = percentage;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

function updateDuration() {
    durationEl.textContent = formatTime(audioPlayer.duration);
}

function setVolume(value) {
    state.volume = value;
    audioPlayer.volume = value / 100;
    volumeInput.value = value;
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
    shuffleBtn.classList.toggle('active', state.shuffle);
}

function toggleRepeat() {
    state.repeat = (state.repeat + 1) % 3;
    repeatBtn.classList.toggle('active', state.repeat > 0);
    
    if (state.repeat === 2) {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size: 0.7rem; position: absolute; bottom: 2px; right: 2px;">1</span>';
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

function updatePlayerUI() {
    playerTitle.textContent = state.currentSong.title;
    playerArtist.textContent = state.currentSong.artist;
    playerAlbumArt.src = state.currentSong.image;
}

function updatePlayButton() {
    if (state.isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function loadCurrentSong() {
    if (state.queue.length > 0) {
        state.currentSong = state.queue[0];
        updatePlayerUI();
    }
}

function saveSongToHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.unshift({
        ...state.currentSong,
        playedAt: new Date().toISOString()
    });
    localStorage.setItem('history', JSON.stringify(history.slice(0, 50)));
}

// ============================================
// UI RENDERING FUNCTIONS
// ============================================

function renderRecommendations() {
    recommendationsContainer.innerHTML = state.queue.map(song => createMusicCard(song)).join('');
}

function renderSearchResults() {
    if (state.searchResults.length === 0) {
        searchResultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhuma música encontrada</p>';
        return;
    }
    searchResultsContainer.innerHTML = state.searchResults.map(song => createMusicCard(song)).join('');
}

function renderFavorites() {
    if (state.favorites.length === 0) {
        favoritesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Você ainda não tem favoritos</p>';
        return;
    }
    const favoriteSongs = state.queue.filter(song => state.favorites.includes(song.id));
    favoritesContainer.innerHTML = favoriteSongs.map(song => createMusicCard(song)).join('');
}

function renderPlaylists() {
    if (state.playlists.length === 0) {
        playlistsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Crie sua primeira playlist</p>';
        return;
    }
    playlistsContainer.innerHTML = state.playlists.map(playlist => `
        <div class="playlist-card" data-playlist-id="${playlist.id}">
            <div class="playlist-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="playlist-name">${playlist.name}</div>
            <div class="playlist-count">${playlist.songs.length} músicas</div>
        </div>
    `).join('');
}

function createMusicCard(song) {
    const isFavorite = state.favorites.includes(song.id);
    return `
        <div class="music-card" data-song-id="${song.id}">
            <img src="${song.image}" alt="${song.title}" class="music-card-image">
            <h4 class="music-card-title">${song.title}</h4>
            <p class="music-card-artist">${song.artist}</p>
            <div class="music-card-actions">
                <button class="music-card-btn play">
                    <i class="fas fa-play"></i> Tocar
                </button>
                <button class="music-card-btn favorite ${isFavorite ? 'active' : ''}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
}

function updateQueueUI() {
    queueList.innerHTML = state.queue.map((song, index) => `
        <div class="queue-item ${state.currentIndex === index ? 'active' : ''}" data-song-id="${song.id}">
            <span class="queue-item-number">${index + 1}</span>
            <div class="queue-item-info">
                <div class="queue-item-title">${song.title}</div>
                <div class="queue-item-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.queue-item').forEach(item => {
        item.addEventListener('click', () => {
            const songId = parseInt(item.dataset.songId);
            playSong(songId);
        });
    });
}

// ============================================
// SEARCH & FILTER FUNCTIONS
// ============================================

function searchSongs(query) {
    const lowerQuery = query.toLowerCase();
    state.searchResults = state.queue.filter(song =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    );
    renderSearchResults();
}

// ============================================
// FAVORITES FUNCTIONS
// ============================================

function toggleFavorite(songId) {
    const index = state.favorites.indexOf(songId);
    if (index > -1) {
        state.favorites.splice(index, 1);
    } else {
        state.favorites.push(songId);
    }
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    
    // Update UI
    const currentSection = document.querySelector('.section.active').id;
    if (currentSection === 'home-section') {
        renderRecommendations();
    } else if (currentSection === 'search-section') {
        renderSearchResults();
    } else if (currentSection === 'favorites-section') {
        renderFavorites();
    }
}

// ============================================
// PLAYLIST FUNCTIONS
// ============================================

function openPlaylistModal() {
    playlistModal.classList.add('active');
    document.getElementById('playlist-name').value = '';
    document.getElementById('playlist-description').value = '';
}

function createPlaylist() {
    const name = document.getElementById('playlist-name').value.trim();
    const description = document.getElementById('playlist-description').value.trim();
    
    if (!name) {
        alert('Por favor, digite um nome para a playlist');
        return;
    }
    
    const playlist = {
        id: Date.now(),
        name: name,
        description: description,
        songs: [],
        createdAt: new Date().toISOString()
    };
    
    state.playlists.push(playlist);
    localStorage.setItem('playlists', JSON.stringify(state.playlists));
    
    renderPlaylists();
    playlistModal.classList.remove('active');
    
    showNotification(`Playlist "${name}" criada com sucesso!`);
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openQueueModal() {
    queueModal.classList.add('active');
    updateQueueUI();
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function switchSection(section) {
    // Update nav items
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Update sections
    sections.forEach(sec => sec.classList.remove('active'));
    
    const sectionMap = {
        'home': 'home-section',
        'search': 'search-section',
        'favorites': 'favorites-section',
        'playlists': 'playlists-section'
    };
    
    const sectionId = sectionMap[section];
    document.getElementById(sectionId).classList.add('active');
    
    // Update title
    const titleMap = {
        'home': 'Início',
        'search': 'Buscar',
        'favorites': 'Favoritos',
        'playlists': 'Playlists'
    };
    
    sectionTitle.textContent = titleMap[section];
    
    // Render content
    if (section === 'favorites') {
        renderFavorites();
    } else if (section === 'playlists') {
        renderPlaylists();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);
