
import {API_BASE_PATH} from '../config';

export const Routes = {  

    //bookings
    getAllBookings: `${API_BASE_PATH}/bookings/all`,
    addBooking: `${API_BASE_PATH}/bookings/add`,
    editBookingStatus: `${API_BASE_PATH}/bookings/edit`,
    getBookingsByUserId:`${API_BASE_PATH}/bookings`,
    
    //providers
    getAllProviders: `${API_BASE_PATH}/providers/all`,
    getNearbyProviders: `${API_BASE_PATH}/providers/nearby`,

    
    //services
    getAllServices: `${API_BASE_PATH}/services/all`,

    //payment
    createPaymentIntent:`${API_BASE_PATH}/payments/createPaymentIntent`,
    addPayment:`${API_BASE_PATH}/payments/add`,
    
    //auth
    authLogin: `${API_BASE_PATH}/auth/login`,
    authRegister: `${API_BASE_PATH}/auth/register`,
}