import { useState } from 'react';
import { api } from '../api/endpoints';
import { toastError, toastSuccess } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPaymentSession = async (plan) => {
    setLoading(true);
    try {
      const response = await api.payments.createSession({ plan });

      if (response.url) {
        // In a real implementation, redirect to Stripe Checkout
        window.open(response.url, '_blank');
        toastSuccess('Redirecting to payment...');
      }

      return response;
    } catch (error) {
      toastError('Failed to create payment session');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (sessionId) => {
    setLoading(true);
    try {
      const response = await api.payments.verify({ sessionId });

      if (response.ok) {
        toastSuccess('Payment successful! Welcome to your new plan.');
        navigate('/app/plan');
      }

      return response;
    } catch (error) {
      toastError('Payment verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (plan) => {
    setLoading(true);
    try {
      const response = await api.payments.simulate({ plan });

      if (response.ok) {
        toastSuccess(`Successfully upgraded to ${plan} plan! This is a demo payment.`);
        navigate('/app/plan');

        // Refresh the page to update the user data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      return response;
    } catch (error) {
      toastError('Simulation failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPaymentSession,
    verifyPayment,
    simulatePayment
  };
};