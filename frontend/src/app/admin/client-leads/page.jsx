'use client';

import { useState, useEffect, useMemo } from 'react';
import adminApi from '../../../components/lib/adminApi';

// Verify adminApi is properly imported
if (!adminApi || typeof adminApi.makeRequest !== 'function') {
  console.error('AdminAPI is not properly initialized. Check the import path.');
}
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  XCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChartBarIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathRoundedSquareIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow', icon: ClockIcon },
  { value: 'reviewed', label: 'Reviewed', color: 'blue', icon: CheckCircleIcon },
  { value: 'in-progress', label: 'In Progress', color: 'orange', icon: ArrowPathIcon },
  { value: 'completed', label: 'Completed', color: 'green', icon: CheckCircleIcon },
];

const SERVICE_TABS = [
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'mobile', label: 'Mobile Apps', icon: '📱' },
  { id: 'cloud', label: 'Cloud Hosting', icon: '☁️' },
  { id: 'crm', label: 'CRM Solutions', icon: '👥' },
  { id: 'hrms', label: 'HRMS Solutions', icon: '🏢' },
  { id: 'ai', label: 'AI Content', icon: '🤖' },
  { id: 'digital', label: 'Digital Marketing', icon: '📢' },
  { id: 'lms', label: 'LMS', icon: '📚' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { id: 'branding', label: 'Branding Design', icon: '🎨' },
  { id: 'saas', label: 'SaaS Product', icon: '💼' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
];

export default function ClientLeadsPage() {
  const [activeTab, setActiveTab] = useState('website');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [websiteRequests, setWebsiteRequests] = useState([]);
  const [mobileAppRequests, setMobileAppRequests] = useState([]);
  const [cloudHostingRequests, setCloudHostingRequests] = useState([]);
  const [crmSolutionRequests, setCrmSolutionRequests] = useState([]);
  const [hrmsSolutionRequests, setHrmsSolutionRequests] = useState([]);
  const [aiContentRequests, setAiContentRequests] = useState([]);
  const [digitalMarketingRequests, setDigitalMarketingRequests] = useState([]);
  const [lmsRequests, setLmsRequests] = useState([]);
  const [ecommerceRequests, setEcommerceRequests] = useState([]);
  const [brandingDesignRequests, setBrandingDesignRequests] = useState([]);
  const [saasProductRequests, setSaasProductRequests] = useState([]);
  const [healthcareRequests, setHealthcareRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

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

      const [websiteRes, mobileRes, cloudRes, crmRes, hrmsRes, aiRes, digitalRes, lmsRes, ecommerceRes, brandingRes, saasRes, healthcareRes] = results;

      if (websiteRes.status === 'fulfilled' && websiteRes.value.success) {
        setWebsiteRequests(websiteRes.value.data?.data?.requests || []);
      }
      if (mobileRes.status === 'fulfilled' && mobileRes.value.success) {
        setMobileAppRequests(mobileRes.value.data?.data?.requests || []);
      }
      if (cloudRes.status === 'fulfilled' && cloudRes.value.success) {
        setCloudHostingRequests(cloudRes.value.data?.data?.requests || []);
      }
      if (crmRes.status === 'fulfilled' && crmRes.value.success) {
        setCrmSolutionRequests(crmRes.value.data?.data?.requests || []);
      }
      if (hrmsRes.status === 'fulfilled' && hrmsRes.value.success) {
        setHrmsSolutionRequests(hrmsRes.value.data?.data?.requests || []);
      }
      if (aiRes.status === 'fulfilled' && aiRes.value.success) {
        setAiContentRequests(aiRes.value.data?.data?.requests || []);
      }
      if (digitalRes.status === 'fulfilled' && digitalRes.value.success) {
        setDigitalMarketingRequests(digitalRes.value.data?.data?.requests || []);
      }
      if (lmsRes.status === 'fulfilled' && lmsRes.value.success) {
        setLmsRequests(lmsRes.value.data?.data?.requests || []);
      }
      if (ecommerceRes.status === 'fulfilled' && ecommerceRes.value.success) {
        setEcommerceRequests(ecommerceRes.value.data?.data?.requests || []);
      }
      if (brandingRes.status === 'fulfilled' && brandingRes.value.success) {
        setBrandingDesignRequests(brandingRes.value.data?.data?.requests || []);
      }
      if (saasRes.status === 'fulfilled' && saasRes.value.success) {
        setSaasProductRequests(saasRes.value.data?.data?.requests || []);
      }
      if (healthcareRes.status === 'fulfilled' && healthcareRes.value.success) {
        setHealthcareRequests(healthcareRes.value.data?.data?.requests || []);
      }
    } catch (err) {
      setError('Failed to fetch client leads data');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'website': return websiteRequests;
      case 'mobile': return mobileAppRequests;
      case 'cloud': return cloudHostingRequests;
      case 'crm': return crmSolutionRequests;
      case 'hrms': return hrmsSolutionRequests;
      case 'ai': return aiContentRequests;
      case 'digital': return digitalMarketingRequests;
      case 'lms': return lmsRequests;
      case 'ecommerce': return ecommerceRequests;
      case 'branding': return brandingDesignRequests;
      case 'saas': return saasProductRequests;
      case 'healthcare': return healthcareRequests;
      default: return [];
    }
  };

  const getStatusUpdateMethod = (type) => {
    // Use bind to ensure methods have correct 'this' context
    const methods = {
      website: adminApi.updateWebsiteRequestStatus.bind(adminApi),
      mobile: adminApi.updateMobileAppRequestStatus.bind(adminApi),
      cloud: adminApi.updateCloudHostingRequestStatus.bind(adminApi),
      crm: adminApi.updateCrmSolutionRequestStatus.bind(adminApi),
      hrms: adminApi.updateHrmsSolutionRequestStatus.bind(adminApi),
      ai: adminApi.updateAiContentRequestStatus.bind(adminApi),
      digital: adminApi.updateDigitalMarketingRequestStatus.bind(adminApi),
      lms: adminApi.updateLmsRequestStatus.bind(adminApi),
      ecommerce: adminApi.updateEcommerceRequestStatus.bind(adminApi),
      branding: adminApi.updateBrandingDesignRequestStatus.bind(adminApi),
      saas: adminApi.updateSaasProductRequestStatus.bind(adminApi),
      healthcare: adminApi.updateHealthcareRequestStatus.bind(adminApi),
    };
    return methods[type];
  };

  const getDeleteMethod = (type) => {
    const methods = {
      website: adminApi.deleteWebsiteRequest.bind(adminApi),
      mobile: adminApi.deleteMobileAppRequest.bind(adminApi),
      cloud: adminApi.deleteCloudHostingRequest.bind(adminApi),
      crm: adminApi.deleteCrmSolutionRequest.bind(adminApi),
      hrms: adminApi.deleteHrmsSolutionRequest.bind(adminApi),
      ai: adminApi.deleteAiContentRequest.bind(adminApi),
      digital: adminApi.deleteDigitalMarketingRequest.bind(adminApi),
      lms: adminApi.deleteLmsRequest.bind(adminApi),
      ecommerce: adminApi.deleteEcommerceRequest.bind(adminApi),
      branding: adminApi.deleteBrandingDesignRequest.bind(adminApi),
      saas: adminApi.deleteSaasProductRequest.bind(adminApi),
      healthcare: adminApi.deleteHealthcareRequest.bind(adminApi),
    };
    return methods[type];
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    // Don't update if status hasn't changed
    const currentRequest = getCurrentRequests().find(r => r._id === requestId);
    if (!currentRequest || currentRequest.status === newStatus) {
      return;
    }

    // Store the old status in case we need to revert
    const oldStatus = currentRequest.status;
    
    // Optimistically update the local state immediately for instant UI feedback
    const updateRequestInState = (requests, setRequests) => {
      const updated = requests.map(req => 
        req._id === requestId 
          ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } 
          : req
      );
      setRequests(updated);
    };

    // Update the appropriate state based on active tab
    switch (activeTab) {
      case 'website': updateRequestInState(websiteRequests, setWebsiteRequests); break;
      case 'mobile': updateRequestInState(mobileAppRequests, setMobileAppRequests); break;
      case 'cloud': updateRequestInState(cloudHostingRequests, setCloudHostingRequests); break;
      case 'crm': updateRequestInState(crmSolutionRequests, setCrmSolutionRequests); break;
      case 'hrms': updateRequestInState(hrmsSolutionRequests, setHrmsSolutionRequests); break;
      case 'ai': updateRequestInState(aiContentRequests, setAiContentRequests); break;
      case 'digital': updateRequestInState(digitalMarketingRequests, setDigitalMarketingRequests); break;
      case 'lms': updateRequestInState(lmsRequests, setLmsRequests); break;
      case 'ecommerce': updateRequestInState(ecommerceRequests, setEcommerceRequests); break;
      case 'branding': updateRequestInState(brandingDesignRequests, setBrandingDesignRequests); break;
      case 'saas': updateRequestInState(saasProductRequests, setSaasProductRequests); break;
      case 'healthcare': updateRequestInState(healthcareRequests, setHealthcareRequests); break;
    }

    setUpdatingStatus(prev => ({ ...prev, [requestId]: true }));
    setUpdateSuccess(prev => {
      const newState = { ...prev };
      delete newState[requestId];
      return newState;
    });
    
    try {
      const updateMethod = getStatusUpdateMethod(activeTab);
      if (!updateMethod) {
        throw new Error(`No update method found for request type: ${activeTab}`);
      }
      
      // Verify adminApi is available
      if (!adminApi) {
        throw new Error('AdminAPI is not properly initialized');
      }
      
      if (typeof updateMethod !== 'function') {
        throw new Error(`Update method is not available for type: ${activeTab}`);
      }
      
      console.log(`Updating ${activeTab} request ${requestId} to status: ${newStatus}`);
      const result = await updateMethod(requestId, newStatus);
      
      if (!result.success) {
        console.error('Status update failed:', result);
        
        // Revert the optimistic update on failure
        const revertRequestInState = (requests, setRequests) => {
          setRequests(requests.map(req => 
            req._id === requestId ? { ...req, status: oldStatus } : req
          ));
        };

        switch (activeTab) {
          case 'website': revertRequestInState(websiteRequests, setWebsiteRequests); break;
          case 'mobile': revertRequestInState(mobileAppRequests, setMobileAppRequests); break;
          case 'cloud': revertRequestInState(cloudHostingRequests, setCloudHostingRequests); break;
          case 'crm': revertRequestInState(crmSolutionRequests, setCrmSolutionRequests); break;
          case 'hrms': revertRequestInState(hrmsSolutionRequests, setHrmsSolutionRequests); break;
          case 'ai': revertRequestInState(aiContentRequests, setAiContentRequests); break;
          case 'digital': revertRequestInState(digitalMarketingRequests, setDigitalMarketingRequests); break;
          case 'lms': revertRequestInState(lmsRequests, setLmsRequests); break;
          case 'ecommerce': revertRequestInState(ecommerceRequests, setEcommerceRequests); break;
          case 'branding': revertRequestInState(brandingDesignRequests, setBrandingDesignRequests); break;
          case 'saas': revertRequestInState(saasProductRequests, setSaasProductRequests); break;
          case 'healthcare': revertRequestInState(healthcareRequests, setHealthcareRequests); break;
        }

        const errorMsg = result.error || result.data?.message || 'Unknown error';
        alert(`Failed to update status: ${errorMsg}`);
      } else {
        // Success - show success message
        console.log('Status updated successfully:', result.data);
        setUpdateSuccess(prev => ({ ...prev, [requestId]: true }));
        
        // Clear success message after 2 seconds
        setTimeout(() => {
          setUpdateSuccess(prev => {
            const newState = { ...prev };
            delete newState[requestId];
            return newState;
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      
      // Revert the optimistic update on error
      const revertRequestInState = (requests, setRequests) => {
        setRequests(requests.map(req => 
          req._id === requestId ? { ...req, status: oldStatus } : req
        ));
      };

      switch (activeTab) {
        case 'website': revertRequestInState(websiteRequests, setWebsiteRequests); break;
        case 'mobile': revertRequestInState(mobileAppRequests, setMobileAppRequests); break;
        case 'cloud': revertRequestInState(cloudHostingRequests, setCloudHostingRequests); break;
        case 'crm': revertRequestInState(crmSolutionRequests, setCrmSolutionRequests); break;
        case 'hrms': revertRequestInState(hrmsSolutionRequests, setHrmsSolutionRequests); break;
        case 'ai': revertRequestInState(aiContentRequests, setAiContentRequests); break;
        case 'digital': revertRequestInState(digitalMarketingRequests, setDigitalMarketingRequests); break;
        case 'lms': revertRequestInState(lmsRequests, setLmsRequests); break;
        case 'ecommerce': revertRequestInState(ecommerceRequests, setEcommerceRequests); break;
        case 'branding': revertRequestInState(brandingDesignRequests, setBrandingDesignRequests); break;
        case 'saas': revertRequestInState(saasProductRequests, setSaasProductRequests); break;
        case 'healthcare': revertRequestInState(healthcareRequests, setHealthcareRequests); break;
      }

      alert(`Failed to update status: ${err.message || 'Network error'}`);
    } finally {
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  const handleDelete = async (requestId) => {
    setDeletingId(requestId);
    try {
      const deleteMethod = getDeleteMethod(activeTab);
      if (!deleteMethod) {
        throw new Error(`No delete method found for request type: ${activeTab}`);
      }

      const result = await deleteMethod(requestId);

      if (!result.success) {
        const errorMsg = result.error || result.data?.message || 'Unknown error';
        alert(`Failed to delete lead: ${errorMsg}`);
      } else {
        // Remove from local state
        const removeFromState = (requests, setRequests) => {
          setRequests(requests.filter(req => req._id !== requestId));
        };

        switch (activeTab) {
          case 'website': removeFromState(websiteRequests, setWebsiteRequests); break;
          case 'mobile': removeFromState(mobileAppRequests, setMobileAppRequests); break;
          case 'cloud': removeFromState(cloudHostingRequests, setCloudHostingRequests); break;
          case 'crm': removeFromState(crmSolutionRequests, setCrmSolutionRequests); break;
          case 'hrms': removeFromState(hrmsSolutionRequests, setHrmsSolutionRequests); break;
          case 'ai': removeFromState(aiContentRequests, setAiContentRequests); break;
          case 'digital': removeFromState(digitalMarketingRequests, setDigitalMarketingRequests); break;
          case 'lms': removeFromState(lmsRequests, setLmsRequests); break;
          case 'ecommerce': removeFromState(ecommerceRequests, setEcommerceRequests); break;
          case 'branding': removeFromState(brandingDesignRequests, setBrandingDesignRequests); break;
          case 'saas': removeFromState(saasProductRequests, setSaasProductRequests); break;
          case 'healthcare': removeFromState(healthcareRequests, setHealthcareRequests); break;
        }

        console.log('Lead deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert(`Failed to delete lead: ${err.message || 'Network error'}`);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const filteredRequests = useMemo(() => {
    let requests = getCurrentRequests();
    
    // Filter by status
    if (statusFilter !== 'all') {
      requests = requests.filter(req => req.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      requests = requests.filter(req => 
        req.fullName?.toLowerCase().includes(query) ||
        req.email?.toLowerCase().includes(query) ||
        req.phone?.toLowerCase().includes(query) ||
        req.businessName?.toLowerCase().includes(query) ||
        req.companyName?.toLowerCase().includes(query)
      );
    }
    
    return requests;
  }, [activeTab, statusFilter, searchQuery, websiteRequests, mobileAppRequests, cloudHostingRequests, crmSolutionRequests, hrmsSolutionRequests, aiContentRequests, digitalMarketingRequests, lmsRequests, ecommerceRequests, brandingDesignRequests, saasProductRequests, healthcareRequests]);

  const getStats = () => {
    const requests = getCurrentRequests();
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      reviewed: requests.filter(r => r.status === 'reviewed').length,
      inProgress: requests.filter(r => r.status === 'in-progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
    };
  };

  const getStatusColor = (status) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    if (!statusOption) return 'gray';
    return statusOption.color;
  };

  const getStatusBadgeClass = (status) => {
    const color = getStatusColor(status);
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${colorMap[color] || colorMap.gray}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderLeadCard = (request) => {
    const StatusIcon = STATUS_OPTIONS.find(s => s.value === request.status)?.icon || ClockIcon;
    const isUpdating = updatingStatus[request._id];

    return (
      <div key={request._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="p-6">
          {/* Enhanced Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {request.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">{request.fullName || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{request.businessName || request.companyName || request.clinicHospitalName || 'No business name'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className={`${getStatusBadgeClass(request.status)} dark:bg-opacity-20 dark:border-opacity-50 flex items-center gap-1.5 px-3 py-1.5`}>
                <StatusIcon className="h-4 w-4" />
                <span className="capitalize">{request.status || 'pending'}</span>
              </span>
            </div>
          </div>

          {/* Enhanced Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{request.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Phone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{request.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Submitted</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(request.submittedAt)}</p>
              </div>
            </div>
            {request.budgetRange && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-0.5 font-semibold">Budget</p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{request.budgetRange}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Status Update */}
          <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Update Status</label>
            <div className="relative">
              <select
                value={request.status || 'pending'}
                onChange={(e) => {
                  e.preventDefault();
                  const newStatus = e.target.value;
                  if (newStatus !== request.status) {
                    handleStatusUpdate(request._id, newStatus);
                  }
                }}
                disabled={isUpdating}
                className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium appearance-none cursor-pointer transition-all duration-200"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {isUpdating && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-2 font-medium">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Updating status...
              </p>
            )}
            {updateSuccess[request._id] && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-2 font-medium">
                <CheckCircleIcon className="h-4 w-4" />
                Status updated successfully!
              </p>
            )}
          </div>

          {/* Enhanced Delete Button - Only show for completed leads */}
          {request.status === 'completed' && (
            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDeleteConfirm(request._id)}
                disabled={deletingId === request._id}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {deletingId === request._id ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5" />
                    Delete Lead
                  </>
                )}
              </button>
            </div>
          )}

          {/* Enhanced Delete Confirmation Modal */}
          {showDeleteConfirm === request._id && (
            <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrashIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Lead</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Are you sure you want to delete the lead for <strong className="text-gray-900 dark:text-white">{request.fullName}</strong>? 
                  This will permanently remove all associated data from the system.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(request._id)}
                    disabled={deletingId === request._id}
                    className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {deletingId === request._id ? (
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
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <SparklesIcon className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading client leads...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <XCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchAllRequests()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const allStats = {
    total: websiteRequests.length + mobileAppRequests.length + cloudHostingRequests.length + 
           crmSolutionRequests.length + hrmsSolutionRequests.length + aiContentRequests.length + 
           digitalMarketingRequests.length + lmsRequests.length + ecommerceRequests.length + 
           brandingDesignRequests.length + saasProductRequests.length + healthcareRequests.length,
    pending: websiteRequests.filter(r => r.status === 'pending').length + 
             mobileAppRequests.filter(r => r.status === 'pending').length + 
             cloudHostingRequests.filter(r => r.status === 'pending').length + 
             crmSolutionRequests.filter(r => r.status === 'pending').length + 
             hrmsSolutionRequests.filter(r => r.status === 'pending').length + 
             aiContentRequests.filter(r => r.status === 'pending').length + 
             digitalMarketingRequests.filter(r => r.status === 'pending').length + 
             lmsRequests.filter(r => r.status === 'pending').length + 
             ecommerceRequests.filter(r => r.status === 'pending').length + 
             brandingDesignRequests.filter(r => r.status === 'pending').length + 
             saasProductRequests.filter(r => r.status === 'pending').length + 
             healthcareRequests.filter(r => r.status === 'pending').length,
    reviewed: websiteRequests.filter(r => r.status === 'reviewed').length + 
              mobileAppRequests.filter(r => r.status === 'reviewed').length + 
              cloudHostingRequests.filter(r => r.status === 'reviewed').length + 
              crmSolutionRequests.filter(r => r.status === 'reviewed').length + 
              hrmsSolutionRequests.filter(r => r.status === 'reviewed').length + 
              aiContentRequests.filter(r => r.status === 'reviewed').length + 
              digitalMarketingRequests.filter(r => r.status === 'reviewed').length + 
              lmsRequests.filter(r => r.status === 'reviewed').length + 
              ecommerceRequests.filter(r => r.status === 'reviewed').length + 
              brandingDesignRequests.filter(r => r.status === 'reviewed').length + 
              saasProductRequests.filter(r => r.status === 'reviewed').length + 
              healthcareRequests.filter(r => r.status === 'reviewed').length,
    inProgress: websiteRequests.filter(r => r.status === 'in-progress').length + 
                mobileAppRequests.filter(r => r.status === 'in-progress').length + 
                cloudHostingRequests.filter(r => r.status === 'in-progress').length + 
                crmSolutionRequests.filter(r => r.status === 'in-progress').length + 
                hrmsSolutionRequests.filter(r => r.status === 'in-progress').length + 
                aiContentRequests.filter(r => r.status === 'in-progress').length + 
                digitalMarketingRequests.filter(r => r.status === 'in-progress').length + 
                lmsRequests.filter(r => r.status === 'in-progress').length + 
                ecommerceRequests.filter(r => r.status === 'in-progress').length + 
                brandingDesignRequests.filter(r => r.status === 'in-progress').length + 
                saasProductRequests.filter(r => r.status === 'in-progress').length + 
                healthcareRequests.filter(r => r.status === 'in-progress').length,
    completed: websiteRequests.filter(r => r.status === 'completed').length + 
               mobileAppRequests.filter(r => r.status === 'completed').length + 
               cloudHostingRequests.filter(r => r.status === 'completed').length + 
               crmSolutionRequests.filter(r => r.status === 'completed').length + 
               hrmsSolutionRequests.filter(r => r.status === 'completed').length + 
               aiContentRequests.filter(r => r.status === 'completed').length + 
               digitalMarketingRequests.filter(r => r.status === 'completed').length + 
               lmsRequests.filter(r => r.status === 'completed').length + 
               ecommerceRequests.filter(r => r.status === 'completed').length + 
               brandingDesignRequests.filter(r => r.status === 'completed').length + 
               saasProductRequests.filter(r => r.status === 'completed').length + 
               healthcareRequests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Admin</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">Client Leads</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Client Leads Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage and view all client requests across different services
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchAllRequests(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overview Dashboard</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">All Services Combined</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Leads Card */}
            <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">Total Leads</p>
                    <p className="text-3xl font-bold mt-1">{allStats.total}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-blue-100 text-xs">Across all services</p>
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="group relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-amber-100 text-xs font-medium uppercase tracking-wide">Pending</p>
                    <p className="text-3xl font-bold mt-1">{allStats.pending}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-amber-100 text-xs">Awaiting review</p>
                </div>
              </div>
            </div>

            {/* Reviewed Card */}
            <div className="group relative bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-100 text-xs font-medium uppercase tracking-wide">Reviewed</p>
                    <p className="text-3xl font-bold mt-1">{allStats.reviewed}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-cyan-100 text-xs">Under evaluation</p>
                </div>
              </div>
            </div>

            {/* In Progress Card */}
            <div className="group relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ArrowPathIcon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-orange-100 text-xs font-medium uppercase tracking-wide">In Progress</p>
                    <p className="text-3xl font-bold mt-1">{allStats.inProgress}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-orange-100 text-xs">Active work</p>
                </div>
              </div>
            </div>

            {/* Completed Card */}
            <div className="group relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Completed</p>
                    <p className="text-3xl font-bold mt-1">{allStats.completed}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-emerald-100 text-xs">Successfully finished</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Service Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Categories</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Select a service to view leads</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-3">
              {SERVICE_TABS.map(tab => {
                let count = 0;
                switch(tab.id) {
                  case 'website': count = websiteRequests.length; break;
                  case 'mobile': count = mobileAppRequests.length; break;
                  case 'cloud': count = cloudHostingRequests.length; break;
                  case 'crm': count = crmSolutionRequests.length; break;
                  case 'hrms': count = hrmsSolutionRequests.length; break;
                  case 'ai': count = aiContentRequests.length; break;
                  case 'digital': count = digitalMarketingRequests.length; break;
                  case 'lms': count = lmsRequests.length; break;
                  case 'ecommerce': count = ecommerceRequests.length; break;
                  case 'branding': count = brandingDesignRequests.length; break;
                  case 'saas': count = saasProductRequests.length; break;
                  case 'healthcare': count = healthcareRequests.length; break;
                }
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className={`group relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or business name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <div className="relative lg:w-64">
              <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'Lead' : 'Leads'} Found
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activeTab === 'website' ? 'Website' : 
                 activeTab === 'mobile' ? 'Mobile Apps' :
                 activeTab === 'cloud' ? 'Cloud Hosting' :
                 activeTab === 'crm' ? 'CRM Solutions' :
                 activeTab === 'hrms' ? 'HRMS Solutions' :
                 activeTab === 'ai' ? 'AI Content' :
                 activeTab === 'digital' ? 'Digital Marketing' :
                 activeTab === 'lms' ? 'LMS' :
                 activeTab === 'ecommerce' ? 'E-commerce' :
                 activeTab === 'branding' ? 'Branding Design' :
                 activeTab === 'saas' ? 'SaaS Product' :
                 activeTab === 'healthcare' ? 'Healthcare' : 'All'} Service Leads
              </p>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Leads Found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No leads available for this service category yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.map(renderLeadCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
