import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();
export const saveToken = async (req, res) => {
    // console.log(req.body)
    const { userId, userToken, tokenExpiryDate } = req.body;
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                appleMusicToken: userToken,
                tokenExpiryDate,
            },
        });
        res.status(201).send('Token save succesfully!');
    }
    catch (error) {
        console.error('Error saving token:', error);
        res.status(500).send('Error updating token');
    }
};
export const getToken = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                appleMusicToken: true,
                tokenExpiryDate: true,
            },
        });
        if (result && result != null) {
            console.log('result:', result);
            res.status(200).json(result);
        }
        else {
            res.status(404).json({ message: 'token not found' });
        }
    }
    catch (error) {
        console.error('Error saving token:', error);
        res.status(500).send('Error updating token');
    }
};
export const fetchAndSaveAlbumsHandler = async (req, res) => {
    const { userId, appleMusicToken } = req.body;
    await fetchAndSaveAlbums(userId, appleMusicToken, res);
};
export const fetchAndSaveAlbums = async (userId, appleMusicToken, res) => {
    const albums = [];
    let responseSent = false;
    const fetchAlbums = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            const data = res.data;
            albums.push(...data.data);
            if (data.next) {
                await fetchAlbums(`https://api.music.apple.com${data.next}`);
            }
        }
        catch (error) {
            console.error('Failed to fetch albums:', error);
            if (!responseSent) {
                responseSent = true;
                res.status(500).json({ error: 'Failed to fetch albums' });
            }
        }
    };
    const initialAlbumsUrl = 'https://api.music.apple.com/v1/me/library/albums';
    await fetchAlbums(initialAlbumsUrl);
    if (responseSent)
        return;
    const uniqueAlbums = Array.from(new Set(albums.map(album => album.id))).map(id => albums.find(album => album?.id === id));
    const filteredAlbums = uniqueAlbums.filter(album => album !== undefined);
    const existingAlbumIds = (await prisma.album.findMany({
        where: {
            albumId: {
                in: filteredAlbums
                    .map(album => album.id)
                    .filter(id => id !== undefined),
            },
        },
        select: {
            albumId: true,
        },
    })).map(album => album.albumId);
    const newAlbums = filteredAlbums
        .filter(album => album && !existingAlbumIds.includes(album.id))
        .map(album => ({
        artistName: album.attributes.artistName || '',
        artworkUrl: album.attributes.artwork?.url || '',
        dateAdded: album.attributes.dateAdded,
        genreNames: album.attributes.genreNames,
        name: album.attributes.name || '',
        releaseDate: album.attributes.releasedDate,
        trackCount: album.attributes.trackCount,
        albumId: album.id,
        type: album.type,
        userId: userId,
    }));
    try {
        if (newAlbums.length > 0) {
            await prisma.album.createMany({
                data: newAlbums,
            });
        }
        res.status(200).json({
            message: 'Albums saved successfully!',
        });
    }
    catch (error) {
        console.error('Error saving albums:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to save albums',
            });
        }
    }
};
export const updateAlbumArtwork = async (req, res) => {
    const { albumId, newArtworkUrl } = req.body;
    try {
        // Update the album in the database
        await prisma.album.update({
            where: { albumId: albumId },
            data: { artworkUrl: newArtworkUrl },
        });
        res.status(200).json({
            message: 'Artwork URL updated successfully!',
            newArtworkUrl: newArtworkUrl,
        });
    }
    catch (error) {
        console.error('Error updating album artwork:', error);
        res.status(500).json({ error: 'Failed to update album artwork' });
    }
};
export const fetchAndSaveSongsHandler = async (req, res) => {
    const { userId, appleMusicToken } = req.body;
    await fetchAndSaveSongs(userId, appleMusicToken, res);
};
export const fetchAndSaveSongs = async (userId, appleMusicToken, res) => {
    const songs = [];
    let responseSent = false;
    const fetchSongs = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            const data = res.data;
            songs.push(...data.data);
            // if (data.next) {
            //     await fetchSongs(`https://api.music.apple.com${data.next}`)
            // }
            // return {
            //     songs: songs,
            //     message: 'Songs saved successfully!',
            // }
        }
        catch (error) {
            console.error('Failed to fetch songs:', error);
            if (!responseSent) {
                responseSent = true;
                res.status(500).json({ error: 'Failed to fetch songs' });
            }
        }
    };
    const initialSongsUrl = 'https://api.music.apple.com/v1/me/library/songs';
    await fetchSongs(initialSongsUrl);
    if (responseSent)
        return;
    const uniqueSongs = Array.from(new Set(songs.map(song => song.id))).map(id => songs.find(song => song?.id === id));
    const filteredSongs = uniqueSongs.filter(song => song !== undefined);
    const existingSongIds = (await prisma.song.findMany({
        where: {
            songId: {
                in: filteredSongs
                    .map(song => song.id)
                    .filter(id => id !== undefined),
            },
        },
        select: {
            songId: true,
        },
    })).map(song => song.songId);
    const newSongs = filteredSongs
        .filter(song => song && !existingSongIds.includes(song.id))
        .map(song => ({
        songId: song.id,
        name: song.attributes.name || '',
        trackNumber: song.attributes.trackNumber,
        artistName: song.attributes.artistName || '',
        albumName: song.attributes.albumName || '',
        durationInMillis: song.attributes.durationInMillis,
        artworkUrl: song.attributes.artwork?.url || '',
        userId: userId,
        catalogId: song.attributes.playParams?.catalogId || '',
    }));
    // .filter(song => song.songId && song.name && song.artistName)
    try {
        if (newSongs.length > 0) {
            await prisma.song.createMany({
                data: newSongs,
            });
        }
        res.status(200).json({
            songs: songs,
            message: 'Songs saved successfully!',
        });
    }
    catch (error) {
        console.error('Error saving songs:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to save songs',
            });
        }
    }
};
export const fetchAndSaveRatingsHandler = async (req, res) => {
    const { userId, appleMusicToken } = req.body;
    await fetchAndSaveRatings(userId, appleMusicToken, res);
};
export const fetchAndSaveRatings = async (userId, appleMusicToken, res) => {
    const ratings = [];
    let responseSent = false;
    const fetchRatings = async (songs) => {
        for (const song of songs) {
            const endpoint = song.id.startsWith('i')
                ? `https://api.music.apple.com/v1/me/ratings/library-songs/${song.id}`
                : `https://api.music.apple.com/v1/me/ratings/songs/${song.id}`;
            try {
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                        'Music-User-Token': appleMusicToken,
                    },
                });
                if (res.data && res.data.data) {
                    const ratingData = res.data.data[0];
                    ratings.push({
                        songId: song.id,
                        value: ratingData.attributes.value,
                        userId: userId,
                        durationInMillis: song.attributes.durationInMillis,
                        ratedAt: ratingData.attributes.ratedAt ||
                            new Date().toISOString(),
                        songName: song.attributes.name,
                        artistName: song.attributes.artistName,
                        albumName: song.attributes.albumName,
                        artworkUrl: song.attributes.artwork?.url,
                    });
                }
            }
            catch (error) {
                if (error.response &&
                    error.response.data &&
                    error.response.data.errors) {
                    const errorMessage = error.response.data.errors[0];
                    if (errorMessage.status === '404') {
                        console.log(`Song ID ${song.id} not rated, skipping.`);
                    }
                    else {
                        console.error(`Failed to fetch rating for song: ${song.id}`, errorMessage);
                    }
                }
                else {
                    console.error(`Unexpected error fetching rating for song: ${song.id}`, error);
                }
            }
        }
    };
    // Get all song IDs from the DB to avoid fetching ratings for songs that are already in the database
    const songIdsInDb = (await prisma.song.findMany({
        where: {
            userId: userId,
        },
        select: {
            songId: true,
        },
    })).map(song => song.songId);
    // Fetch the songs from the Apple Music library
    const songs = [];
    const fetchSongs = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            const data = res.data;
            songs.push(...data.data);
            if (data.next) {
                await fetchSongs(`https://api.music.apple.com${data.next}`);
            }
        }
        catch (error) {
            console.error('Failed to fetch songs:', error);
            if (!responseSent) {
                responseSent = true;
                res.status(500).json({ error: 'Failed to fetch songs' });
            }
        }
    };
    const initialSongsUrl = 'https://api.music.apple.com/v1/me/library/songs';
    await fetchSongs(initialSongsUrl);
    if (responseSent)
        return;
    // Filter out the songs that are already in the database
    const newSongIds = songs.map(song => song.id);
    // .filter(id => !songIdsInDb.includes(id))
    await fetchRatings(songs);
    // Save ratings
    const ratingData = ratings.map(rating => ({
        songId: rating.songId,
        value: rating.value,
        userId: userId,
        ratedAt: rating.ratedAt,
        songName: rating.songName,
        durationInMillis: rating.durationInMillis,
        artistName: rating.artistName,
        albumName: rating.albumName,
        artworkUrl: rating.artworkUrl,
    }));
    try {
        if (ratingData.length > 0) {
            await prisma.rating.createMany({
                data: ratingData,
            });
        }
        res.status(200).json({
            message: 'Ratings saved successfully!',
        });
    }
    catch (error) {
        console.error('Error saving ratings:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to save ratings',
            });
        }
    }
};
export const fetchAndSaveAlbumRatingsHandler = async (req, res) => {
    const { userId, appleMusicToken } = req.body;
    await fetchAndSaveAlbumRatings(userId, appleMusicToken, res);
};
export const fetchAndSaveAlbumRatings = async (userId, appleMusicToken, res) => {
    const ratings = [];
    let responseSent = false;
    const fetchRatings = async (albumIds) => {
        for (const albumId of albumIds) {
            const endpoint = `https://api.music.apple.com/v1/me/ratings/library-albums/${albumId}`;
            try {
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                        'Music-User-Token': appleMusicToken,
                    },
                });
                if (res.data && res.data.data) {
                    const ratingData = res.data.data[0];
                    console.log(`Rating data ${ratingData} for ${albumId} found.`);
                    // Fetch tracks for the album and add them to ratings
                    const tracks = await fetchAlbumTracks(albumId, appleMusicToken);
                    tracks.forEach(track => {
                        ratings.push({
                            songId: track.id,
                            value: 1,
                            userId: userId,
                            ratedAt: new Date().toISOString(), // Mark the rating with current date
                            songName: track.attributes.name,
                            durationInMillis: track.attributes.durationInMillis,
                            artistName: track.attributes.artistName,
                            albumName: track.attributes.albumName,
                            artworkUrl: track.attributes.artwork?.url,
                        });
                    });
                }
            }
            catch (error) {
                if (error.response &&
                    error.response.data &&
                    error.response.data.errors) {
                    const errorMessage = error.response.data.errors[0];
                    if (errorMessage.status === '404') {
                        console.log(`Album ID ${albumId} not rated, skipping.`);
                    }
                    else {
                        console.error(`Failed to fetch rating for album: ${albumId}`, errorMessage);
                    }
                }
                else {
                    console.error(`Unexpected error fetching rating for album: ${albumId}`, error);
                }
            }
        }
    };
    const fetchAlbumTracks = async (albumId, appleMusicToken) => {
        const tracks = [];
        const endpoint = `https://api.music.apple.com/v1/me/library/albums/${albumId}/tracks`;
        try {
            const res = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            if (res.data && res.data.data) {
                tracks.push(...res.data.data);
            }
        }
        catch (error) {
            console.error(`Failed to fetch tracks for album: ${albumId}`, error);
        }
        return tracks;
    };
    // Get all album IDs from the Apple Music library
    const albums = [];
    const fetchAlbums = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            const data = res.data;
            albums.push(...data.data);
            if (data.next) {
                await fetchAlbums(`https://api.music.apple.com${data.next}`);
            }
        }
        catch (error) {
            console.error('Failed to fetch albums:', error);
            if (!responseSent) {
                responseSent = true;
                res.status(500).json({ error: 'Failed to fetch albums' });
            }
        }
    };
    const initialAlbumsUrl = 'https://api.music.apple.com/v1/me/library/albums';
    await fetchAlbums(initialAlbumsUrl);
    if (responseSent)
        return;
    // Filter out duplicate album IDs
    const uniqueAlbumIds = Array.from(new Set(albums.map(album => album.id)));
    await fetchRatings(uniqueAlbumIds);
    const ratingData = ratings.map(rating => ({
        songId: rating.songId,
        value: rating.value,
        userId: userId,
        ratedAt: rating.ratedAt,
        songName: rating.songName,
        artistName: rating.artistName,
        durationInMillis: rating.durationInMillis,
        albumName: rating.albumName,
        artworkUrl: rating.artworkUrl,
    }));
    try {
        if (ratingData.length > 0) {
            await prisma.rating.createMany({
                data: ratingData,
            });
        }
        res.status(200).json({
            message: 'Ratings saved successfully!',
        });
    }
    catch (error) {
        console.error('Error saving ratings:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to save ratings',
            });
        }
    }
};
export const addSongsToRatingsHandler = async (req, res) => {
    const { userId, songDetails } = req.body;
    await addSongsToRatings(userId, songDetails, res);
};
export const addSongsToRatings = async (userId, songDetails, res) => {
    console.log('song details receive: ', songDetails);
    const ratings = songDetails.map(song => ({
        songId: song.songId,
        catalogId: song.catalogId,
        songName: song.songName,
        durationInMillis: song.durationInMillis,
        artistName: song.artistName,
        albumName: song.albumName,
        artworkUrl: song.artworkUrl,
        userId: userId,
        value: 1,
        ratedAt: new Date().toISOString(),
    }));
    try {
        if (ratings.length > 0) {
            await prisma.rating.createMany({
                data: ratings,
            });
        }
        res.status(200).json({
            message: 'Songs added to ratings successfully!',
        });
    }
    catch (error) {
        console.error('Error adding songs to ratings:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to add songs to ratings',
            });
        }
    }
};
export const getRatings = async (req, res) => {
    const { userId } = req.body;
    try {
        const ratings = await prisma.rating.findMany({
            where: { userId: userId },
            select: {
                songId: true,
                ratedAt: true,
                songName: true,
                durationInMillis: true,
                catalogId: true,
                artistName: true,
                albumName: true,
                artworkUrl: true,
            },
        });
        const formattedSongs = ratings.map(song => ({
            id: song.songId,
            type: 'library-songs',
            attributes: {
                ratedAt: song.ratedAt,
                name: song.songName,
                artistName: song.artistName,
                durationInMillis: song.durationInMillis,
                albumName: song.albumName,
                playParams: {
                    catalogId: song.catalogId,
                },
                artwork: song.artworkUrl
                    ? { url: song.artworkUrl } // Adjust height and width as needed
                    : undefined,
            },
        }));
        res.status(200).json({
            message: 'Ratings retrieved successfully!',
            data: formattedSongs,
        });
    }
    catch (error) {
        console.error('Error retrieving ratings:', error);
        res.status(500).json({
            error: 'Failed to retrieve ratings',
        });
    }
};
export const getLibrary = async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                albums: true,
                songs: true,
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const { albums, songs } = user;
        // Format the albums to match the Album interface
        const formattedAlbums = albums.map(album => ({
            id: album.albumId,
            type: album.type,
            attributes: {
                artistName: album.artistName,
                artwork: album.artworkUrl
                    ? { url: album.artworkUrl } // Adjust height and width as needed
                    : undefined,
                dateAdded: album.dateAdded, // Assuming createdAt is the date added
                genreNames: album.genreNames || [],
                name: album.name,
                releaseDate: album.releaseDate, // Assuming releaseDate is available in the album data
                trackCount: album.trackCount,
            },
        }));
        const formattedSongs = songs.map(song => ({
            id: song.songId,
            type: 'library-songs',
            attributes: {
                name: song.name,
                trackNumber: song.trackNumber,
                artistName: song.artistName,
                albumName: song.albumName,
                durationInMillis: song.durationInMillis,
                playParams: {
                    catalogId: song.catalogId,
                },
                artwork: song.artworkUrl
                    ? { url: song.artworkUrl } // Adjust height and width as needed
                    : undefined,
            },
        }));
        res.status(200).json({ albums: formattedAlbums, songs: formattedSongs });
    }
    catch (error) {
        console.error('Error fetching user library:', error);
        res.status(500).send('Error fetching user library');
    }
};
