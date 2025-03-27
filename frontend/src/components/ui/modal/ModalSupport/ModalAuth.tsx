import React, { useEffect, useState } from 'react'
import styles from './ModalAuth.module.scss'
import { EIcons, Icon as IconInstance } from '../../../../assets/icons/icon'
import cn from 'classnames'
import InputMask from 'react-input-mask'
import { useFormik } from 'formik'
import themelight from '../../../../styles/colors'
import Link from 'next/link'
import { apiGet, apiPost } from '@/utils/apiInstance'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

const ModalAuth: React.FC<ModalProps> = ({ isOpen, onClose }) => {
	const [isClosing, setIsClosing] = useState(false)
	const [reg, setReg] = useState(false)
	const [pending, setPending] = useState(false)

	const notify = (msg: string) => {
		toast.error(msg)
	}

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

	const auth = async () => {
		setPending(true)
		try {
			const res = await axios.post(`http://localhost:8083/login`, {
				login: formik.values.login,
				password: formik.values.password,
			})
			setPending(false)
			console.log(res)
			if (res.status === 200) {
				localStorage.setItem('auth', res.data.token)
				localStorage.setItem('id', res.data.id)
				window.location.reload()
			} else {
				notify(res.data.description)
			}
		} catch (error) {
			console.error(`Error:`, error)
		}
	}

	const onSubmit = async (values: any) => {
		if (reg) {
			try {
				setPending(true)
				const res = await axios.post(`http://localhost:8083/register`, {
					firstName: formik.values.firstName,
					lastName: formik.values.lastName,
					login: formik.values.login,
					password: formik.values.password,
				})
				setPending(false)
				console.log(res)
				if (res.status === 200) {
					localStorage.setItem('auth', res.data.token)
					localStorage.setItem('id', res.data.id)
					window.location.reload()
				} else {
					notify(res.data.description)
				}
			} catch (error) {
				console.error(`Ошибка при отправке данных:`, error)
			}
		} else {
			auth()
		}
	}

	const initialValues = {
		phoneNumber: '',
		firstName: '',
		lastName: '',
		login: '',
		password: '',
		consent: false,
	}

	const validate = (values: any) => {
		const errors: any = {}
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
				{reg ? (
					<div className={styles.modal}>
						<p className={styles.title}>Регистрация</p>
						<form onSubmit={formik.handleSubmit}>
							<input
								type="text"
								name="firstName"
								placeholder="Введите Ваше Имя"
								className={styles.custom_input}
								value={formik.values.firstName}
								onChange={formik.handleChange}
							/>
							<input
								type="text"
								name="lastName"
								placeholder="Введите Вашу Фамилию"
								className={styles.custom_input}
								value={formik.values.lastName}
								onChange={formik.handleChange}
							/>
							<input
								type="text"
								name="login"
								placeholder="Введите логин"
								className={styles.custom_input}
								value={formik.values.login}
								onChange={formik.handleChange}
							/>
							<input
								type="password"
								name="password"
								placeholder="Введите пароль"
								className={styles.custom_input}
								value={formik.values.password}
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
								disabled={
									!formik.isValid ||
									formik.values.firstName === '' ||
									formik.values.lastName === '' ||
									formik.values.login === '' ||
									formik.values.password === '' ||
									!formik.values.consent ||
									pending
								}
								type={'submit'}
							>
								Войти
							</button>
							<p style={{ alignSelf: 'center' }} onClick={() => setReg(false)}>
								Уже есть аккаунт?
							</p>
						</form>
					</div>
				) : (
					<div className={styles.modal}>
						<p className={styles.title}>Авторизация</p>
						<form onSubmit={formik.handleSubmit}>
							{/*<InputMask*/}
							{/*	mask="+7 (999) 999-99-99"*/}
							{/*	maskChar=" "*/}
							{/*	type="text"*/}
							{/*	name="phoneNumber"*/}
							{/*	placeholder="Номер телефона"*/}
							{/*	className={styles.custom_input}*/}
							{/*	value={formik.values.phoneNumber}*/}
							{/*	onChange={formik.handleChange}*/}
							{/*/>*/}
							<input
								type="text"
								name="login"
								placeholder="Введите логин"
								className={styles.custom_input}
								value={formik.values.login}
								onChange={formik.handleChange}
							/>
							<input
								type="password"
								name="password"
								placeholder="Введите пароль"
								className={styles.custom_input}
								value={formik.values.password}
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
								disabled={
									!formik.isValid ||
									formik.values.login === '' ||
									formik.values.password === '' ||
									!formik.values.consent ||
									pending
								}
								type={'submit'}
							>
								Войти
							</button>
							<p style={{ alignSelf: 'center' }} onClick={() => setReg(true)}>
								Зарегистрироваться
							</p>
						</form>
					</div>
				)}
			</div>
		</noindex>
	)
}

export default ModalAuth
