export const API = {
    AUTH: {
        REGISTER: "/api/v1/customer/register",
        LOGIN: "/api/v1/customer/login",
        GET_PROFILE: "/api/v1/customer/getProfile",
        UPDATE: "/api/v1/customer/update",
    },

    RESTAURANT: {
        GET_ALL: "/api/v1/restaurant",
        GET_BY_ID: (id: string) => `/api/v1/restaurant/${id}`,
        CREATE: "/api/v1/restaurant/create",
        GET_MY: "/api/v1/restaurant/my/restaurant",
        UPDATE: (id: string) => `/api/v1/restaurant/update/${id}`,
        DELETE: (id: string) => `/api/v1/restaurant/delete/${id}`,
    },

    DRIVER: {
        GET_ALL: "/api/v1/driver",
        GET_AVAILABLE: "/api/v1/driver/available",
        GET_BY_ID: (id: string) => `/api/v1/driver/${id}`,
        CREATE: "/api/v1/driver/create",
        GET_MY: "/api/v1/driver/my/profile",
        UPDATE: (id: string) => `/api/v1/driver/update/${id}`,
        TOGGLE_AVAILABILITY: "/api/v1/driver/toggle-availability",
        DELETE: (id: string) => `/api/v1/driver/delete/${id}`,
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
} as const;