import React, { FC, useState, useMemo } from 'react'
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
    const [addresses, setAddresses] = useState([""]);

    const handleAddAddress = () => {
        setAddresses([...addresses, ""]);
    };

    const handleRemoveAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const handleAddressChange = (index, value) => {
        const updated = [...addresses];
        updated[index] = value;
        setAddresses(updated);
    };

    return (
        <div className={styles.page} id="login-page">
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <i className="fas fa-user"></i>
                    <h2>Личные данные</h2>
                </div>
                <form id="profile-form">
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Фамилия</label>
                            <input type="text" id="lastName" name="lastName" required/>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">Имя</label>
                            <input type="text" id="firstName" name="firstName" required/>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="middleName">Отчество</label>
                        <input type="text" id="middleName" name="middleName"/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="birthDate">Дата рождения</label>
                        <input type="date" id="birthDate" name="birthDate"/>
                    </div>

                    <div className={styles.addressesSection}>
                        <div className={styles.sectionHeader}>
                            <h3>Адреса доставки</h3>
                            <button type="button" className="btn btn-secondary" onClick={handleAddAddress}>
                                <i className="fas fa-plus"></i>
                                Добавить адрес
                            </button>
                        </div>

                        <div className={styles.addressList}>
                            {addresses.map((address, index) => (
                                <div key={index} className={styles.addressItem}>
                                    <div className={styles.addressInputRow}>
                                    <input
                                        type="text"
                                        placeholder="Введите адрес"

                                        value={address}
                                        onChange={(e) => handleAddressChange(index, e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        className={styles.btnDanger}
                                        onClick={() => handleRemoveAddress(index)}
                                    >
                                        x
                                    </button>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>


                    <button type="submit" className={styles.btnFull}>
                        <i className="fas fa-save"></i>
                        Сохранить данные
                    </button>
                </form>
            </div>


        </div>


    )
}

export default Hero
