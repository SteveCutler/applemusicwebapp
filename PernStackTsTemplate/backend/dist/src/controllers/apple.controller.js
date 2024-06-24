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
        albumId: album.id,
        name: album.attributes.name || '',
        artistName: album.attributes.artistName || '',
        artworkUrl: album.attributes.artwork?.url || '',
        trackCount: album.attributes.trackCount,
        href: album.href,
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
    }))
        .filter(song => song.songId && song.name && song.artistName);
    try {
        if (newSongs.length > 0) {
            await prisma.song.createMany({
                data: newSongs,
            });
        }
        res.status(200).json({
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
    const fetchRatings = async (songIds) => {
        for (const songId of songIds) {
            const endpoint = songId.startsWith('i')
                ? `https://api.music.apple.com/v1/me/ratings/library-songs/${songId}`
                : `https://api.music.apple.com/v1/me/ratings/songs/${songId}`;
            try {
                const res = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                        'Music-User-Token': appleMusicToken,
                    },
                });
                if (res.data && res.data.data) {
                    const ratingData = res.data.data[0];
                    console.log(`Rating data ${ratingData} for ${songId} found.`);
                    ratings.push(ratingData);
                }
            }
            catch (error) {
                if (error.response &&
                    error.response.data &&
                    error.response.data.errors) {
                    const errorMessage = error.response.data.errors[0];
                    if (errorMessage.status === '404') {
                        console.log(`Song ID ${songId} not rated, skipping.`);
                    }
                    else {
                        console.error(`Failed to fetch rating for song: ${songId}`, errorMessage);
                    }
                }
                else {
                    console.error(`Unexpected error fetching rating for song: ${songId}`, error);
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
    const newSongIds = songs
        .map(song => song.id)
        .filter(id => !songIdsInDb.includes(id));
    await fetchRatings(newSongIds);
    // Save ratings
    const ratingData = ratings.map(rating => ({
        songId: rating.id,
        value: rating.attributes.value,
        userId: userId,
        ratedAt: rating.attributes.ratedAt || new Date().toISOString(),
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
                            id: track.id,
                            attributes: {
                                value: 1,
                                ratedAt: new Date().toISOString(), // Mark the rating with current date
                            },
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
        songId: rating.id,
        value: rating.attributes.value,
        userId: userId,
        ratedAt: rating.attributes.ratedAt || new Date().toISOString(),
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
// export const updateLibrary = async (req: Request, res: Response) => {
//     const { userId, appleMusicToken } = req.body
//     const albums: AlbumType[] = []
//     const songs: Song[] = []
//     const ratings: Rating[] = []
//     let responseSent = false
//     const fetchAlbums = async (url: string) => {
//         try {
//             const res = await axios.get(url, {
//                 headers: {
//                     Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
//                     'Music-User-Token': appleMusicToken,
//                 },
//             })
//             const data = res.data
//             albums.push(...data.data)
//             if (data.next) {
//                 await fetchAlbums(`https://api.music.apple.com${data.next}`)
//             }
//         } catch (error) {
//             console.error('Failed to fetch albums:', error)
//             if (!responseSent) {
//                 responseSent = true
//                 res.status(500).json({ error: 'Failed to fetch albums' })
//             }
//         }
//     }
//     const fetchSongs = async (url: string) => {
//         try {
//             const res = await axios.get(url, {
//                 headers: {
//                     Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
//                     'Music-User-Token': appleMusicToken,
//                 },
//             })
//             const data = res.data
//             songs.push(...data.data)
//             if (data.next) {
//                 await fetchSongs(`https://api.music.apple.com${data.next}`)
//             }
//         } catch (error) {
//             console.error('Failed to fetch songs:', error)
//             if (!responseSent) {
//                 responseSent = true
//                 res.status(500).json({ error: 'Failed to fetch songs' })
//             }
//         }
//     }
//     const fetchRatings = async (songIds: string[]) => {
//         for (const songId of songIds) {
//             const endpoint = songId.startsWith('i')
//                 ? `https://api.music.apple.com/v1/me/ratings/library-songs/${songId}`
//                 : `https://api.music.apple.com/v1/me/ratings/songs/${songId}`
//             try {
//                 const res = await axios.get(endpoint, {
//                     headers: {
//                         Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
//                         'Music-User-Token': appleMusicToken,
//                     },
//                 })
//                 if (res.data && res.data.data) {
//                     const ratingData = res.data.data[0]
//                     console.log(
//                         `Rating data ${ratingData} for ${songId} found.`
//                     )
//                     ratings.push(ratingData)
//                 }
//             } catch (error: any) {
//                 if (
//                     error.response &&
//                     error.response.data &&
//                     error.response.data.errors
//                 ) {
//                     const errorMessage = error.response.data.errors[0]
//                     if (errorMessage.status === '404') {
//                         console.log(`Song ID ${songId} not rated, skipping.`)
//                     } else {
//                         console.error(
//                             `Failed to fetch rating for song: ${songId}`,
//                             errorMessage
//                         )
//                     }
//                 } else {
//                     console.error(
//                         `Unexpected error fetching rating for song: ${songId}`,
//                         error
//                     )
//                 }
//             }
//         }
//     }
//     const initialAlbumsUrl = 'https://api.music.apple.com/v1/me/library/albums'
//     await fetchAlbums(initialAlbumsUrl)
//     const initialSongsUrl = 'https://api.music.apple.com/v1/me/library/songs'
//     await fetchSongs(initialSongsUrl)
//     if (responseSent) return
//     // Filter out duplicate song IDs before fetching ratings
//     const uniqueSongIds = Array.from(new Set(songs.map(song => song.id)))
//     // Fetch existing song IDs to avoid duplicates
//     const existingSongIds = (
//         await prisma.song.findMany({
//             where: {
//                 songId: {
//                     in: uniqueSongIds.filter(
//                         id => id !== undefined
//                     ) as string[],
//                 },
//             },
//             select: {
//                 songId: true,
//             },
//         })
//     ).map(song => song.songId)
//     // Filter out existing songs from uniqueSongIds
//     const newSongIds = uniqueSongIds.filter(id => !existingSongIds.includes(id))
//     // await fetchRatings(newSongIds)
//     // Filter out duplicate albums and songs before saving to DB
//     const uniqueAlbums = Array.from(new Set(albums.map(album => album.id))).map(
//         id => albums.find(album => album?.id === id)
//     )
//     const uniqueSongs = Array.from(new Set(songs.map(song => song.id))).map(
//         id => songs.find(song => song?.id === id)
//     )
//     // Remove undefined values from uniqueAlbums and uniqueSongs
//     const filteredAlbums = uniqueAlbums.filter(
//         album => album !== undefined
//     ) as AlbumType[]
//     const filteredSongs = uniqueSongs.filter(
//         song => song !== undefined
//     ) as Song[]
//     // Fetch existing album IDs to avoid duplicates
//     const existingAlbumIds = (
//         await prisma.album.findMany({
//             where: {
//                 albumId: {
//                     in: filteredAlbums
//                         .map(album => album.id)
//                         .filter(id => id !== undefined) as string[],
//                 },
//             },
//             select: {
//                 albumId: true,
//             },
//         })
//     ).map(album => album.albumId)
//     // Fetch the user
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//     })
//     if (!user) {
//         if (!responseSent) {
//             responseSent = true
//             return res.status(404).json({ error: 'User not found' })
//         }
//         return res.status(404).json({ error: 'User not found' })
//     }
//     const newAlbums = filteredAlbums
//         .filter(album => album && !existingAlbumIds.includes(album.id))
//         .map(album => ({
//             albumId: album.id,
//             name: album.attributes.name || '',
//             artistName: album.attributes.artistName || '',
//             artworkUrl: album.attributes.artwork?.url || '',
//             trackCount: album.attributes.trackCount,
//             href: album.href,
//             type: album.type,
//             userId: userId,
//         }))
//     const newSongs = filteredSongs
//         .filter(song => song && !existingSongIds.includes(song.id))
//         .map(song => ({
//             songId: song.id,
//             name: song.attributes.name || '',
//             trackNumber: song.attributes.trackNumber,
//             artistName: song.attributes.artistName || '',
//             albumName: song.attributes.albumName || '',
//             durationInMillis: song.attributes.durationInMillis,
//             artworkUrl: song.attributes.artwork?.url || '',
//             userId: userId,
//         }))
//         // Filter out any song with undefined required fields
//         .filter(song => song.songId && song.name && song.artistName)
//     try {
//         // Insert new albums
//         if (newAlbums.length > 0) {
//             await prisma.album.createMany({
//                 data: newAlbums,
//             })
//         }
//         // Insert new songs
//         if (newSongs.length > 0) {
//             await prisma.song.createMany({
//                 data: newSongs,
//             })
//         }
//         // Save ratings
//         const ratingData = ratings.map(rating => ({
//             songId: rating.id,
//             value: rating.attributes.value,
//             userId: userId,
//             ratedAt: rating.attributes.ratedAt || new Date().toISOString(), // Use the actual date if available
//         }))
//         if (ratingData.length > 0) {
//             await prisma.rating.createMany({
//                 data: ratingData,
//             })
//         }
//         if (!responseSent) {
//             responseSent = true
//             res.status(200).json({
//                 message: 'Library, songs, and ratings saved successfully!',
//             })
//         }
//     } catch (error) {
//         console.error('Error saving albums, songs, or ratings:', error)
//         if (!res.headersSent) {
//             res.status(500).json({
//                 error: 'Failed to save albums, songs, or ratings',
//             })
//         }
//     }
// }
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
        res.status(200).json({ albums, songs });
    }
    catch (error) {
        console.error('Error fetching user library:', error);
        res.status(500).send('Error fetching user library');
    }
};
