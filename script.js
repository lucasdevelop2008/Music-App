// ============================================
// MUSIC APP - JAVASCRIPT FUNCTIONALITY
// ============================================

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
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    }
];

// State Management
const state = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    currentSong: null,
    isPlaying: false,
    queue: [...mockSongs],
    currentIndex: 0,
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    playlists: JSON.parse(localStorage.getItem('playlists')) || [],
    shuffle: false,
    repeat: 0,
    volume: 70,
    searchResults: [],
    selectedSongForPlaylist: null,
    playerExpanded: false
};

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTabs = document.querySelectorAll('.login-tab');
const audioPlayer = document.getElementById('audio-player');

// Player Mini Elements
const playerMini = document.getElementById('player-mini');
const playerMiniLeft = document.querySelector('.player-mini-left');
const playBtnMini = document.getElementById('play-btn-mini');
const playerMiniTitle = document.getElementById('player-mini-title');
const playerMiniArtist = document.getElementById('player-mini-artist');
const playerMiniArt = document.getElementById('player-mini-art');
const progressBarMini = document.getElementById('progress-bar-mini');
const queueBtnMini = document.getElementById('queue-btn-mini');

// Player Expanded Elements
const playerExpanded = document.getElementById('player-expanded');
const playerOverlay = document.getElementById('player-overlay');
const closePlayerBtn = document.getElementById('close-player-btn');
const playBtnExpanded = document.getElementById('play-btn-expanded');
const prevBtnExpanded = document.getElementById('prev-btn-expanded');
const nextBtnExpanded = document.getElementById('next-btn-expanded');
const shuffleBtnExpanded = document.getElementById('shuffle-btn-expanded');
const repeatBtnExpanded = document.getElementById('repeat-btn-expanded');
const progressInputExpanded = document.getElementById('progress-input-expanded');
const progressFillExpanded = document.getElementById('progress-fill-expanded');
const currentTimeExpanded = document.getElementById('current-time-expanded');
const durationExpanded = document.getElementById('duration-expanded');
const volumeInputExpanded = document.getElementById('volume-input-expanded');
const playerExpandedTitle = document.getElementById('player-expanded-title');
const playerExpandedArtist = document.getElementById('player-expanded-artist');
const playerExpandedArt = document.getElementById('player-expanded-art');

// Other Elements
const searchInput = document.getElementById('search-input');
const recommendationsContainer = document.getElementById('recommendations');
const searchResultsContainer = document.getElementById('search-results');
const favoritesContainer = document.getElementById('favorites-list');
const playlistsContainer = document.getElementById('playlists-list');
const queueModal = document.getElementById('queue-modal');
const playlistModal = document.getElementById('playlist-modal');
const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
const queueList = document.getElementById('queue-list');
const navItems = document.querySelectorAll('.nav-item');
const sectionTitle = document.getElementById('section-title');
const sections = document.querySelectorAll('.section');
const profileBtn = document.getElementById('profile-btn');
const profileMenu = document.getElementById('profile-menu');
const logoutBtn = document.getElementById('logout-btn');
const profileName = document.getElementById('profile-name');
const profileAvatar = document.getElementById('profile-avatar');
const profileMenuName = document.getElementById('profile-menu-name');
const profileMenuEmail = document.getElementById('profile-menu-email');
const profileMenuAvatar = document.getElementById('profile-menu-avatar');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    if (state.currentUser) {
        showApp();
        setupEventListeners();
        renderRecommendations();
        renderPlaylists();
        setVolume(state.volume);
        loadCurrentSong();
        updateProfileUI();
    } else {
        showLogin();
        setupLoginEventListeners();
    }
}

function setupLoginEventListeners() {
    loginTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = tab.dataset.tab;
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.login-form').forEach(form => {
                form.classList.remove('active');
            });
            
            if (tabName === 'login') {
                loginForm.classList.add('active');
            } else {
                signupForm.classList.add('active');
            }
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (email === 'user@music.com' && password === '123456') {
            loginUser(email);
        } else {
            alert('Email ou senha incorretos. Use: user@music.com / 123456');
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            alert('As senhas não coincidem');
            return;
        }
        
        loginUser(email, name);
    });
}

function loginUser(email, name = 'Usuário') {
    const user = {
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=7c3aed&color=fff`
    };
    
    state.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    loginForm.reset();
    signupForm.reset();
    
    showApp();
    setupEventListeners();
    renderRecommendations();
    renderPlaylists();
    setVolume(state.volume);
    loadCurrentSong();
    updateProfileUI();
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
    state.isPlaying = false;
    audioPlayer.pause();
    showLogin();
}

function showLogin() {
    loginScreen.classList.add('active');
    appScreen.style.display = 'none';
}

function showApp() {
    loginScreen.classList.remove('active');
    appScreen.style.display = 'flex';
}

function setupEventListeners() {
    // Player Mini
    playerMiniLeft.addEventListener('click', togglePlayerExpanded);
    playBtnMini.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    queueBtnMini.addEventListener('click', (e) => {
        e.stopPropagation();
        openQueueModal();
    });

    // Player Expanded
    closePlayerBtn.addEventListener('click', closePlayerExpanded);
    playerOverlay.addEventListener('click', closePlayerExpanded);
    playBtnExpanded.addEventListener('click', togglePlay);
    prevBtnExpanded.addEventListener('click', previousSong);
    nextBtnExpanded.addEventListener('click', nextSong);
    shuffleBtnExpanded.addEventListener('click', toggleShuffle);
    repeatBtnExpanded.addEventListener('click', toggleRepeat);
    progressInputExpanded.addEventListener('input', seekSongExpanded);
    volumeInputExpanded.addEventListener('input', (e) => setVolume(e.target.value));
    
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
    
    // Profile Menu
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('active');
        profileBtn.classList.toggle('active');
        
        // Posicionar o menu corretamente
        if (profileMenu.classList.contains('active')) {
            const btnRect = profileBtn.getBoundingClientRect();
            profileMenu.style.top = (btnRect.bottom + 10) + 'px';
        }
    });
    
    document.addEventListener('click', () => {
        profileMenu.classList.remove('active');
        profileBtn.classList.remove('active');
    });
    
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        logout();
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
        if (e.target.closest('.music-card-btn.add-playlist')) {
            const card = e.target.closest('.music-card');
            const songId = parseInt(card.dataset.songId);
            openAddToPlaylistModal(songId);
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
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        nextSong();
    }
}

function seekSongExpanded(e) {
    const percentage = e.target.value;
    audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
}

function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFillExpanded.style.width = percentage + '%';
        progressInputExpanded.value = percentage;
        progressBarMini.style.width = percentage + '%';
        currentTimeExpanded.textContent = formatTime(audioPlayer.currentTime);
    }
}

function updateDuration() {
    durationExpanded.textContent = formatTime(audioPlayer.duration);
}

function setVolume(value) {
    state.volume = value;
    audioPlayer.volume = value / 100;
    volumeInputExpanded.value = value;
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
    shuffleBtnExpanded.classList.toggle('active', state.shuffle);
    
    if (state.shuffle) {
        showNotification('Modo Aleatório Ativado');
    } else {
        showNotification('Modo Aleatório Desativado');
    }
}

function toggleRepeat() {
    state.repeat = (state.repeat + 1) % 3;
    repeatBtnExpanded.classList.toggle('active', state.repeat > 0);
    
    if (state.repeat === 0) {
        repeatBtnExpanded.innerHTML = '<i class="fas fa-redo"></i>';
        showNotification('Repetição Desativada');
    } else if (state.repeat === 1) {
        repeatBtnExpanded.innerHTML = '<i class="fas fa-redo"></i>';
        showNotification('Repetir Tudo');
    } else if (state.repeat === 2) {
        repeatBtnExpanded.innerHTML = '<i class="fas fa-redo"></i><span style="font-size: 0.7rem; position: absolute; bottom: 2px; right: 2px;">1</span>';
        showNotification('Repetir Uma Música');
    }
}

function updatePlayerUI() {
    playerMiniTitle.textContent = state.currentSong.title;
    playerMiniArtist.textContent = state.currentSong.artist;
    playerMiniArt.src = state.currentSong.image;
    
    playerExpandedTitle.textContent = state.currentSong.title;
    playerExpandedArtist.textContent = state.currentSong.artist;
    playerExpandedArt.src = state.currentSong.image;
}

function updatePlayButton() {
    if (state.isPlaying) {
        playBtnMini.innerHTML = '<i class="fas fa-pause"></i>';
        playBtnExpanded.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtnMini.innerHTML = '<i class="fas fa-play"></i>';
        playBtnExpanded.innerHTML = '<i class="fas fa-play"></i>';
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

function togglePlayerExpanded() {
    if (state.playerExpanded) {
        closePlayerExpanded();
    } else {
        openPlayerExpanded();
    }
}

function openPlayerExpanded() {
    state.playerExpanded = true;
    playerExpanded.classList.add('active');
    playerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePlayerExpanded() {
    state.playerExpanded = false;
    playerExpanded.classList.remove('active');
    playerOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
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
                <button class="music-card-btn add-playlist">
                    <i class="fas fa-plus"></i>
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

function updateProfileUI() {
    if (state.currentUser) {
        profileName.textContent = state.currentUser.name;
        profileAvatar.src = state.currentUser.avatar;
        profileMenuName.textContent = state.currentUser.name;
        profileMenuEmail.textContent = state.currentUser.email;
        profileMenuAvatar.src = state.currentUser.avatar;
    }
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

function openAddToPlaylistModal(songId) {
    state.selectedSongForPlaylist = songId;
    
    const playlistSelection = document.getElementById('playlist-selection');
    
    if (state.playlists.length === 0) {
        playlistSelection.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Crie uma playlist primeiro</p>';
        addToPlaylistModal.classList.add('active');
        return;
    }
    
    playlistSelection.innerHTML = state.playlists.map((playlist, index) => `
        <label class="playlist-option">
            <input type="radio" name="playlist" value="${playlist.id}" ${index === 0 ? 'checked' : ''}>
            <div class="playlist-option-info">
                <div class="playlist-option-name">${playlist.name}</div>
                <div class="playlist-option-count">${playlist.songs.length} músicas</div>
            </div>
        </label>
    `).join('');
    
    playlistSelection.innerHTML += `
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
            <button class="btn-secondary" onclick="document.getElementById('add-to-playlist-modal').classList.remove('active')">Cancelar</button>
            <button class="btn-primary" onclick="addSongToPlaylist()">Adicionar</button>
        </div>
    `;
    
    addToPlaylistModal.classList.add('active');
}

function addSongToPlaylist() {
    const selectedPlaylistId = document.querySelector('input[name="playlist"]:checked')?.value;
    
    if (!selectedPlaylistId) {
        alert('Selecione uma playlist');
        return;
    }
    
    const playlist = state.playlists.find(p => p.id == selectedPlaylistId);
    const song = state.queue.find(s => s.id === state.selectedSongForPlaylist);
    
    if (!playlist.songs.includes(state.selectedSongForPlaylist)) {
        playlist.songs.push(state.selectedSongForPlaylist);
        localStorage.setItem('playlists', JSON.stringify(state.playlists));
        showNotification(`"${song.title}" adicionada à playlist "${playlist.name}"`);
    } else {
        showNotification(`"${song.title}" já está nessa playlist`);
    }
    
    addToPlaylistModal.classList.remove('active');
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
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    sections.forEach(sec => sec.classList.remove('active'));
    
    const sectionMap = {
        'home': 'home-section',
        'search': 'search-section',
        'favorites': 'favorites-section',
        'playlists': 'playlists-section'
    };
    
    const sectionId = sectionMap[section];
    document.getElementById(sectionId).classList.add('active');
    
    const titleMap = {
        'home': 'Início',
        'search': 'Buscar',
        'favorites': 'Favoritos',
        'playlists': 'Playlists'
    };
    
    sectionTitle.textContent = titleMap[section];
    
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
        bottom: 120px;
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

// ============================================
// PROFILE AND SETTINGS FUNCTIONS
// ============================================

function openProfileModal() {
    profileMenu.classList.remove('active');
    profileOverlay.classList.remove('active');
    profileBtn.classList.remove('active');
    
    document.getElementById('profile-modal-name').textContent = state.currentUser.name;
    document.getElementById('profile-modal-email').textContent = state.currentUser.email;
    document.getElementById('profile-modal-avatar').src = state.currentUser.avatar;
    
    const joinDate = JSON.parse(localStorage.getItem('joinDate')) || new Date().toISOString();
    if (!localStorage.getItem('joinDate')) {
        localStorage.setItem('joinDate', JSON.stringify(joinDate));
    }
    const date = new Date(joinDate);
    document.getElementById('stat-joined').textContent = date.toLocaleDateString('pt-BR');
    
    const history = JSON.parse(localStorage.getItem('history')) || [];
    document.getElementById('stat-songs').textContent = history.length;
    
    document.getElementById('stat-playlists').textContent = state.playlists.length;
    
    profileModal.classList.add('active');
}

function openSettingsModal() {
    profileMenu.classList.remove('active');
    profileOverlay.classList.remove('active');
    profileBtn.classList.remove('active');
    
    document.getElementById('autoplay-toggle').checked = JSON.parse(localStorage.getItem('autoplay') || 'true');
    document.getElementById('notifications-toggle').checked = JSON.parse(localStorage.getItem('notifications') || 'true');
    document.getElementById('quality-select').value = localStorage.getItem('audioQuality') || 'medium';
    document.getElementById('theme-select').value = localStorage.getItem('theme') || 'dark';
    
    settingsModal.classList.add('active');
}

// Add listeners for profile and settings buttons
if (document.getElementById('my-profile-btn')) {
    document.getElementById('my-profile-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openProfileModal();
        profileMenu.classList.remove('active');
        profileOverlay.classList.remove('active');
        profileBtn.classList.remove('active');
    });
}

if (document.getElementById('settings-btn')) {
    document.getElementById('settings-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSettingsModal();
        profileMenu.classList.remove('active');
        profileOverlay.classList.remove('active');
        profileBtn.classList.remove('active');
    });
}

if (document.getElementById('clear-history-btn')) {
    document.getElementById('clear-history-btn').addEventListener('click', () => {
        if (confirm('Deseja limpar o historico?')) {
            localStorage.removeItem('history');
            showNotification('Historico limpo!');
        }
    });
}

if (document.getElementById('autoplay-toggle')) {
    document.getElementById('autoplay-toggle').addEventListener('change', (e) => {
        localStorage.setItem('autoplay', e.target.checked);
    });
}

if (document.getElementById('notifications-toggle')) {
    document.getElementById('notifications-toggle').addEventListener('change', (e) => {
        localStorage.setItem('notifications', e.target.checked);
    });
}

if (document.getElementById('quality-select')) {
    document.getElementById('quality-select').addEventListener('change', (e) => {
        localStorage.setItem('audioQuality', e.target.value);
        showNotification('Qualidade alterada!');
    });
}

if (document.getElementById('theme-select')) {
    document.getElementById('theme-select').addEventListener('change', (e) => {
        localStorage.setItem('theme', e.target.value);
        showNotification('Tema alterado!');
    });
}
