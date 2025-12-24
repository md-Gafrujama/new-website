'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import adminApi from '../../../components/lib/adminApi';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function RevenuePage() {
  // Revenue/Payment states
  const [payments, setPayments] = useState([]);
  const [revenueStats, setRevenueStats] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    invoiceNumber: '',
    transactionId: '',
  });
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [deletingPayment, setDeletingPayment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch all project requests
  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        adminApi.getWebsiteRequests({ limit: 10000 }),
        adminApi.getMobileAppRequests({ limit: 10000 }),
        adminApi.getCloudHostingRequests({ limit: 10000 }),
        adminApi.getCrmSolutionRequests({ limit: 10000 }),
        adminApi.getHrmsSolutionRequests({ limit: 10000 }),
        adminApi.getAiContentRequests({ limit: 10000 }),
        adminApi.getDigitalMarketingRequests({ limit: 10000 }),
        adminApi.getLmsRequests({ limit: 10000 }),
        adminApi.getEcommerceRequests({ limit: 10000 }),
        adminApi.getBrandingDesignRequests({ limit: 10000 }),
        adminApi.getSaasProductRequests({ limit: 10000 }),
        adminApi.getHealthcareRequests({ limit: 10000 })
      ]);

      const projects = [];

      // Website requests
      if (results[0].status === 'fulfilled' && results[0].value.success) {
        const requests = results[0].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'website',
            name: req.businessName || req.fullName || 'Website Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // Mobile app requests
      if (results[1].status === 'fulfilled' && results[1].value.success) {
        const requests = results[1].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'mobile',
            name: req.appName || req.businessName || 'Mobile App Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // Cloud hosting requests
      if (results[2].status === 'fulfilled' && results[2].value.success) {
        const requests = results[2].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'cloud',
            name: req.businessName || 'Cloud Hosting Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // CRM requests
      if (results[3].status === 'fulfilled' && results[3].value.success) {
        const requests = results[3].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'crm',
            name: req.companyName || 'CRM Solution Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // HRMS requests
      if (results[4].status === 'fulfilled' && results[4].value.success) {
        const requests = results[4].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'hrms',
            name: req.companyName || 'HRMS Solution Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // AI Content requests
      if (results[5].status === 'fulfilled' && results[5].value.success) {
        const requests = results[5].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'ai',
            name: req.businessName || 'AI Content Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // Digital Marketing requests
      if (results[6].status === 'fulfilled' && results[6].value.success) {
        const requests = results[6].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'digital',
            name: req.businessName || 'Digital Marketing Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.monthlyBudget || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // LMS requests
      if (results[7].status === 'fulfilled' && results[7].value.success) {
        const requests = results[7].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'lms',
            name: req.institutionName || 'LMS Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // E-commerce requests
      if (results[8].status === 'fulfilled' && results[8].value.success) {
        const requests = results[8].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'ecommerce',
            name: req.businessName || 'E-commerce Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // Branding Design requests
      if (results[9].status === 'fulfilled' && results[9].value.success) {
        const requests = results[9].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'branding',
            name: req.businessName || 'Branding Design Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // SaaS Product requests
      if (results[10].status === 'fulfilled' && results[10].value.success) {
        const requests = results[10].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'saas',
            name: req.productName || 'SaaS Product Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      // Healthcare requests
      if (results[11].status === 'fulfilled' && results[11].value.success) {
        const requests = results[11].value.data?.data?.requests || [];
        requests.forEach(req => {
          projects.push({
            id: req._id,
            type: 'healthcare',
            name: req.organizationName || 'Healthcare Project',
            clientName: req.fullName,
            email: req.email,
            budget: req.budgetRange || 'Not specified',
            status: req.status,
            estimatedValue: 0
          });
        });
      }

      setAllProjects(projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const response = await adminApi.getAllPayments({ limit: 1000 });
      if (response.success) {
        setPayments(response.data?.data?.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const response = await adminApi.getRevenueStats();
      if (response.success) {
        setRevenueStats(response.data?.data || null);
      }
    } catch (err) {
      console.error('Error fetching revenue stats:', err);
    }
  };

  useEffect(() => {
    fetchAllProjects();
    fetchPayments();
    fetchRevenueStats();
  }, []);

  const handleOpenPaymentModal = (project) => {
    setSelectedProject(project);
    setPaymentForm({
      amount: '',
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'pending',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: '',
      invoiceNumber: '',
      transactionId: '',
    });
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      const paymentData = {
        projectId: selectedProject.id,
        projectType: selectedProject.type,
        projectName: selectedProject.name,
        clientName: selectedProject.clientName,
        clientEmail: selectedProject.email,
        amount: parseFloat(paymentForm.amount),
        currency: paymentForm.currency,
        paymentMethod: paymentForm.paymentMethod,
        paymentStatus: paymentForm.paymentStatus,
        paymentDate: paymentForm.paymentDate,
        notes: paymentForm.notes,
        invoiceNumber: paymentForm.invoiceNumber,
        transactionId: paymentForm.transactionId,
        projectBudget: selectedProject.budget,
        totalProjectValue: selectedProject.estimatedValue || null,
      };

      const response = await adminApi.createPayment(paymentData);
      if (response.success) {
        alert('Payment added successfully!');
        setShowPaymentModal(false);
        setSelectedProject(null);
        fetchPayments();
        fetchRevenueStats();
      } else {
        alert(`Failed to add payment: ${response.error}`);
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentForm({
      amount: payment.amount?.toString() || '',
      currency: payment.currency || 'USD',
      paymentMethod: payment.paymentMethod || 'Bank Transfer',
      paymentStatus: payment.paymentStatus || 'pending',
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: payment.notes || '',
      invoiceNumber: payment.invoiceNumber || '',
      transactionId: payment.transactionId || '',
    });
    setShowEditModal(true);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!editingPayment) return;

    setUpdatingPayment(editingPayment._id);
    try {
      const updateData = {
        amount: parseFloat(paymentForm.amount),
        currency: paymentForm.currency,
        paymentMethod: paymentForm.paymentMethod,
        paymentStatus: paymentForm.paymentStatus,
        paymentDate: paymentForm.paymentDate,
        notes: paymentForm.notes,
        invoiceNumber: paymentForm.invoiceNumber,
        transactionId: paymentForm.transactionId,
      };

      const response = await adminApi.updatePayment(editingPayment._id, updateData);
      if (response.success) {
        alert('Payment updated successfully!');
        setShowEditModal(false);
        setEditingPayment(null);
        fetchPayments();
        fetchRevenueStats();
      } else {
        alert(`Failed to update payment: ${response.error}`);
      }
    } catch (err) {
      console.error('Error updating payment:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const handleQuickStatusUpdate = async (paymentId, newStatus) => {
    setUpdatingPayment(paymentId);
    try {
      const response = await adminApi.updatePayment(paymentId, { paymentStatus: newStatus });
      if (response.success) {
        // Optimistically update the local state
        setPayments(prevPayments =>
          prevPayments.map(p =>
            p._id === paymentId ? { ...p, paymentStatus: newStatus } : p
          )
        );
        fetchRevenueStats();
      } else {
        alert(`Failed to update status: ${response.error}`);
        fetchPayments(); // Refresh on error
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert(`Error: ${err.message}`);
      fetchPayments(); // Refresh on error
    } finally {
      setUpdatingPayment(null);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    setDeletingPayment(paymentId);
    try {
      const response = await adminApi.deletePayment(paymentId);
      if (response.success) {
        alert('Payment deleted successfully!');
        setPayments(prevPayments => prevPayments.filter(p => p._id !== paymentId));
        fetchRevenueStats();
      } else {
        alert(`Failed to delete payment: ${response.error}`);
      }
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setDeletingPayment(null);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Revenue</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Revenue Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Track payments and revenue for all projects
                </p>
              </div>
              <button
                onClick={() => {
                  fetchPayments();
                  fetchRevenueStats();
                  fetchAllProjects();
                }}
                disabled={loadingPayments || loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <ArrowPathIcon className={`h-5 w-5 ${loadingPayments || loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Revenue Stats Cards */}
            {revenueStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CurrencyDollarIcon className="h-8 w-8" />
                    <span className="text-emerald-100 text-sm">Total Revenue</span>
                  </div>
                  <p className="text-3xl font-bold">
                    ${(revenueStats.overall?.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-emerald-100 text-sm mt-1">
                    {revenueStats.overall?.totalPayments || 0} payments
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <BanknotesIcon className="h-8 w-8" />
                    <span className="text-blue-100 text-sm">Avg Payment</span>
                  </div>
                  <p className="text-3xl font-bold">
                    ${Math.round(revenueStats.overall?.averagePayment || 0).toLocaleString()}
                  </p>
                  <p className="text-blue-100 text-sm mt-1">Per transaction</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <ChartBarIcon className="h-8 w-8" />
                    <span className="text-purple-100 text-sm">Total Payments</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {revenueStats.overall?.totalPayments || 0}
                  </p>
                  <p className="text-purple-100 text-sm mt-1">Completed</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircleIcon className="h-8 w-8" />
                    <span className="text-orange-100 text-sm">Active Projects</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {allProjects.filter(p => p.status === 'in-progress' || p.status === 'completed').length}
                  </p>
                  <p className="text-orange-100 text-sm mt-1">With payments</p>
                </div>
              </div>
            )}

            {/* Projects List with Payment Option */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select Project to Add Payment
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {allProjects.length} projects available
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <ArrowPathIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allProjects
                      .filter(p => p.status !== 'pending')
                      .map((project) => {
                        const projectPayments = payments.filter(
                          p => p.projectId === project.id && p.projectType === project.type
                        );
                        const totalPaid = projectPayments
                          .filter(p => p.paymentStatus === 'completed')
                          .reduce((sum, p) => sum + (p.amount || 0), 0);
                        
                        return (
                          <div
                            key={`${project.type}-${project.id}`}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {project.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {project.clientName}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                project.status === 'in-progress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {project.budget}
                                </span>
                              </div>
                              {totalPaid > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ${totalPaid.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {projectPayments.length > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Payments:</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {projectPayments.length}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleOpenPaymentModal(project)}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                            >
                              <PlusIcon className="h-5 w-5" />
                              Add Payment
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  All Payments ({payments.length})
                </h3>
                {payments.length > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()} {payments[0]?.currency || 'USD'}
                  </div>
                )}
              </div>
              
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <BanknotesIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No payments recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Project</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Client</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Method</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">{payment.projectName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{payment.projectType}</div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{payment.clientName}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {payment.currency} {payment.amount?.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{payment.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <select
                              value={payment.paymentStatus}
                              onChange={(e) => handleQuickStatusUpdate(payment._id, e.target.value)}
                              disabled={updatingPayment === payment._id}
                              className={`px-2 py-1 text-xs rounded-full border-0 font-semibold cursor-pointer transition-all ${
                                payment.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                payment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                payment.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                              <option value="refunded">Refunded</option>
                            </select>
                            {updatingPayment === payment._id && (
                              <ArrowPathIcon className="h-3 w-3 inline-block ml-1 animate-spin" />
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditPayment(payment)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit Payment"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(payment._id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Payment"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add Payment
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitPayment} className="p-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Project Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Project:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedProject.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Client:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedProject.clientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedProject.budget}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedProject.status}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={paymentForm.currency}
                      onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method *
                    </label>
                    <select
                      required
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={paymentForm.paymentStatus}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={paymentForm.invoiceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="INV-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="TXN-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Additional notes about this payment..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Payment Modal */}
        {showEditModal && editingPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Payment
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPayment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdatePayment} className="p-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Project:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{editingPayment.projectName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Client:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{editingPayment.clientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{editingPayment._id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={paymentForm.currency}
                      onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method *
                    </label>
                    <select
                      required
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={paymentForm.paymentStatus}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={paymentForm.invoiceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="INV-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="TXN-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Additional notes about this payment..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updatingPayment === editingPayment._id}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingPayment === editingPayment._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      'Update Payment'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingPayment(null);
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrashIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to delete this payment? This will permanently remove the payment record from the system.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePayment(showDeleteConfirm)}
                  disabled={deletingPayment === showDeleteConfirm}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {deletingPayment === showDeleteConfirm ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

