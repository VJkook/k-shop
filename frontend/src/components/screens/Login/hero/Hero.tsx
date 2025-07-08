import React, { FC, useState } from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import { apiLogin } from '@/utils/apiInstance'
import { useRouter } from 'next/router'

const Hero: FC = () => {
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await apiLogin(email, password)
            if (response.data) {
                console.log('Авторизация прошла успешно')
                await router.push('/orders')
                router.reload()
            }
        } catch (error) {
            console.error(error)
            setError('Неверный email или пароль')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.page} id="login-page">
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <i></i>
                    <h2>Вход в личный кабинет</h2>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form id="login-form" onSubmit={login}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className="fas fa-envelope input-icon"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className="fas fa-lock input-icon"></i>
                    </div>
                    <button
                        type="submit"
                        className={styles.btnFull}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Загрузка...'
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                Войти
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Hero
