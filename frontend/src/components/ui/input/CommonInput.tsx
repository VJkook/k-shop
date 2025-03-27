import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import InputMask from 'react-input-mask'
import ModalSupport from '@/ui/modal/ModalSupport/ModalSupport'
import CommonButton from '@/ui/button/CommonButton'
import styles from './CommonInput.module.scss'
import themelight from '../../../styles/colors'
import useMatchMedia from '@/hooks/useMatchMedia'

interface CommonInputProps {
	palette?: 'primary' | 'orange'
}

const CommonInput: FC<CommonInputProps> = ({ palette }) => {
	const isMobile = useMatchMedia('768')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const initialValues = {
		name: '',
		phoneNumber: '',
		consent: false,
		isValidForm: false,
	}

	const validate = (values: any) => {
		const errors: any = {}
		if (!values.name) {
			errors.name = 'Введите имя'
		} else if (!/^[а-яёЁА-Я\s]+$/i.test(values.name.trim())) {
			errors.name = 'Имя должно содержать только русские буквы'
		}
		if (!values.phoneNumber) {
			errors.phoneNumber = 'Введите корректный номер телефона'
		}
		if (!values.consent) {
			errors.consent = 'Необходимо дать согласие'
		}
		return errors
	}

	const onSubmit = async (values: any) => {
		try {
			const response = await fetch(``, {
				method: 'POST',
			})
			if (response.ok) {
				console.log('Данные успешно отправлены', response)
				setIsModalOpen(true)
				setTimeout(() => formik.resetForm(), 1000)
			} else {
				console.error('Ошибка при отправке данных:', response.statusText)
			}
		} catch (error) {
			console.error('Ошибка при отправке данных:', error)
		}
	}

	const formik = useFormik({
		initialValues,
		onSubmit,
		validate,
	})

	useEffect(() => {
		const isValidForm =
			formik.values.name !== '' &&
			formik.values.phoneNumber !== '' &&
			formik.values.phoneNumber.replace(/[()-]/g, '').trim().length === 14 &&
			/^[а-яёЁА-Я\s]+$/i.test(formik.values.name.trim()) &&
			formik.values.consent
		formik.setFieldValue('isValidForm', isValidForm)
	}, [formik.values])

	return (
		<div className={styles.main_container}>
			<form onSubmit={formik.handleSubmit}>
				<div className={styles.input_container}>
					<div className={styles.input}>
						<input
							type="text"
							name="name"
							placeholder="Введите Ваше Имя"
							className={styles.custom_input}
							value={formik.values.name}
							onChange={formik.handleChange}
							style={{
								background:
									isMobile || palette === 'primary' ? '#F5F5F5' : '#FFFFFF',
							}}
						/>
						<InputMask
							mask="+7 (999) 999-99-99"
							maskChar=" "
							type="text"
							name="phoneNumber"
							placeholder="Номер телефона"
							className={styles.custom_input}
							value={formik.values.phoneNumber}
							onChange={formik.handleChange}
							style={{
								background:
									isMobile || palette === 'primary' ? '#F5F5F5' : '#FFFFFF',
							}}
						/>
					</div>
					<label className={styles.checkbox_container}>
						<input
							type="checkbox"
							name="consent"
							className={styles.checkbox}
							checked={formik.values.consent}
							onChange={formik.handleChange}
							style={{
								color:
									palette === 'primary'
										? themelight.color.btn_primary
										: themelight.color.btn_orange,
							}}
						/>
						<p>
							Вы соглашаетесь на обработку персональных данных и обязуетесь
							соблюдать условия{' '}
							<span
								style={{
									color:
										palette === 'primary'
											? themelight.color.btn_primary
											: themelight.color.btn_orange,
								}}
							>
								<Link href={'/info/agreement'}>
									Пользовательского соглашения
								</Link>
							</span>
						</p>
					</label>
					<CommonButton
						size={'l'}
						color={palette}
						disabled={
							!formik.isValid || !formik.values.isValidForm || isModalOpen
						}
						type={'submit'}
					>
						Связаться
					</CommonButton>
				</div>
			</form>
			{isModalOpen ? (
				<ModalSupport
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			) : null}
		</div>
	)
}

export default CommonInput
