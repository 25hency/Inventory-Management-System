const initialState = {
    loading: false,
    cartItems: [],
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING':
            return {
                ...state,
                loading: true,
            };
        case 'HIDE_LOADING':
            return {
                ...state,
                loading: false,
            };
        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if (existingItem) {
                // Check if adding one more would exceed stock
                if (existingItem.quantity >= existingItem.stock) {
                    return state;
                }
                return {
                    ...state,
                    cartItems: state.cartItems.map(item => 
                        item._id === action.payload._id 
                        ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
                        : item
                    ),
                };
            }
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cartItems: state.cartItems.map(item => 
                    item._id === action.payload._id 
                    ? { ...item, quantity: Math.min(action.payload.quantity, item.stock) }
                    : item
                ),
            };
        case 'DELETE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(product => product._id !== action.payload._id),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};
