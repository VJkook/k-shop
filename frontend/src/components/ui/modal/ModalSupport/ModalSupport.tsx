import React, { useEffect } from 'react'
import styles from './ModalSupport.module.scss'
import { EIcons, Icon as IconInstance } from '../../../../assets/icons/icon'
import cn from 'classnames'
import InputMask from 'react-input-mask'
import { useFormik } from 'formik'
import themelight from '../../../../styles/colors'
import Link from 'next/link'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

const ModalSupport: React.FC<ModalProps> = ({ isOpen, onClose }) => {
	const [isClosing, setIsClosing] = React.useState(false)

	useEffect(() => {
		if (!isOpen) {
			setIsClosing(true)
			setTimeout(() => {
				setIsClosing(false)
			}, 300)
		}
	}, [isOpen])

	const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.target === event.currentTarget) {
			setIsClosing(false)
			onClose()
		}
	}

	const onSubmit = async (values: any) => {
		try {
			const response = await fetch(``, {
				method: 'POST',
			})
			if (response.ok) {
				console.log('Данные успешно отправлены', response)
				onClose
				setTimeout(() => formik.resetForm(), 1000)
			} else {
				console.error('Ошибка при отправке данных:', response.statusText)
			}
		} catch (error) {
			console.error('Ошибка при отправке данных:', error)
		}
	}

	const initialValues = {
		phoneNumber: '',
		consent: false,
		isValidForm: false,
	}

	const validate = (values: any) => {
		const errors: any = {}
		if (!values.phoneNumber) {
			errors.phoneNumber = 'Введите корректный номер телефона'
		}
		if (!values.consent) {
			errors.consent = 'Необходимо дать согласие'
		}
		return errors
	}

	const formik = useFormik({
		initialValues,
		onSubmit,
		validate,
	})

	useEffect(() => {
		const isValidForm =
			formik.values.phoneNumber !== '' &&
			formik.values.phoneNumber.replace(/[()-]/g, '').trim().length === 14 &&
			formik.values.consent
		formik.setFieldValue('isValidForm', isValidForm)
	}, [formik.values])

	return (
		<noindex>
			<div
				className={cn(styles.modalOverlay, {
					[styles.active]: isOpen,
					[styles.closing]: isClosing,
				})}
				onClick={handleClose}
			>
				<div className={styles.modal}>
					<p className={styles.title}>Авторизация</p>
					<p className={styles.label}>Введите номер телефона</p>
					<form onSubmit={formik.handleSubmit}>
						<InputMask
							mask="+7 (999) 999-99-99"
							maskChar=" "
							type="text"
							name="phoneNumber"
							placeholder="Номер телефона"
							className={styles.custom_input}
							value={formik.values.phoneNumber}
							onChange={formik.handleChange}
						/>
						<label className={styles.checkbox_container}>
							<input
								type="checkbox"
								name="consent"
								className={styles.checkbox}
								checked={formik.values.consent}
								onChange={formik.handleChange}
							/>
							<p>
								<Link href={'/'}>
									Вы соглашаетесь на обработку персональных данных
								</Link>
							</p>
						</label>
						<button
							disabled={!formik.isValid || !formik.values.isValidForm}
							type={'submit'}
						>
							Войти
						</button>
					</form>
				</div>
			</div>
		</noindex>
	)
}

export default ModalSupport
