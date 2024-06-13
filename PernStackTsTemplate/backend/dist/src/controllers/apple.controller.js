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
export const updateLibrary = async (req, res) => {
    const { userId, appleMusicToken } = req.body;
    const albums = [];
    let responseSent = false;
    console.log('dev token: ', process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN);
    console.log('userId: ', userId);
    console.log('applemusictoken: ', appleMusicToken);
    const fetchAlbums = async (url) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': appleMusicToken,
                },
            });
            const data = res.data;
            console.log('data: ', data);
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
    const initialUrl = 'https://api.music.apple.com/v1/me/library/albums';
    await fetchAlbums(initialUrl);
    if (responseSent)
        return;
    // Fetch existing album IDs to avoid duplicates
    const existingAlbumIds = (await prisma.album.findMany({
        where: {
            albumId: {
                in: albums.map(album => album.id),
            },
        },
        select: {
            albumId: true,
        },
    })).map(album => album.albumId);
    // Fetch the user's library ID
    const userLibrary = await prisma.library.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!userLibrary) {
        if (!responseSent) {
            responseSent = true;
            return res.status(404).json({ error: 'User library not found' });
        }
        return res.status(404).json({ error: 'User library not found' });
    }
    const newAlbums = albums
        .filter(album => !existingAlbumIds.includes(album.id))
        .map(album => ({
        albumId: album.id,
        name: album.attributes.name,
        artistName: album.attributes.artistName || '',
        artworkUrl: album.attributes.artwork?.url || '',
        trackCount: album.attributes.trackCount,
        href: album.href,
        type: album.type,
        libraryId: userLibrary.id,
    }));
    try {
        // Insert new albums
        if (newAlbums.length > 0) {
            await prisma.album.createMany({
                data: newAlbums,
            });
        }
        // Associate all albums with the user's library
        await prisma.library.update({
            where: { id: userLibrary.id },
            data: {
                albums: {
                    connect: albums.map(album => ({ albumId: album.id })),
                },
            },
        });
        if (!responseSent) {
            responseSent = true;
            res.status(200).json({ message: 'Albums saved successfully!' });
        }
    }
    catch (error) {
        console.error('Error saving albums:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to save albums' });
        }
    }
};
export const getLibrary = async (req, res) => {
    const { userId } = req.body;
    const albums = [];
    console.log(userId);
    const userLibrary = await prisma.library.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!userLibrary) {
        return res
            .status(400)
            .json({ message: "User library ID is required, can't be found" });
    }
    const returnAlbums = async (userLibrary) => {
        try {
            const result = await prisma.library.findUnique({
                where: {
                    id: userLibrary,
                },
                select: {
                    albums: true,
                },
            });
            if (result && result != null) {
                // console.log('result:', result)
                res.status(200).json(result);
            }
            else {
                res.status(404).json({ message: 'albums not found' });
            }
        }
        catch (error) {
            console.error('Error fetching albums:', error);
            res.status(500).send('Error fetching albums');
        }
    };
    await returnAlbums(userLibrary.id);
};
