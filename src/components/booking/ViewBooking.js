import React, { useState, useEffect } from 'react';
import { getAllData, editData } from '../../api/index';
import { Routes } from '../../api/apiRoutes';
import { useNavigate } from 'react-router-dom';

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]); //store the booking list

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); //loader --> fetching the booking list frm database
  const [bookingStatusLoading, setBookingStatusLoading] = useState({}); // loader---> Track on every td that we are chaning the status of booking in databse

  const userRole = localStorage.getItem("userRole"); //get the user role from storage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // get the loggedIn status from local storage
  
  const navigate = useNavigate(); // navigate the page

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    loadBookings(currentPage);
  }, [currentPage]);

  //load the bookings 
  //booking will be get all for admin
  //bookings will be get according to the userId that status is accepted, proccessing, completed --->(pending) not will get that's payment are not made  
  const loadBookings = async (page) => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const url = userRole === "admin"
      ? `${Routes.getAllBookings}?page=${page}`
      : `${Routes.getBookingsByUserId}/${userId}?page=${page}`;

    const response = await getAllData(url);
    setBookings(response?.data?.data);
    setTotalPages(response?.data?.last_page);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //change the status of booking 
  
  const handleStatusChange = async (bookingId, newStatus) => {
    if (!newStatus) {
      alert('Please select a valid status');
      return;
    }

    // Set loading state for this booking
    setBookingStatusLoading((prevState) => ({ ...prevState, [bookingId]: true }));
    
    await editData(`${Routes.editBookingStatus}/${bookingId}`, { status: newStatus });

    // Reset loading state for this booking
    setBookingStatusLoading((prevState) => ({ ...prevState, [bookingId]: false }));

    loadBookings(currentPage); // Refresh bookings after status update
  };

  return (
    <div className="container mt-5">
      <h4 className="text-primary mb-4">{userRole === "admin" ? 'All Bookings' : 'My Bookings'}</h4>

      {loading && <div className="text-center mb-2">Loading...</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Provider</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Location</th>
            {userRole === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No bookings found</td>
            </tr>
          ) : (
            bookings?.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking?.provider?.name}</td>
                <td>{new Date(booking.date_time).toLocaleString()}</td>
                <td>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}</td>
                <td>{`${booking.latitude}, ${booking.longitude}`}</td>
                
                {userRole === "admin" && booking.status !== "pending" ? (
                  <td key={booking.id}>
                    {bookingStatusLoading[booking.id] ? (
                      <td>Changing...</td>
                    ) : (
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="form-select"
                      >
                        <option value="">--- Change Status ---</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </td>
                ) : userRole === "admin" ? (
                  <td>Unpaid Payment can't process</td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="align-self-center">Page {currentPage} of {totalPages}</span>

        <button
          className="btn btn-primary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewBooking;
