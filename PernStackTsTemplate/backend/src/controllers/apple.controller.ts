import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
const prisma = new PrismaClient()

import bcryptjs from 'bcryptjs'

type AlbumType = {
    attributes: AttributeObject
    relationships: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: Number
}
type RelationshipObject = {
    tracks: TracksObject
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    durationInMillis: Number
    name: string
    releasedDate: string
    trackCount: Number
    playParams: PlayParameterObject
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}

type ArtworkObject = {
    height: Number
    width: Number
    url: string
}

export const saveToken = async (req: Request, res: Response) => {
    // console.log(req.body)
    const { userId, userToken, tokenExpiryDate } = req.body

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                appleMusicToken: userToken,
                tokenExpiryDate,
            },
        })
        res.status(201).send('Token save succesfully!')
    } catch (error) {
        console.error('Error saving token:', error)
        res.status(500).send('Error updating token')
    }
}

export const getToken = async (req: Request, res: Response) => {
    const { userId } = req.body

    try {
        const result = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                appleMusicToken: true,
                tokenExpiryDate: true,
            },
        })
        if (result && result != null) {
            console.log('result:', result)
            res.status(200).json(result)
        } else {
            res.status(404).json({ message: 'token not found' })
        }
    } catch (error) {
        console.error('Error saving token:', error)
        res.status(500).send('Error updating token')
    }
}
export const getLibrary = async (req: Request, res: Response) => {
    const { userId, userToken } = req.body
    const albums: AlbumType[] = []

    const fetchAlbums = async (url: string) => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_MUSICKIT_DEVELOPER_TOKEN}`,
                    'Music-User-Token': userToken,
                },
            })
            const data = res.data
            console.log('data: ', data)
            albums.push(...data.data)

            if (data.next) {
                await fetchAlbums(data.next)
            }
        } catch (error) {
            console.error('Failed to fetch albums:', error)
            res.status(500).json({ error: 'Failed to fetch albums' })
        }
    }

    const initialUrl = 'https://api.music.apple.com/v1/me/library/albums'
    await fetchAlbums(initialUrl)

    const formattedAlbums = albums.map(album => ({
        albumId: album.id,
        name: album.attributes.name,
        artistName: album.attributes.artistName,
        artworkUrl: album.attributes.artwork.url,
        trackCount: album.attributes.trackCount,
        library: {
            connectOrCreate: {
                where: { id: userId },
                create: { id: userId },
            },
        },
    }))

    await saveAlbumsToDB(userId, formattedAlbums)

    res.json({ success: true, albums: formattedAlbums })
}

const saveAlbumsToDB = async (userId: string, albums: any) => {
    try {
        await prisma.album.createMany({
            data: albums,
        })
        console.log('Albums saved successfully!')
    } catch (error) {
        console.error('Error saving albums:', error)
        throw error
    }
}
