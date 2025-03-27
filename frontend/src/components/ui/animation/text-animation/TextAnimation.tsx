import React, { Component } from 'react'
import styles from '@/ui/animation/text-animation/TextAnimation.module.scss'

interface TextAnimationProps {
	texts: string[]
}

interface TextAnimationState {
	currentIndex: number
	isTyping: boolean
	text: string
}

class TextAnimation extends Component<TextAnimationProps, TextAnimationState> {
	private texts: string[]
	private typingSpeed: number = 150 // Скорость набора текста (в миллисекундах)
	private eraseSpeed: number = 50 // Скорость стирания текста (в миллисекундах)
	private pauseBetweenTexts: number = 1000 // Задержка перед появлением следующего текста (в миллисекундах)

	constructor(props: TextAnimationProps) {
		super(props)
		this.state = {
			currentIndex: 0,
			isTyping: true,
			text: '',
		}
		this.texts = props.texts
	}

	componentDidMount() {
		this.animateText()
	}

	animateText = () => {
		const { currentIndex } = this.state
		const currentText = this.texts[currentIndex]

		if (this.state.isTyping) {
			if (this.state.text.length < currentText.length) {
				this.setState(prevState => ({
					text: currentText.slice(0, prevState.text.length + 1),
				}))
				setTimeout(this.animateText, this.typingSpeed)
			} else {
				this.setState({ isTyping: false })
				setTimeout(this.animateText, this.pauseBetweenTexts)
			}
		} else {
			if (this.state.text.length > 0) {
				this.setState(prevState => ({
					text: prevState.text.slice(0, -1),
				}))
				setTimeout(this.animateText, this.eraseSpeed)
			} else {
				this.setState(prevState => ({
					currentIndex: (prevState.currentIndex + 1) % this.texts.length,
					isTyping: true,
				}))
				setTimeout(this.animateText, this.typingSpeed)
			}
		}
	}

	render() {
		return (
			<div className={styles.textContainer}>
				<div className={styles.text}>
					<span className={styles.animatedText}>{this.state.text}</span>
					<span className={styles.line}>|</span>
				</div>
			</div>
		)
	}
}

export default TextAnimation
