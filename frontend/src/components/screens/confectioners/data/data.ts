export const allOrders = [
    { date: "2025-06-10", confectioner: "Анна", hours: 3, details: "Торт 'Наполеон'" },
    { date: "2025-06-10", confectioner: "Игорь", hours: 5, details: "Капкейки" },
    { date: "2025-06-11", confectioner: "Анна", hours: 4, details: "Эклеры" },
    { date: "2025-06-11", confectioner: "Света", hours: 2, details: "Пирожные" },
];

export const weeklyOrders = {
    "2025-06-09": [
        "Торт 'Наполеон' — 12:00 (Анна)",
        "Капкейки — 15:30 (Игорь)"
    ],
    "2025-06-11": [
        "Эклеры — 10:00 (Анна)",
        "Пирожные — 14:00 (Света)"
    ],
};

export const mockConfectioners = [
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