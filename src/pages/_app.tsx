import { DefaultTheme, ThemeProvider } from 'styled-components'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { Container } from '../styles/app-styles'
import GlobalStyle from '../styles/global'
import light from '../styles/themes/light'
import dark from '../styles/themes/dark'
import usePersistedState from '../utils/usePersistedState'
import NextNProgress from 'nextjs-progressbar'

import { PlayerContextProvider } from '../contexts/PlayerContext'

function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', dark)

    const toggleTheme = () => {
        setTheme(theme.title === 'light' ? dark : light)
    }

    return (
        <PlayerContextProvider>
            <ThemeProvider theme={theme}>
                <NextNProgress
                    color='#FF79C6'
                    startPosition={ 0.3 }
                    stopDelayMs={ 200 }
                    height={ 4 }
                />
                <GlobalStyle />
                <Container>
                    <main>
                        <Header toggleTheme={ toggleTheme } />
                        <Component { ...pageProps } />
                    </main>
                    <Player />
                </Container>
            </ThemeProvider>
        </PlayerContextProvider>
    )
}

export default MyApp
