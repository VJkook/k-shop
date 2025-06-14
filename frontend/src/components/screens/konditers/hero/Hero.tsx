// Общая структура календарей: Месяц (общий) и Неделя (личный)
import React, { useState, useEffect } from "react";
import styles from './Hero.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import Sidebar  from '@/screens/adminOrderDetails/elements/SideBar';
const mockConfectioners = [
    {
        name: "Анна",
        specialty: "Торты",
        experience: "Эксперт",
        status: "available",
        description: "Специализируется на многоярусных тортах",
        image: "/anna.jpg" // или URL из вашего хранилища
    },
    {
        name: "Игорь",
        specialty: "Пирожные",
        experience: "Старший",
        status: "available",
        description: "Авторские десерты и пирожные",
        image: "/igor.jpg"
    },
    {
        name: "Света",
        specialty: "Эклеры",
        experience: "Мастер",
        status: "busy",
        description: "Лучшие эклеры в городе",
        image: "/sveta.jpg"
    },
];

const allOrders = [
    { date: "2025-06-10", confectioner: "Анна", hours: 3, details: "Торт 'Наполеон'" },
    { date: "2025-06-10", confectioner: "Игорь", hours: 5, details: "Капкейки" },
    { date: "2025-06-11", confectioner: "Анна", hours: 4, details: "Эклеры" },
    { date: "2025-06-11", confectioner: "Света", hours: 2, details: "Пирожные" },
];

const MAX_HOURS_PER_DAY = 8;

const weeklyOrders = {
    "2025-06-09": [
        "Торт 'Наполеон' — 12:00 (Анна)",
        "Капкейки — 15:30 (Игорь)"
    ],
    "2025-06-11": [
        "Эклеры — 10:00 (Анна)",
        "Пирожные — 14:00 (Света)"
    ],
};
const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
};

const getDateString = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1 + offset);
    return date.toISOString().slice(0, 10);
};

const getProgressForConfectioner = (dateStr: string, confectioner: string) => {
    const totalHours = allOrders
        .filter(order => order.date === dateStr && order.confectioner === confectioner)
        .reduce((sum, order) => sum + order.hours, 0);
    return Math.min((totalHours / MAX_HOURS_PER_DAY) * 100, 100);
};

const loadDisabledDays = (): string[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("disabledDays");
    return saved ? JSON.parse(saved) : [];
};

const saveDisabledDays = (days: string[]) => {
    localStorage.setItem("disabledDays", JSON.stringify(days));
};

const ConfectionerCard = ({ confectioner }: { confectioner: typeof mockConfectioners[0] }) => {
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
                {confectioner.description.split('. ').map((item, i) => (
                    item && <li key={i}>{item.trim()}</li>
                ))}
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


const Hero: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [disabledDays, setDisabledDays] = useState<string[]>([]);

    useEffect(() => {
        setDisabledDays(loadDisabledDays());
    }, []);

    const toggleDisabledDay = (dateStr: string) => {
        let updated: string[];
        if (disabledDays.includes(dateStr)) {
            updated = disabledDays.filter(d => d !== dateStr);
        } else {
            updated = [...disabledDays, dateStr];
        }
        setDisabledDays(updated);
        saveDisabledDays(updated);
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const currentDateString = today.toISOString().slice(0, 10);



    return (

        <div className={styles.container}>
            <div className={styles.order_page}>
            <Sidebar />

            <section className={styles.margBlock}>

            {/* Общий календарь на месяц */}
            <section className={styles.monthCalendar}>
                <div className={styles.monthCalendarHeader}>
                    <h2>Общий календарь (месяц)</h2>
                    <div className={styles.monthCalendarHeaderNav}>
                        <button onClick={prevMonth}>←</button>
                        <span>{new Date(currentYear, currentMonth).toLocaleDateString("ru-RU", {
                            month: "long",
                            year: "numeric"
                        })}</span>
                        <button onClick={nextMonth}>→</button>
                    </div>
                </div>
                <div className={styles.monthCalendarGrid}>
                    {[...Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)].map((_, idx) => (
                        <div key={"empty-" + idx}></div>
                    ))}
                    {monthDays.map((day) => {
                        const dateStr = new Date(currentYear, currentMonth, day).toISOString().slice(0, 10);
                        const isToday = dateStr === currentDateString;
                        return (
                            <div
                                key={day}
                                className={cn(styles.dayCell, isToday && styles.today)}
                            >
                                <div>{day}</div>
                                {mockConfectioners.map((c, i) => {
                                    const progress = getProgressForConfectioner(dateStr, c.name);
                                    const progressClass = progress < 50
                                        ? 'low'
                                        : progress >= 50 && progress < 80
                                            ? 'medium'
                                            : 'high';
                                    return (
                                        <div key={i}>
                                            <span>{c.name}</span>
                                            <div className={styles.progressBarWrapper}>
                                                <div
                                                    className={cn(
                                                        styles.progressBar,
                                                        styles[progressClass]
                                                    )}
                                                    style={{width: `${progress.toFixed(0)}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Личный календарь (неделя) */}
            <section className={styles.weekCalendar}>
                <h2>Личный календарь (неделя)</h2>
                <div className={styles.weekCalendarGrid}>
                    {Array.from({length: 7}, (_, i) => {
                        const dateStr = getDateString(i);
                        const date = new Date(dateStr);
                        const label = date.toLocaleDateString("ru-RU", {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit"
                        });
                        const isToday = dateStr === currentDateString;
                        const isDisabled = disabledDays.includes(dateStr);

                        return (
                            <div
                                key={i}
                                onClick={(e) => {
                                    if (e.altKey) {
                                        toggleDisabledDay(dateStr);
                                    } else {
                                        setSelectedDay(dateStr);
                                    }
                                }}
                                className={cn(
                                    styles.weekCalendarDay,
                                    isToday && styles.today,
                                    isDisabled && styles.disabled
                                )}
                            >
                                <div>{label}</div>
                            </div>
                        );
                    })}
                </div>

                {selectedDay && !disabledDays.includes(selectedDay) && (
                    <div className={styles.weekCalendarOrders}>
                        <h3>
                            Заказы на {new Date(selectedDay).toLocaleDateString("ru-RU", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        })}
                        </h3>
                        <ul>
                            {(weeklyOrders[selectedDay] || ["Нет заказов"]).map((order, i) => (
                                <li key={i}>{order}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Карточки кондитеров */}
            <section className={styles.confectioners}>
                <h2>Наши кондитеры</h2>
                <div className={styles.confectionersGrid}>
                    {mockConfectioners.map((confectioner) => (
                        <ConfectionerCard key={confectioner.name} confectioner={confectioner} />
                    ))}
                </div>
            </section>
            </section>
            </div>
        </div>
    );
};


export default Hero;
