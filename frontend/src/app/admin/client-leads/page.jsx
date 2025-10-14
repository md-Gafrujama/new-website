'use client';

import { useState, useEffect } from 'react';
// import AdminLayoutWrapper from '../../../components/admin/AdminLayoutWrapper';
import adminApi from '../../../components/lib/adminApi';

export default function ClientLeadsPage() {
  const [activeTab, setActiveTab] = useState('website');
  const [websiteRequests, setWebsiteRequests] = useState([]);
  const [mobileAppRequests, setMobileAppRequests] = useState([]);
  const [cloudHostingRequests, setCloudHostingRequests] = useState([]);
  const [crmSolutionRequests, setCrmSolutionRequests] = useState([]);
  const [hrmsSolutionRequests, setHrmsSolutionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching requests...');

      const [websiteRes, mobileRes, cloudRes, crmRes, hrmsRes] = await Promise.all([
        adminApi.getWebsiteRequests(),
        adminApi.getMobileAppRequests(),
        adminApi.getCloudHostingRequests(),
        adminApi.getCrmSolutionRequests(),
        adminApi.getHrmsSolutionRequests()
      ]);

      console.log('Website response:', websiteRes);
      console.log('Mobile response:', mobileRes);
      console.log('Cloud response:', cloudRes);
      console.log('CRM response:', crmRes);
      console.log('HRMS response:', hrmsRes);

      if (websiteRes.success) {
        const requests = websiteRes.data?.data?.requests || [];
        setWebsiteRequests(Array.isArray(requests) ? requests : []);
      } else {
        console.error('Failed to fetch website requests:', websiteRes.error);
        setError(`Failed to fetch website requests: ${websiteRes.error}`);
      }

      if (mobileRes.success) {
        const requests = mobileRes.data?.data?.requests || [];
        setMobileAppRequests(Array.isArray(requests) ? requests : []);
      } else {
        console.error('Failed to fetch mobile app requests:', mobileRes.error);
        setError(`Failed to fetch mobile app requests: ${mobileRes.error}`);
      }

      if (cloudRes.success) {
        const requests = cloudRes.data?.data?.requests || [];
        setCloudHostingRequests(Array.isArray(requests) ? requests : []);
      } else {
        console.error('Failed to fetch cloud hosting requests:', cloudRes.error);
        setError(`Failed to fetch cloud hosting requests: ${cloudRes.error}`);
      }

      if (crmRes.success) {
        const requests = crmRes.data?.data?.requests || [];
        setCrmSolutionRequests(Array.isArray(requests) ? requests : []);
      } else {
        console.error('Failed to fetch CRM solution requests:', crmRes.error);
        setError(`Failed to fetch CRM solution requests: ${crmRes.error}`);
      }

      if (hrmsRes.success) {
        const requests = hrmsRes.data?.data?.requests || [];
        setHrmsSolutionRequests(Array.isArray(requests) ? requests : []);
      } else {
        console.error('Failed to fetch HRMS solution requests:', hrmsRes.error);
        setError(`Failed to fetch HRMS solution requests: ${hrmsRes.error}`);
      }
    } catch (err) {
      setError('Failed to fetch client leads data');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderWebsiteRequests = () => (
    <div className="space-y-4">
      {websiteRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No website requests found
        </div>
      ) : (
        websiteRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                {/* <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3> */}
                 <p className="text-sm text-gray-600"><strong>Name:</strong> {request.fullName}</p>
                {/* <p className="text-gray-600">{request.email}</p> */}
                 <p className="text-sm text-gray-600"><strong>Email:</strong> {request.email}</p>
                 <p className="text-sm text-gray-600"><strong>Phone No:</strong> {request.phone}</p>
                {/* <p className="text-sm text-gray-500">{request.phone}</p> */}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><strong>Website Type:</strong> {request.websiteType}</p>
                <p className="text-sm text-gray-600"><strong>Budget:</strong> {request.budgetRange}</p>
                <p className="text-sm text-gray-600"><strong>Deadline:</strong> {request.projectDeadline ? new Date(request.projectDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>

                {request.preferredTechnologies && request.preferredTechnologies.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Preferred Technologies:</strong> {request.preferredTechnologies.join(', ')}</p>
                )}
                {request.currentWebsite && (
                  <p className="text-sm text-gray-600"><strong>Current Website:</strong> {request.currentWebsite}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}</p>
                {request.pagesRequired && (
                  <p className="text-sm text-gray-600"><strong>Pages Required:</strong> {request.pagesRequired}</p>
                )}
                {request.domainName && (
                  <p className="text-sm text-gray-600"><strong>Domain Name:</strong> {request.domainName}</p>
                )}
              </div>
            </div>
            {request.specificRequirements && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Specific Requirements:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.specificRequirements}</p>
              </div>
            )}
            {request.projectDescription && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Project Description:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.projectDescription}</p>
              </div>
            )}
            {request.targetAudience && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Target Audience:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.targetAudience}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderMobileAppRequests = () => (
    <div className="space-y-4">
      {mobileAppRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No mobile app requests found
        </div>
      ) : (
        mobileAppRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3>
                <p className="text-gray-600">{request.email}</p>
                <p className="text-sm text-gray-500">{request.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><strong>App Type:</strong> {request.appType?.join(', ')}</p>
                <p className="text-sm text-gray-600"><strong>Framework:</strong> {request.preferredFramework}</p>
                <p className="text-sm text-gray-600"><strong>Budget:</strong> {request.budgetRange}</p>
                {request.platforms && request.platforms.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Platforms:</strong> {request.platforms.join(', ')}</p>
                )}
                {request.appCategory && (
                  <p className="text-sm text-gray-600"><strong>Category:</strong> {request.appCategory}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}</p>
                {request.timeline && (
                  <p className="text-sm text-gray-600"><strong>Timeline:</strong> {request.timeline}</p>
                )}
                {request.userBase && (
                  <p className="text-sm text-gray-600"><strong>Expected User Base:</strong> {request.userBase}</p>
                )}
              </div>
            </div>
            {request.specificFeatures && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Specific Features:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.specificFeatures}</p>
              </div>
            )}
            {request.projectDescription && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Project Description:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.projectDescription}</p>
              </div>
            )}
            {request.targetAudience && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Target Audience:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.targetAudience}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderCloudHostingRequests = () => (
    <div className="space-y-4">
      {cloudHostingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No cloud hosting requests found
        </div>
      ) : (
        cloudHostingRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3>
                <p className="text-gray-600">{request.email}</p>
                <p className="text-sm text-gray-500">{request.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><strong>Platform:</strong> {request.platformPreference}</p>
                <p className="text-sm text-gray-600"><strong>Urgency:</strong> {request.urgencyLevel}</p>
                <p className="text-sm text-gray-600"><strong>Services:</strong> {request.serviceType?.join(', ')}</p>
                {request.budgetRange && (
                  <p className="text-sm text-gray-600"><strong>Budget:</strong> {request.budgetRange}</p>
                )}
                {request.currentHosting && (
                  <p className="text-sm text-gray-600"><strong>Current Hosting:</strong> {request.currentHosting}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}</p>
                {request.expectedTraffic && (
                  <p className="text-sm text-gray-600"><strong>Expected Traffic:</strong> {request.expectedTraffic}</p>
                )}
                {request.timeline && (
                  <p className="text-sm text-gray-600"><strong>Timeline:</strong> {request.timeline}</p>
                )}
              </div>
            </div>
            {request.specificRequirements && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Specific Requirements:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.specificRequirements}</p>
              </div>
            )}
            {request.projectDescription && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Project Description:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.projectDescription}</p>
              </div>
            )}
            {request.targetAudience && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Target Audience:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.targetAudience}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderCrmSolutionRequests = () => (
    <div className="space-y-4">
      {crmSolutionRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No CRM solution requests found
        </div>
      ) : (
        crmSolutionRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3>
                <p className="text-gray-600">{request.email}</p>
                <p className="text-sm text-gray-500">{request.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><strong>CRM Type:</strong> {request.crmType}</p>
                <p className="text-sm text-gray-600"><strong>Budget:</strong> {request.budgetRange}</p>
                <p className="text-sm text-gray-600"><strong>Timeline:</strong> {request.timeline}</p>
                {request.currentCrm && (
                  <p className="text-sm text-gray-600"><strong>Current CRM:</strong> {request.currentCrm}</p>
                )}
                {request.preferredFeatures && request.preferredFeatures.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Preferred Features:</strong> {request.preferredFeatures.join(', ')}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}</p>
                {request.companySize && (
                  <p className="text-sm text-gray-600"><strong>Company Size:</strong> {request.companySize}</p>
                )}
                {request.industry && (
                  <p className="text-sm text-gray-600"><strong>Industry:</strong> {request.industry}</p>
                )}
              </div>
            </div>
            {request.specificRequirements && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Specific Requirements:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.specificRequirements}</p>
              </div>
            )}
            {request.projectDescription && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Project Description:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.projectDescription}</p>
              </div>
            )}
            {request.targetAudience && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Target Audience:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.targetAudience}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderHrmsSolutionRequests = () => (
    <div className="space-y-4">
      {hrmsSolutionRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No HRMS solution requests found
        </div>
      ) : (
        hrmsSolutionRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{request.fullName}</h3>
                <p className="text-gray-600">{request.email}</p>
                <p className="text-sm text-gray-500">{request.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><strong>Company Size:</strong> {request.companySize}</p>
                <p className="text-sm text-gray-600"><strong>Business Type:</strong> {request.businessType}</p>
                <p className="text-sm text-gray-600"><strong>Expected Users:</strong> {request.expectedUsers}</p>
                <p className="text-sm text-gray-600"><strong>Budget:</strong> {request.budgetRange}</p>
                <p className="text-sm text-gray-600"><strong>Timeline:</strong> {request.timeline}</p>
                <p className="text-sm text-gray-600"><strong>Priority:</strong> {request.priority}</p>
                {request.deploymentPreference && (
                  <p className="text-sm text-gray-600"><strong>Deployment:</strong> {request.deploymentPreference}</p>
                )}
                {request.currentHrTools && (
                  <p className="text-sm text-gray-600"><strong>Current HR Tools:</strong> {request.currentHrTools}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                <p className="text-sm text-gray-600"><strong>Updated:</strong> {request.updatedAt ? formatDate(request.updatedAt) : 'N/A'}</p>
                {request.requiredModules && request.requiredModules.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Required Modules:</strong> {request.requiredModules.join(', ')}</p>
                )}
                {request.integrationRequirements && request.integrationRequirements.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Integration Requirements:</strong> {request.integrationRequirements.join(', ')}</p>
                )}
                {request.accessControlLevels && request.accessControlLevels.length > 0 && (
                  <p className="text-sm text-gray-600"><strong>Access Control Levels:</strong> {request.accessControlLevels.join(', ')}</p>
                )}
              </div>
            </div>
            {request.complianceRequirements && request.complianceRequirements.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Compliance Requirements:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.complianceRequirements.join(', ')}</p>
              </div>
            )}
            {request.dataSecurityRequirements && request.dataSecurityRequirements.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Data Security Requirements:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.dataSecurityRequirements.join(', ')}</p>
              </div>
            )}
            {request.customizationNeeded && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Customization Needed:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.customizationNeeded}</p>
              </div>
            )}
            {request.additionalNotes && (
              <div className="mb-4">
                <p className="text-sm text-gray-600"><strong>Additional Notes:</strong></p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{request.additionalNotes}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      // <AdminLayoutWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      // </AdminLayoutWrapper>
    );
  }

  if (error) {
    return (
      
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAllRequests}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      
    );
  }

  return (
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Leads</h1>
          <p className="text-gray-600">Manage and view all client requests across different services</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('website')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'website'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Website Requests ({websiteRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('mobile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mobile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mobile Apps ({mobileAppRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('cloud')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cloud'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cloud Hosting ({cloudHostingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'crm'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                CRM Solutions ({crmSolutionRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('hrms')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hrms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                HRMS Solutions ({hrmsSolutionRequests.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          {activeTab === 'website' && renderWebsiteRequests()}
          {activeTab === 'mobile' && renderMobileAppRequests()}
          {activeTab === 'cloud' && renderCloudHostingRequests()}
          {activeTab === 'crm' && renderCrmSolutionRequests()}
          {activeTab === 'hrms' && renderHrmsSolutionRequests()}
        </div>
      </div>
    
  );
}
