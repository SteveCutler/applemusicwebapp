import axios from 'axios'
import React from 'react'
import { useStore } from '../../store/store'
import { XMLParser } from 'fast-xml-parser'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ImportPodcasts = () => {
    const [file, setFile] = useState<File | null>(null)
    const { backendToken, setPodSubs } = useStore(state => ({
        backendToken: state.backendToken,
        setPodSubs: state.setPodSubs,
    }))
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0])
        }
    }

    const userId = backendToken

    const getSubs = async () => {
        const userId = backendToken
        try {
            const response = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-subs',

                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                    }),
                    credentials: 'include',
                }
            )

            const data = await response.json()
            console.log('podSubs', data)
            setPodSubs(data)
        } catch (error) {
            console.error('Error subscribing to podcast:', error)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setUploading(true)
        if (!file) return

        const reader = new FileReader()
        reader.onload = async e => {
            const content = e.target?.result as string
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '',
            })
            const parsedData = parser.parse(content)

            console.log(parsedData) // Log the structure of parsedData

            // Adjust the extraction logic based on the actual structure
            let feeds = []
            if (
                parsedData.opml &&
                parsedData.opml.body &&
                parsedData.opml.body.outline &&
                parsedData.opml.body.outline.outline
            ) {
                feeds = parsedData.opml.body.outline.outline.map(
                    (item: any) => ({
                        title: item.title,
                        xmlUrl: item.xmlUrl,
                    })
                )
            }
            const urls = []
            feeds.map(item => item.xmlUrl && urls.push(item.xmlUrl))
            console.log('urls', urls)

            if (urls.length > 0) {
                try {
                    const response = await fetch(
                        'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/podcast-by-url',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                urls,
                                userId,
                            }),
                            credentials: 'include',
                        }
                    )

                    const data = await response.json()
                    console.log('response data', data)
                    if (response.status == 200) {
                        setUploading(false)
                        setSuccess(true)
                        getSubs()
                    } else {
                        setUploading(false)

                        setFailure(true)
                    }
                } catch (error) {
                    setFailure(true)
                    setUploading(false)
                    console.error('Error importing podcasts', error)
                }
            } else {
                setFailure(true)
                setUploading(false)
                console.error('No valid feeds found in the OPML file')
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="bg-blue-500 text-white w-96  border-2 border-white font-semibold p-7 rounded-lg flex flex-col justify-center m-3 text-center mx-auto gap-3 items-center">
            Upload the OPML file here
            <form
                className="flex flex-col justify-center mt-5 items-center w-full mx-auto gap-1"
                onSubmit={e => {
                    success
                        ? e.preventDefault()
                        : uploading
                          ? e.preventDefault()
                          : e.preventDefault()
                    handleSubmit(e)
                }}
            >
                <div>
                    <input
                        type="file"
                        accept=".opml,.txt"
                        onChange={handleFileChange}
                        className="mx-auto text-center block w-full"
                    />
                </div>
                <button
                    className={`rounded-full block w-full mt-5 bg-white p-1 ${success ? 'text-green-400 hover:cursor-default ' : failure ? 'text-red-500 ' : uploading ? 'text-blue-400 ' : 'text-blue-400 hover:text-blue-600  active:scale-95'} `}
                    type="submit"
                >
                    {success
                        ? 'success!'
                        : failure
                          ? 'error'
                          : uploading
                            ? 'uploading...'
                            : 'Upload'}
                </button>
            </form>
        </div>
    )
}

export default ImportPodcasts
