import React, {FC, useState} from 'react';
import styles from './Hero.module.scss';
import cn from 'classnames';
import instance, {apiPost} from "@/utils/apiInstance";
import {router} from "next/client";
import Sidebar from '../elements/SideBar';
const CreateCake: FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        composition: '',
        description: ''
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Загружаем изображение
            let imageId;
            if (image) {
                const formDataImg = new FormData();
                formDataImg.append('image', image);

                const imgResponse = await instance.post('/api/images', formDataImg);
                imageId = imgResponse.data.id;
            }

            // 2. Создаем торт
            const cakeResponse = await apiPost('/api/ready-cakes', {
                name: formData.name,
                price: parseFloat(formData.price),
                composition: formData.composition,
                description: formData.description
            });
            const cakeId = cakeResponse.data.id;

            // 3. Связываем изображение с тортом
            if (imageId) {
                await apiPost('/api/ready-cake-image-relations', {
                    id_image: imageId,
                    id_ready_cake: cakeId
                });
            }

            // Перенаправляем после успешного создания
            router.push('/catalog');
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.order_page}>
                    <Sidebar/>

                <section className={styles.margBlock}>
                    <form onSubmit={handleSubmit} className={styles.banner}>
                        <h1 className={styles.page_title}>Создание нового товара</h1>
                        <div className={styles.order_header}>
                            <h2>Основная информация</h2>
                        </div>

                        <div className={styles.product}>
                            <div className={styles.image_wrapper}>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Предпросмотр"
                                        className={styles.img}
                                    />
                                ) : (
                                    <label className={styles.upload_area}>
                                        <span>+ Добавить изображение</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={styles.upload_input}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className={styles.main_details}>
                                <div className={styles.details}>
                                    <div className={styles.form_group}>
                                        <label>Название</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Цена (₽/кг)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={styles.form_input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Состав</label>
                                        <input
                                            type="text"
                                            name="composition"
                                            value={formData.composition}
                                            onChange={handleInputChange}
                                            className={styles.form_input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Описание</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className={styles.form_textarea}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.form_actions}>
                            <button
                                type="submit"
                                className={styles.submit_button}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Создание...' : 'Создать'}
                            </button>
                        </div>
                    </form>
                </section>
                </div>
            </div>

    );
};

export default CreateCake;
