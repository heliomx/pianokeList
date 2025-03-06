const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, 'music-list.csv');
const jsonFilePath = path.join(__dirname, 'musicas.json');

const artists = {};

console.log('Processing CSV file...');

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        const artist = row['Nome do Artista'];
        const song = row['Música'];
        if (!artists[artist]) {
            artists[artist] = [];
        }
        artists[artist].push(song);
    })
    .on('end', () => {
        const jsonData = Object.keys(artists).map(artist => ({
            artist,
            songs: artists[artist].sort()
        })).sort((a, b) => a.artist.localeCompare(b.artist));

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
        console.log('CSV file successfully processed and converted to JSON');
    });
