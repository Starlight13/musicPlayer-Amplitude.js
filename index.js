let defaultSongCover = "https://cdn.dribbble.com/users/1787323/screenshots/15491880/media/6767bd6d559d452760e48a298b73e6f0.png?compress=1&resize=1600x1200"
let defaultAlbumCover = "https://cdn.dribbble.com/users/1787323/screenshots/15491880/media/1183a9976dbc4f0899ca9a6ab4d91409.png?compress=1&resize=1600x1200"
let shuffleFlag = false;


let createListElem = (songArray, index, playlist, className) => {
    let listElem = document.createElement('li');
    listElem.setAttribute('class', `${className} amplitude-song-container amplitude-play-pause`);
    listElem.setAttribute('data-amplitude-song-index', index);
    if (playlist) {
        console.log(playlist);
        listElem.setAttribute('data-amplitude-playlist', playlist);
    }

    let songImg = document.createElement('img');
    songImg.setAttribute('class', "cover-art");
    if (songArray[index].cover_art_url) {
        songImg.setAttribute('src', songArray[index].cover_art_url);
    } else {
        songImg.setAttribute('src', defaultSongCover);
    }

    let songInfoDiv = document.createElement('div');
    songInfoDiv.setAttribute('class', 'song-info');

    let songTitle = document.createElement('span');
    songTitle.setAttribute('class', 'song-info__title');
    songTitle.innerHTML = songArray[index].name;

    let songArtist = document.createElement('span');
    songArtist.setAttribute('class', 'song-info__artist');
    songArtist.innerHTML = songArray[index].artist;

    let playButton = document.createElement('img');
    playButton.setAttribute('src', './images/bi_play-fill.png');
    playButton.setAttribute('class', 'play__button');

    let pauseButton = document.createElement('img');
    pauseButton.setAttribute('src', './images/bi_pause-fill.svg');
    pauseButton.setAttribute('class', 'pause__button');

    songInfoDiv.appendChild(songTitle);
    songInfoDiv.appendChild(songArtist);

    listElem.appendChild(songImg);
    listElem.appendChild(songInfoDiv);
    listElem.appendChild(playButton);
    listElem.appendChild(pauseButton);

    return listElem;
}

let isValid = (value) => {
    let playlists = Amplitude.getConfig().playlists;
    if (value != '' && !Object.keys(playlists).includes(value)) 
        return true;
    return false;
}

let createPlaylist = () => {
    let value = document.getElementsByName('playlist-title')[0].value;

    if (isValid(value)) {
        let songs = [];
        let checkboxes = document.getElementsByClassName('song__option');

        for (checkbox of checkboxes) {
            if (checkbox.checked) {
                songs.push(Amplitude.getSongAtIndex(parseInt(checkbox.value)));
            }
        }

        Amplitude.addPlaylist(value, {"title": value}, songs);
        setTimeout(() => displayUserPlaylists(), 0);
        document.getElementsByClassName('create-playlist__modal')[0].style.display = 'none';
    } else {
        alert('Enter a unique playlist name');
    };
}

let displayUserPlaylists = () => {
    let playlists = Amplitude.getConfig().playlists;
    let playlistsList = document.getElementsByClassName('playlists__list')[0];
    playlistsList.innerHTML = '';

    for (let i = 3; i < Object.keys(playlists).length; i++) {
        let listItem = document.createElement('li');
        listItem.setAttribute('class', 'playlists__list__item amplitude-play')
        listItem.setAttribute('data-amplitude-playlist', `${Object.keys(playlists)[i]}`);

        let textNode = document.createTextNode(playlists[Object.keys(playlists)[i]].title);
        let icon = document.createElement('i');
        icon.setAttribute('class', 'fas fa-list')

        listItem.appendChild(icon);
        listItem.appendChild(textNode);
        console.log(listItem);

        playlistsList.appendChild(listItem);
    }

    Amplitude.bindNewElements();
}

let makeModalDisplay = () => {
    let modalTrigger = document.getElementsByClassName('new-playlist__button')[0];
    let modal = document.getElementsByClassName('create-playlist__modal')[0];

    modalTrigger.addEventListener('click', () => {
        modal.style.display = 'flex';
    })

    document.getElementsByClassName('close__button')[0].addEventListener('click', () => modal.style.display = 'none')

    let form = modal.getElementsByTagName('form')[0];
    songArray = Amplitude.getSongs();

    for (index in songArray) {
        let option = document.createElement('input');
        option.setAttribute('type', 'checkbox');
        option.setAttribute('class', 'song__option');
        option.setAttribute('name', `song${index}`)
        option.setAttribute('value', index);

        let label = document.createElement('label');
        label.setAttribute('for', `song${index}`);
        label.innerHTML = `${songArray[index].name} &#8226; ${songArray[index].artist}<br/>`;

        form.appendChild(option);
        form.appendChild(label);
    }

    let createPlaylistButton = document.createElement('button');
    createPlaylistButton.innerHTML = "Create playlist";
    createPlaylistButton.addEventListener('click', (event) => {event.preventDefault(); createPlaylist();});

    modal.appendChild(createPlaylistButton);
}

let displayPopularAlbums = () => {
    let playlists = Amplitude.getConfig().playlists;
    let popularAlbums = document.getElementsByClassName('popular-albums')[0];

    for (let i = 0; i < 3; i++) {
        let album = playlists[Object.keys(playlists)[i]];

        let albumCard = document.createElement('div');
        albumCard.setAttribute('class', "album__card");

        let albumImage = document.createElement('div');
        albumImage.setAttribute('class', "album__card__cover-art");

        let playButton = document.createElement('button');
        playButton.className = ("album-play__button amplitude-play");
        playButton.setAttribute('data-amplitude-playlist', `${Object.keys(playlists)[i]}`);

        let playButtonImg = document.createElement('img');
        playButtonImg.setAttribute('src', './images/bi_play-circle-fill.svg');
        playButton.appendChild(playButtonImg);

        albumImage.appendChild(playButton);

        if (album.cover_art_url) {
            albumImage.style.backgroundImage = `url("${album.cover_art_url}")`;
        } else {
            albumImage.style.backgroundImage = `url("${defaultAlbumCover}")`;
        }


        let albumTitle = document.createElement('span');
        albumTitle.setAttribute('class', 'album__card__title');
        albumTitle.setAttribute('data-amplitude-playlist', `${Object.keys(playlists)[i]}`);
        albumTitle.innerHTML = album.title;

        albumCard.appendChild(albumImage);
        albumCard.appendChild(albumTitle);

        if (album.artist) {
            let albumArtist = document.createElement('span');
            albumArtist.setAttribute('class', 'album__card__artist');
            albumArtist.innerHTML = album.artist;
            albumArtist.setAttribute('data-amplitude-playlist', `${Object.keys(playlists)[i]}`);
            albumCard.appendChild(albumArtist);
        }

        popularAlbums.appendChild(albumCard);
    }
}

let displayPopularSongs = () => {
    let songs = Amplitude.getSongs();
    let popularSongs = document.getElementsByClassName('popular-songs')[0];
    for (let i = 2; i < 8; i += 2) {
        let song = songs[i];

        let songCard = document.createElement('div');
        songCard.setAttribute('class', "song__card");

        let songImage = document.createElement('div');
        songImage.setAttribute('class', "song__card__cover-art");

        let playButton = document.createElement('button');
        playButton.className = ("song-play__button amplitude-play");
        playButton.setAttribute('data-amplitude-song-index', `${i}`);

        let playButtonImg = document.createElement('img');
        playButtonImg.setAttribute('src', './images/bi_play-circle-fill.svg');

        playButtonImg.addEventListener('click', () => {
            Amplitude.setShuffle(false)
            displayQueue(Amplitude.getSongs(), null);
            document.getElementsByClassName('player-control__shuffle')[0].removeAttribute('data-amplitude-playlist');
            Amplitude.bindNewElements();
        })
        playButton.appendChild(playButtonImg);

        songImage.appendChild(playButton);

        if (song.cover_art_url) {
            songImage.style.backgroundImage = `url("${song.cover_art_url}")`;
        } else {
            songImage.style.backgroundImage = `url("${defaultAlbumCover}")`;
        }


        let songTitle = document.createElement('span');
        songTitle.setAttribute('class', 'song__card__title');
        songTitle.innerHTML = song.name

        let songArtist = document.createElement('span');
        songArtist.setAttribute('class', 'song__card__artist');
        songArtist.innerHTML = song.artist;

        songCard.appendChild(songImage);
        songCard.appendChild(songTitle);
        songCard.appendChild(songArtist);

        popularSongs.appendChild(songCard);
    }
}

let displayYouMayLike = () => {
    let songArray = Amplitude.getSongs();
    let youMayLikeList = document.getElementsByClassName('you-may-like-songs')[0];

    for (let i = 0; i < 2; i++) {
        let index = Math.floor(Math.random() * songArray.length);

        let listElem = createListElem(songArray, index, null, 'you-may-like__item');
        listElem.addEventListener('click', () => setTimeout(() => {
            Amplitude.setShuffle(false);
            displayQueue(Amplitude.getSongs(), null);
            Amplitude.bindNewElements();;
        }, 0));

        youMayLikeList.appendChild(listElem);
    }
}


let displayQueue = (songArray, playlist) => {
    let queue = document.getElementsByClassName('player__queue')[0];
    queue.innerHTML = "";

    for (index in songArray) {
        let listElem = createListElem(songArray, index, playlist, 'player__queue__item');
        queue.appendChild(listElem);
    }
}

let checkForShuffle = () => {
    let playlist = Amplitude.getActivePlaylist();
    if (playlist) {
        if (shuffleFlag != Amplitude.getShufflePlaylist(playlist)) {
            displayQueue(Amplitude.getSongsStatePlaylist(playlist), playlist);
            Amplitude.bindNewElements();
            shuffleFlag = Amplitude.getShufflePlaylist(playlist)
        }
    } else {
        if (shuffleFlag != Amplitude.getShuffle()) {
            displayQueue(Amplitude.getSongsState(), null);
            Amplitude.bindNewElements();
            shuffleFlag = Amplitude.getShuffle();
        }
    }
}

let initialization = () => {
    makeModalDisplay();
    displayUserPlaylists();
    displayPopularAlbums();
    displayPopularSongs();
    displayYouMayLike();
    displayQueue(Amplitude.getSongs(), null);
    Amplitude.bindNewElements()
}


Amplitude.init({
    songs: [
        {
            "name": "Risin' High (feat Raashan Ahmad)",
            "artist": "Ancient Astronauts",
            "album": "We Are to Answer",
            "url": "https://521dimensions.com/songs/Ancient Astronauts - Risin' High (feat Raashan Ahmad).mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg"
        },
        {
            "name": "The Gun",
            "artist": "Lorn",
            "album": "Ask The Dust",
            "url": "https://521dimensions.com/songs/08 The Gun.mp3",
            // "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/ask-the-dust.jpg"
        },
        {
            "name": "Anvil",
            "artist": "Lorn",
            "album": "Anvil",
            "url": "https://521dimensions.com/songs/LORN - ANVIL.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/anvil.jpg"
        },
        {
            "name": "I Came Running",
            "artist": "Ancient Astronauts",
            "album": "We Are to Answer",
            "url": "https://521dimensions.com/songs/ICameRunning-AncientAstronauts.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg"
        },
        {
            "name": "First Snow",
            "artist": "Emancipator",
            "album": "Soon It Will Be Cold Enough",
            "url": "https://521dimensions.com/songs/FirstSnow-Emancipator.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg"
        },
        {
            "name": "Terrain",
            "artist": "pg.lost",
            "album": "Key",
            "url": "https://521dimensions.com/song/Terrain-pglost.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/key.jpg"
        },
        {
            "name": "Vorel",
            "artist": "Russian Circles",
            "album": "Guidance",
            "url": "https://521dimensions.com/song/Vorel-RussianCircles.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/guidance.jpg"
        },
        {
            "name": "Intro / Sweet Glory",
            "artist": "Jimkata",
            "album": "Die Digital",
            "url": "https://521dimensions.com/song/IntroSweetGlory-Jimkata.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/die-digital.jpg"
        },
        {
            "name": "Offcut #6",
            "artist": "Little People",
            "album": "We Are But Hunks of Wood Remixes",
            "url": "https://521dimensions.com/song/Offcut6-LittlePeople.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-but-hunks-of-wood.jpg"
        },
        {
            "name": "Dusk To Dawn",
            "artist": "Emancipator",
            "album": "Dusk To Dawn",
            "url": "https://521dimensions.com/song/DuskToDawn-Emancipator.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/from-dusk-to-dawn.jpg"
        },
        {
            "name": "Anthem",
            "artist": "Emancipator",
            "album": "Soon It Will Be Cold Enough",
            "url": "https://521dimensions.com/song/Anthem-Emancipator.mp3",
            "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg"
        }
    ],
    playlists: {
        "ancient_astronauts": {
            songs: [0, 3],
            title: 'Best of Ancient Astronauts',
            cover_art_url: "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg",
            artist: "Ancient Astronauts"
        },
        "trip_hop": {
            songs: [1, 2, 5, 6, 7, 8],
            title: 'Trip Hop Mix 2018',
            author: 'Dan Pastori'
        },
        "emancipator": {
            songs: [4, 9, {
                "name": "Anthem",
                "artist": "Emancipator",
                "album": "Soon It Will Be Cold Enough",
                "url": "../songs/Anthem-Emancipator.mp3"
            }],
            title: 'Emancipator\'s Greatest Hits',
            cover_art_url: "https://cdns-images.dzcdn.net/images/artist/8c4458e72779a81f10387f73aa0c194e/264x264.jpg",
            artist: "Emancipator"
        }
    },
    callbacks: {
        initialized: initialization,
        playlist_changed: () => setTimeout(() => {
            Amplitude.setShufflePlaylist(Amplitude.getActivePlaylist(), false)
            displayQueue(Amplitude.getSongsInPlaylist(Amplitude.getActivePlaylist()), Amplitude.getActivePlaylist())
            let shuffle = document.getElementsByClassName('player-control__shuffle')[0];
            shuffle.setAttribute('data-amplitude-playlist', `${Amplitude.getActivePlaylist()}`);
            Amplitude.bindNewElements();
        }, 0)
    },
    default_album_art: defaultSongCover,
    debug: true

});
