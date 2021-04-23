import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import { api } from '../services/api'
import { ptBR } from 'date-fns/locale'
import { secondsToTimeString } from '../utils/secondsToTimeString'

type Episode = {
    id: string
    title: string
    thumbnail: string
    description: string
    members: string
    duration: string
    durationAsString: string
    url: string
    publishedAt: string
}

type HomeProps = {
    episodes: Episode[]
}

export default function Home(props: HomeProps) {
    return (
        <div>
            <h1>Index</h1>
            <p>{ JSON.stringify(props.episodes) }</p>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get(
        'episodes',
        { params: { _limit: 12, _sort: 'published_at', _order: 'desc' } }
    )

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(
                parseISO(episode.published_at),
                'd MMM yy',
                { locale: ptBR }
            ),
            duration: Number(episode.file.duration),
            durationAsString: secondsToTimeString(Number(episode.file.duration)),
            description: episode.file.url
        }
    })

    return {
        props: { episodes },
        revalidate: 60 * 60 * 8 // In seconds
    }
}
