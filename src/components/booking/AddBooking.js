import React, { useState, useEffect } from 'react';
import { addData, getAllData } from '../../api/index';
import { Routes } from '../../api/apiRoutes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Checkout from '../payment/Checkout';
import { useNavigate } from 'react-router-dom';

const AddBooking = () => {

  const [service, setService] = useState(''); //store the id of service by selected services
  const [dateTime, setDateTime] = useState(''); //store the date and time
  const [latitude, setLatitude] = useState(null); //store the latitute of the user of current location
  const [longitude, setLongitude] = useState(null); //store the longitude of the user of current location

  const [services, setServices] = useState([]); //store services list
  const [providers, setProviders] = useState([]); //store providers list
  
  const [selectedProvider, setSelectedProvider] = useState(null); //store the id of provider by selected provider
  const [price, setPrice] = useState(null); //store the price
  const [gettingLocation, setGettingLocation] = useState(false); //loader --> indicate that location is getting
  const [gettingProviders, setGettingProviders] = useState(false); //loader --> indicate that providers is getting from database
  const [bookingId, setBookingId] = useState(null); //store the booking id when new booking will made after this id will store in payment table
  const [paymentIntent, setPaymentIntent] = useState(null); //store the payment intent of stripe 

  const [showPaymentDialog, setShowPaymentDialog] = useState(false); //show the payment dialog
  const [loading, setLoading] = useState(false); // Add loading state when user will click on procced to payment button

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; //get from local storge check its available not


  //Stripe public key--change here with your own key 
  //Note this payment will be made for testing purpose
  //Keys can get from this url https://dashboard.stripe.com/test/dashboard
  const stripePromise = loadStripe('pk_test_51JnTzBHrgaPpoWwj711yNMtd6lyFth4BuknB3psdcVBgIAew1RNiwFbcD2yuXCbktZdrD8BDtyghxdgIFxxkHYDF00gKYKKez3'); // Replace with your Stripe public key


  useEffect(() => {
    //non-auth users will redirect to login page
    if (!isLoggedIn) {
      navigate('/login');
    }
    //Load bookings
    fetchServices();
  }, []);

  const handleCloseDialog = () => setShowPaymentDialog(false); // Hide the dialog

  // Fetch the services
  const fetchServices = async () => {
    const response = await getAllData(Routes.getAllServices);
    setServices(response.data?.services);
  };

  // Get the locations by clicking on button as well get the providers from database according to the user location
  const getLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatitude(latitude); //set latitude
        setLongitude(longitude); //set longitude
        setGettingLocation(false); //loader for location
        setGettingProviders(true); //loader for providers
        await fetchNearbyProviders(latitude, longitude); //fetch the providers
        setGettingProviders(false); //hide the loader of providers
      },
      (error) => {
        alert("Could not retrieve location.");
        setGettingLocation(false); //hide the loader of location
      }
    );
  };

  // fetch the provdiders
  const fetchNearbyProviders = async (latitude, longitude) => {
    const response = await addData(Routes.getNearbyProviders, { latitude, longitude });     //get the providers from database note post method is used here for posting the data you can use get method as well
    const filteredProviders = response.data.providers.filter(provider => provider.service_id == service); //find the providers by selected service
    setProviders(filteredProviders); //set the providers
  };

  // set the price of service provider as well store the id or provider
  const handleProviderChange = (e) => {
    const providerId = e.target.value;
    setSelectedProvider(providerId);
    const provider = providers.find((p) => p.id === +providerId);
    setPrice(provider ? provider.price : null);
    setBookingId(null); 
  };

  //handing booking 
  const handleBooking = async () => {
    if (!service || !dateTime || !selectedProvider) {
      alert('Please select all required fields');
      return;
    }

    setLoading(true); // Set loading to true

    try {
      // Send details to backend to create payment intent and add the booking details into booking table
      if (bookingId == null) {
        const response = await addData(Routes.addBooking, {
          user_id: +localStorage.getItem("userId"),
          provider_id: +selectedProvider,
          date_time: dateTime,
          latitude: latitude,
          longitude: longitude,
          address: `${latitude}, ${longitude}`,
        });
        console.log("Booking Response:", response);

        if (response && response.data?.isBooked) {
          setBookingId(response.data.bookingId);
          const amount = Math.round(price * 100); // Convert price to cents
          //create the payment intent stripe js not adding the here in database you can use get method as well
          const responsePaymentIntent = await addData(Routes.createPaymentIntent, { amount });
          console.log("Payment Intent Response:", responsePaymentIntent);

          if (responsePaymentIntent.data.isPaymentIntentCreated) {
            setPaymentIntent(responsePaymentIntent.data.clientSecret);
            setShowPaymentDialog(true);
          }
        }
      } else {
        setShowPaymentDialog(true);
      }
    } catch (error) {
      console.error("Error during booking or payment creation:", error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  //add payment record into database this method will called in checkout component
  const addPayment = async () => {
    const data = {
      booking_id: bookingId,
      payment_method: 'card',
      amount: price,
      currency: 'cad',
      payment_status: 'paid'
    };

    const response = await addData(Routes.addPayment, data);
    console.log("Add Payment Response");
    console.log(response);
  }

  return (
    <div className="container mt-5">
      <form className="border p-4 rounded bg-light shadow">
        <h4 className="text-primary">Add Booking</h4>
        <div className="mb-3">
          <label className="form-label">Select Service</label>
          <select className="form-select" value={service} onChange={(e) => { setService(e.target.value); setProviders([]); setPrice(null); setBookingId(null) }}>
            <option value="">Select Service</option>
            {services?.map((serviceItem) => (
              <option key={serviceItem.id} value={serviceItem.id}>
                {serviceItem.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date and Time</label>
          <input type="datetime-local" className="form-control" value={dateTime} onChange={(e) => { setDateTime(e.target.value); setBookingId(null) }} />
        </div>
        <div className="mb-3">
          <label className="form-label">Select Provider</label>
          <div className="row">
            <div className="col-sm-12 col-lg-3 mb-4">
              <button
                className="btn btn-primary w-100"
                onClick={getLocation}
                disabled={!service || gettingLocation || gettingProviders || providers.length > 0}
              >
                {gettingLocation
                  ? 'Getting location...'
                  : gettingProviders
                    ? 'Providers Loading...'
                    : providers.length > 0
                      ? 'Providers Loaded'
                      : 'Find Providers Near By'}
              </button>
            </div>
            <div className="col-sm-12 col-lg-9">
              <select className="form-select" value={selectedProvider} onChange={handleProviderChange}>
                <option value="">Select Provider</option>
                {providers?.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.distance ? `${provider.distance.toFixed(2)} km away` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          {price && <div className="me-3">Charges: <strong>CAD ${price}</strong></div>}
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-primary" onClick={handleBooking} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>

      {paymentIntent && (
        <Elements stripe={stripePromise}>
          <Checkout clientSecret={paymentIntent}
            show={showPaymentDialog}
            onClose={handleCloseDialog}
            addPayment={addPayment}
          />
        </Elements>
      )}
    </div>
  );
};

export default AddBooking;
