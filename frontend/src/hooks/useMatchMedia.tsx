import { useState, useEffect } from 'react'

const useMatchMedia = (query: string) => {
	const [isMatch, setIsMatch] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${query}px)`)
		const handleResize = () => setIsMatch(mediaQuery.matches)

		handleResize() // Проверяем начальное состояние

		mediaQuery.addListener(handleResize) // Добавляем слушателя события изменения размера окна

		return () => {
			mediaQuery.removeListener(handleResize) // Удаляем слушателя при размонтировании компонента
		}
	}, [query])

	return isMatch
}

export default useMatchMedia
