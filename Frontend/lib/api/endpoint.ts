export const API = {
    AUTH: {
        REGISTER: "/api/v1/customer/register",
        LOGIN: "/api/v1/customer/login",
        GET_PROFILE: "/api/v1/customer/getProfile",
        UPDATE: "/api/v1/customer/update",
        REQUEST_PASSWORD_RESET: '/api/v1/customer/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/v1/customer/reset-password/${token}`,
    },
    ADMIN: {
        USERS: {
            GET_ALL: "/api/v1/admin",
            GET_BY_ID: (id: string) => `/api/v1/admin/${id}`,
            CREATE: "/api/v1/admin",
            UPDATE: (id: string) => `/api/v1/admin/${id}`,
            UPDATE_PASSWORD: (id: string) => `/api/v1/admin/${id}/password`,
            DELETE: (id: string) => `/api/v1/admin/${id}`,
        }
    },

    RESTAURANT: {
        GET_ALL: "/api/v1/restaurant",
        GET_BY_ID: (id: string) => `/api/v1/restaurant/${id}`,
        CREATE: "/api/v1/restaurant/create",
        GET_MY: "/api/v1/restaurant/my/restaurant",
        UPDATE: (id: string) => `/api/v1/restaurant/update/${id}`,
        DELETE: (id: string) => `/api/v1/restaurant/delete/${id}`,
    },


    MENU: {
        GET_BY_RESTAURANT: (restaurantId: string) => `/api/v1/menu/restaurant/${restaurantId}`,
        GET_AVAILABLE: (restaurantId: string) => `/api/v1/menu/restaurant/${restaurantId}/available`,
        GET_BY_CATEGORY: (restaurantId: string, category: string) => `/api/v1/menu/restaurant/${restaurantId}/category/${category}`,
        GET_BY_ID: (id: string) => `/api/v1/menu/${id}`,
        CREATE: (restaurantId: string) => `/api/v1/menu/create/${restaurantId}`,
        UPDATE: (id: string) => `/api/v1/menu/update/${id}`,
        TOGGLE: (id: string) => `/api/v1/menu/toggle/${id}`,
        DELETE: (id: string) => `/api/v1/menu/delete/${id}`,
    },

    ORDER: {
        CREATE: "/api/v1/order/create",
        GET_MY: "/api/v1/order/my",
        GET_BY_ID: (id: string) => `/api/v1/order/${id}`,
        GET_BY_RESTAURANT: (restaurantId: string) => `/api/v1/order/restaurant/${restaurantId}`,
        GET_BY_DRIVER: (driverId: string) => `/api/v1/order/driver/${driverId}`,
        UPDATE: (id: string) => `/api/v1/order/update/${id}`,
        UPDATE_STATUS: (id: string) => `/api/v1/order/status/${id}`,
        ASSIGN_DRIVER: (id: string) => `/api/v1/order/assign-driver/${id}`,
        CANCEL: (id: string) => `/api/v1/order/cancel/${id}`,
    },

    REVIEW: {
        CREATE: "/api/v1/review/create",
        GET_MY: "/api/v1/review/my/reviews",
        GET_BY_ID: (id: string) => `/api/v1/review/${id}`,
        GET_BY_RESTAURANT: (restaurantId: string) => `/api/v1/review/restaurant/${restaurantId}`,
        GET_BY_DRIVER: (driverId: string) => `/api/v1/review/driver/${driverId}`,
        UPDATE: (id: string) => `/api/v1/review/update/${id}`,
        DELETE: (id: string) => `/api/v1/review/delete/${id}`,
    },

    PAYMENT: {
        ADD_CARD: "/api/v1/payment/card",
        ADD_ESEWA: "/api/v1/payment/esewa",

        GET_ALL: "/api/v1/payment",
        GET_BY_ID: (id: string) => `/api/v1/payment/${id}`,

        UPDATE: (id: string) => `/api/v1/payment/${id}`,

        SET_DEFAULT: (id: string) => `/api/v1/payment/${id}/default`,

        DELETE: (id: string) => `/api/v1/payment/${id}`,
    },
} as const;