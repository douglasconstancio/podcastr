import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '../../services/api'
import { secondsToTimeString } from '../../utils/secondsToTimeString'

import styles from './episode.module.scss'

type Episode = {
    id: string
    title: string
    thumbnail: string
    description: string
    members: string
    duration: number
    durationAsString: string
    url: string
    publishedAt: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps ) {

    return (
        <div className={ styles.episode }>
            <div className={ styles.thumbnailContainer }>
                <Link href='/'>
                    <button>
                        <img src='/arrow-left.svg' alt='Voltar'/>
                    </button>
                </Link>
                <Image
                    width={ 700 }
                    height={ 160 }
                    src={ episode.thumbnail }
                    objectFit='cover'
                />
                <button>
                    <img src='/play.svg' alt='Tocar episódio'/>
                </button>
            </div>

            <header>
                <h1>{ episode.title }</h1>
                <span>{ episode.members }</span>
                <span>{ episode.publishedAt }</span>
                <span>{ episode.durationAsString }</span>
            </header>

            <div
                className={ styles.description }
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    )
}

/**
 * When Path is empty at the build time, the next does not episode in a static way
 * fallback: false -> if not generated from the 404 build
 * fallback: true -> load on the client side
 * fallback: blocking -> load the nodejs side
 */
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api(
        '/episodes',
        { params: { _limit: 2, _sort: 'published_at', _order: 'desc' } }
    )

    const paths = data.map(episode => {
        return {
            params: { slug: episode.id }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(
            parseISO(data.published_at),
            'd MMM yy',
            { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: secondsToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: { episode },
        revalidate: 60 * 60 * 24 //24 hours
    }
}
