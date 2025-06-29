import React, {useState} from "react";
import styles from "@/screens/confectioners/hero/Hero.module.scss";
import Image from "next/image";
import cn from "classnames";
import {getDateString} from "@/screens/confectioners/functions/functions";
import {allOrders, mockConfectioners, weeklyOrders} from "@/screens/confectioners/data/data";
import {Confectioner} from "../../../../models/responses/User";

const ConfectionerCard = ({ confectioner }: { confectioner: Confectioner }) => {
    const [isBusy, setIsBusy] = useState(confectioner.status === "busy");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const getConfectionerOrders = (dateStr: string) => {
        return allOrders
            .filter(order => order.date === dateStr && order.confectioner === confectioner.name)
            .map(order => `${order.hours}ч работы: ${order.details}`);
    };

    const getWeeklyOrders = (dateStr: string) => {
        return weeklyOrders[dateStr]
            ? weeklyOrders[dateStr]
                .filter(item => item.includes(confectioner.name))
                .map(item => item.split(' (')[0])
            : [];
    };

    const toggleStatus = () => {
        setIsBusy(!isBusy);
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const dateStr = getDateString(i);
        const date = new Date(dateStr);
        const dayOfMonth = date.getDate();
        const hasOrders = getConfectionerOrders(dateStr).length > 0 || getWeeklyOrders(dateStr).length > 0;
        const isToday = dateStr === new Date().toISOString().slice(0, 10);

        return { dateStr, dayOfMonth, hasOrders, isToday };
    });

    return (
        <article aria-label={`Confectioner ${confectioner.name}`} className={styles.confectionerCard}>
            {/* Верхняя часть карточки с информацией о кондитере */}
            <header className={styles.confectionerCardHeader}>
                <div className={styles.confectionerCardHeaderAvatar}>
                    <Image
                        alt={`${confectioner.name} profile`}
                        className={styles.confectionerCardHeaderImage}
                        height={40}
                        width={40}
                        src={confectioner.image || "/default-confectioner.jpg"}
                    />
                </div>
                <div className={styles.confectionerCardHeaderInfo}>
                    <h2>{confectioner.name}</h2>
                    <p>{confectioner.specialty} Specialist</p>
                </div>
                <span className={cn(
                    styles.confectionerCardHeaderStatus,
                    !isBusy ? styles.available : styles.busy
                )}>
                    {!isBusy ? "Available" : "Busy"}
                </span>
            </header>

            <div className={styles.confectionerCardExperience}>
                <div className={styles.confectionerCardExperienceLabel}>
                    <i className="far fa-id-badge"></i>
                    Experience Level
                </div>
                <span className={styles.confectionerCardExperienceLevel}>
                    {confectioner.experience}
                </span>
            </div>

            <div className={styles.confectionerCardToggle}>
                <span>Mark as Busy</span>
                <label className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={isBusy}
                        onChange={toggleStatus}
                    />
                    <div className={styles.toggleSlider}></div>
                </label>
            </div>

            <ul className={styles.confectionerCardDescription}>
                {/*{confectioner.description.split('. ').map((item, i) => (*/}
                {/*    item && <li key={i}>{item.trim()}</li>*/}
                {/*))}*/}
            </ul>

            {/* Недельный календарь добавлен ПОД основной информацией */}
            <div className={styles.confectionerCardCalendar}>
                <h4>График на неделю</h4>
                <div className={styles.confectionerCardCalendarWeek}>
                    {weekDays.map((day) => (
                        <div
                            key={day.dateStr}
                            className={cn(
                                styles.confectionerCardCalendarDay,
                                day.hasOrders && styles.hasOrders,
                                day.isToday && styles.today
                            )}
                            onClick={() => setSelectedDate(day.dateStr === selectedDate ? null : day.dateStr)}
                        >
                            {day.dayOfMonth}
                        </div>
                    ))}
                </div>

                {selectedDate && (
                    <div className={styles.confectionerCardCalendarOrders}>
                        <h5>Заказы на {new Date(selectedDate).toLocaleDateString("ru-RU", {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                        })}</h5>
                        <ul>
                            {[...getConfectionerOrders(selectedDate), ...getWeeklyOrders(selectedDate)].length > 0 ? (
                                [...getConfectionerOrders(selectedDate), ...getWeeklyOrders(selectedDate)].map((order, i) => (
                                    <li key={i}>{order}</li>
                                ))
                            ) : (
                                <li>Нет заказов</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
};

export default ConfectionerCard;
