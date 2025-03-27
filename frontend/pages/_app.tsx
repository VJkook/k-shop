import '../src/styles/global.scss'
import type { AppProps } from 'next/app'
import MainProvider from '../src/providers/MainProvider'
import { TypeComponentAuthFields } from '@/shared/types/auth.types'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
type TypeAppProps = AppProps & TypeComponentAuthFields
export default function App({ Component, pageProps }: TypeAppProps) {
	const router = useRouter()

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			//@ts-ignore
			if (window['ym']) {
				//@ts-ignore
				window['ym']('XXXXXXX', 'hit', url)
			}
		}

		// Добавляем слушатель для отслеживания изменений маршрута
		router.events.on('routeChangeComplete', handleRouteChange)

		// Убираем слушатель, когда компонент размонтируется
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	return (
		<MainProvider Component={Component}>
			<Component {...pageProps} />
		</MainProvider>
	)
}
