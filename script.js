document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchMusic');
    const musicList = document.getElementById('music-list');

    fetch('musicas.json')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.artist.localeCompare(b.artist));
            data.forEach(item => item.songs.sort((a, b) => a.localeCompare(b)));
            displayMusicList(data);

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                
                if (!searchTerm.trim()) {
                    // If search is empty, show all songs
                    displayMusicList(data);
                    return;
                }
                
                // Create a new filtered array with only matching songs
                const filteredData = data.map(item => {
                    // Check if artist name matches
                    const artistMatches = item.artist.toLowerCase().includes(searchTerm);
                    
                    // Filter songs that match search term
                    const matchingSongs = item.songs.filter(song => 
                        song.toLowerCase().includes(searchTerm)
                    );
                    
                    // Include artist if name matches OR if they have matching songs
                    if (artistMatches || matchingSongs.length > 0) {
                        return {
                            artist: item.artist,
                            // If artist name matches, include all songs, otherwise only matching songs
                            songs: artistMatches ? item.songs : matchingSongs
                        };
                    }
                    
                    // Return null for artists with no matches (to be filtered out)
                    return null;
                }).filter(item => item !== null); // Remove null entries

                filteredData.sort((a, b) => a.artist.localeCompare(b.artist));
                filteredData.forEach(item => item.songs.sort((a, b) => a.localeCompare(b)));
                displayMusicList(filteredData);
            });
        });

    function displayMusicList(data) {
        musicList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.artist}</strong><ul>${item.songs.map(song => `<li>${song}</li>`).join('')}</ul>`;
            musicList.appendChild(li);
        });
    }
});
