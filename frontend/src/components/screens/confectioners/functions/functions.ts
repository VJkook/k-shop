export const getDateString = (offset = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1 + offset);
    return date.toISOString().slice(0, 10);
};

export const formatDateParts = (year: number, month: number, day: number): string => {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
};

export const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
