const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getRevenueStats,
  getPaymentsByProject
} = require('../controllers/paymentController');

// Create a new payment
router.post('/', createPayment);

// Get all payments
router.get('/', getAllPayments);

// Get revenue statistics
router.get('/stats', getRevenueStats);

// Get payments by project
router.get('/project', getPaymentsByProject);

// Get payment by ID
router.get('/:id', getPaymentById);

// Update payment
router.put('/:id', updatePayment);
router.patch('/:id', updatePayment);

// Delete payment
router.delete('/:id', deletePayment);

module.exports = router;

