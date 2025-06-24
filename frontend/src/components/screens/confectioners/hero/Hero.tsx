// Общая структура календарей: Месяц (общий) и Неделя (личный)
import React, {useState, useEffect} from "react";
import styles from './Hero.module.scss'
import cn from 'classnames'
import Sidebar from '@/screens/adminOrderDetails/elements/SideBar';
import {formatDateParts, getDateString} from "@/screens/confectioners/functions/functions";
import {allOrders, mockConfectioners, weeklyOrders} from "@/screens/confectioners/data/data";
import ConfectionerCard from "@/screens/confectioners/elements/ConfectionerCard";
import {apiGet} from '@/utils/apiInstance'
import {ConfectionerCalendar} from "../../../../models/responses/Calendar";
import {Confectioner} from "../../../../models/responses/User";


const MAX_HOURS_PER_DAY = 16;

const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
};

const getProgressForConfectioner = (dateStr: string, confectioner: Confectioner) => {
    const [h, m] = confectioner.busy_time.split(':').map(Number);
    const decimalHours = h + (m / 60);

    return Math.min((decimalHours / MAX_HOURS_PER_DAY) * 100, 100);
};

const loadDisabledDays = (): string[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("disabledDays");
    return saved ? JSON.parse(saved) : [];
};

const saveDisabledDays = (days: string[]) => {
    localStorage.setItem("disabledDays", JSON.stringify(days));
};

const Hero: React.FC = () => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [disabledDays, setDisabledDays] = useState<string[]>([]);
    const [confectionerCalendar, setConfectionerCalendar] = useState<ConfectionerCalendar>(null);

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
    const monthDays = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const loadCalendar = () => {
        let dateFrom = formatDateParts(currentYear, currentMonth + 1, 1)
        let dateTo = formatDateParts(currentYear, currentMonth + 1, monthDays.length)
        apiGet('/api/users/confectioners/calendar?date_from=' + dateFrom + '&date_to=' + dateTo)
            .then((response) => {
                if (response.data != undefined) {
                    setConfectionerCalendar(response.data);
                }
            }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        loadCalendar()
    }, [currentMonth]);

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


    return (isClient ?
            <div className={styles.container}>
                <div className={styles.order_page}>
                    <Sidebar/>

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
                                            {confectionerCalendar?.dates.find((d) => d.date === dateStr)?.confectioners
                                                .map((c, i) => {
                                                    const progress = getProgressForConfectioner(dateStr, c);
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
                                    <ConfectionerCard key={confectioner.name} confectioner={confectioner}/>
                                ))}
                            </div>
                        </section>
                    </section>
                </div>
            </div> : ''
    );
};


export default Hero;
