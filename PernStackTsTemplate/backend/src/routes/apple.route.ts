import express from 'express'
import {
    saveToken,
    getToken,
    fetchAndSaveAlbumsHandler,
    fetchAndSaveSongsHandler,
    fetchAndSaveRatingsHandler,
    fetchAndSaveAlbumRatingsHandler,
    addSongsToRatingsHandler,
    getRatings,
    getLibrary,
    updateAlbumArtwork,
    addToLibrary,
} from '../controllers/apple.controller.js'
import protectRoute from '../middleware/protectRoute.js'
import axios from 'axios'

const app = express()
app.use(express.json())

const router = express.Router()

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/save-token
router.post('/save-token', protectRoute, saveToken)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/add-to-library
router.post('/add-to-library', protectRoute, addToLibrary)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/update-album-artwork
router.post('/update-album-artwork', protectRoute, updateAlbumArtwork)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-token
router.post('/get-token', protectRoute, getToken)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-albums
router.post('/fetch-albums', protectRoute, fetchAndSaveAlbumsHandler)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-songs
router.post('/fetch-songs', protectRoute, fetchAndSaveSongsHandler)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-song-ratings
router.post('/fetch-song-ratings', protectRoute, fetchAndSaveRatingsHandler)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-album-ratings
router.post(
    '/fetch-album-ratings',
    protectRoute,
    fetchAndSaveAlbumRatingsHandler
)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/add-songs-to-ratings
router.post('/add-songs-to-ratings', protectRoute, addSongsToRatingsHandler)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-ratings
router.post('/get-ratings', protectRoute, getRatings)

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-library
router.post('/get-library', protectRoute, getLibrary)

//Resolve URL redirect

router.get('/resolve-url', async (req, res) => {
    console.log('resolving url')
    const url = req.query.url
    if (typeof url !== 'string') {
        return res.status(400).send('Invalid URL')
    }

    try {
        const response = await axios.head(url, { maxRedirects: 10 })
        res.json({ finalUrl: response.request.res.responseUrl })
    } catch (error: any) {
        console.error('Error resolving URL:', error.message)

        if (error.response) {
            console.error('Response data:', error.response.data)
            console.error('Response status:', error.response.status)
            console.error('Response headers:', error.response.headers)
        } else if (error.request) {
            console.error(
                'Request made but no response received:',
                error.request
            )
        } else {
            console.error('Error in setting up the request:', error.message)
        }

        res.status(500).send('Error resolving URL')
    }
})

export default router
