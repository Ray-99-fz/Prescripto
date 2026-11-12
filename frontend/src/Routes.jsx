import { createBrowserRouter } from 'react-router-dom';
import Doctors from './pages/Doctors';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import AppLayout from './layouts/AppLayout';

export const router = createBrowserRouter([
    {
        path: "/",
        Component: AppLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/doctors",
                Component: Doctors
            },
            {
                path: "/doctors/:speciality",
                Component: Doctors
            },
            {
                path: "/about",
                Component: About
            },
            {
                path: "/contact",
                Component: Contact
            },
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/my-profile",
                Component: MyProfile
            },
            {
                path: "/my-appointments",
                Component: MyAppointments
            },
            {
                path: "/appointment/:doctorId",
                Component: Appointment
            }
        ]
    }
]);