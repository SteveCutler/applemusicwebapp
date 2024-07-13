declare module 'podcast-index-api' {
    type PodcastIndexApi = {
        episodesByFeedId: (
            feedId: number,
            since?: number,
            max?: number,
            fulltext?: boolean
        ) => Promise<any>
        // Add other methods if needed
    }

    function createPodcastIndexApi(key: string, secret: string): PodcastIndexApi
    export = createPodcastIndexApi
}
