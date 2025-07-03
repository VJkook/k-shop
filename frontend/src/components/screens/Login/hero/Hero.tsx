import React, { FC } from 'react'
import styles from './Hero.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import Logo1 from '../../../../assets/img/first1.jpg'
import Birthday from '../../../../assets/img/birthday1.jpg'
import { propoData } from '@/screens/main/hero/propo-data'

interface PropoData {
	img: React.ReactNode | null
	title: string
}

const Hero: FC = () => {
	return (
        <div className={styles.page} id="login-page" >
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <i ></i>
                    <h2>Вход в личный кабинет</h2>
                </div>
                <form id="login-form">
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required/>
                        <i className="fas fa-envelope input-icon"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" id="password" name="password" required/>
                        <i className="fas fa-lock input-icon"></i>
                    </div>
                    <button type="submit" className={styles.btnFull}>
                        <i className="fas fa-sign-in-alt"></i>
                        Войти
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Hero
