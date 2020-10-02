import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:5000/bookings?email='+loggedInUser.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => setBookings(data))
    }, [])
    return (
        <div>
            <h4>You have: {bookings.length} bookings</h4>
            {
                bookings.map(bk => <li key={bk._id}>{bk.name} from: {(new Date(bk.checkIn).toDateString('dd/MM/yyyy'))} to {(new Date(bk.checkOut)).toDateString("MM-dd-yyyy")}</li>)
            }
        </div>
    );
};

export default Bookings;