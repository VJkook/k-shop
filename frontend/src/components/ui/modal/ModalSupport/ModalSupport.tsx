import React, {useEffect, useState} from 'react'
import styles from './ModalSupport.module.scss'
import { EIcons, Icon as IconInstance } from '../../../../assets/icons/icon'
import cn from 'classnames'
import InputMask from 'react-input-mask'
import { useFormik } from 'formik'
import themelight from '../../../../styles/colors'
import Link from 'next/link'
import {apiLogin} from "@/utils/apiInstance";
import {router} from "next/client";

interface ModalProps {
	isOpen: boolean
	onClose: () => void
}

const ModalSupport: React.FC<ModalProps> = ({ isOpen, onClose }) => {
	const [isClosing, setIsClosing] = useState(false)
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')

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

	const login = async (email: string, password: string) => {
        apiLogin(email, password)
            .then((response) => {
                if (response.data != undefined) {
                    console.log(response.data)
                    console.log('Авторизация прошла успешно')
                }
            }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setIsClosing(true)
            router.push('/catalog')
        })
	}

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
					<p className={styles.label}>Введите почту:</p>
					<form >
						<InputMask
							maskChar=" "
							type="text"
							name="email"
							placeholder="example@email.com"
							className={styles.custom_input}
                            onChange={event => setEmail(event.target.value)}
						/>
                        <InputMask
                            maskChar=" "
                            type="text"
                            name="password"
                            placeholder="пароль"
                            className={styles.custom_input}
                            onChange={event => setPassword(event.target.value)}
                        />
						<label className={styles.checkbox_container}>
							<input
								type="checkbox"
								name="consent"
								className={styles.checkbox}
							/>
							<p>
								<Link href={'/'}>
									Вы соглашаетесь на обработку персональных данных
								</Link>
							</p>
						</label>
                        <button onClick={() => login(email, password)}>Войти</button>
					</form>
				</div>
			</div>
		</noindex>
	)
}

export default ModalSupport
