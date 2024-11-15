import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { useNavigate } from 'react-router-dom';


const Checkout = ({ show, onClose, addPayment, clientSecret }) => {

  const stripe = useStripe(); //stripe js
  const elements = useElements(); //stripe js
  const [error, setError] = useState(null); //store the error if any regrading stirpe js
  const [succeeded, setSucceeded] = useState(false); //show the success message of payment
  const [processing, setProcessing] = useState(false); //loader---> indicate that payment being process

  const navigate = useNavigate(); //navigate the page

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setSucceeded(true);
      setProcessing(false);
      addPayment();
      onClose();
      alert('Your booking has been received successfully.');
      navigate('/view-booking');

    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? 'show' : ''}`}
        style={{
          display: show ? 'block' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="paymentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="paymentModalLabel">Payment Information</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <CardElement />
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={processing || succeeded}
                >
                  {processing ? 'Processing...' : 'Pay'}
                </button>
              </form>
              {error && <div className="text-danger mt-2">{error}</div>}
              {succeeded && <div className="text-success mt-2">Payment Successful!</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default Checkout;
