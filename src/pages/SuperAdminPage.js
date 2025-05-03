import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ChevronLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';

const SuperAdminPage = () => {
  const navigate = useNavigate();

  // Mock data for existing admins
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Primary Admin', email: 'admin@example.com', lastActive: '2 hours ago' },
    { id: 2, name: 'Secondary Admin', email: 'admin2@example.com', lastActive: '1 day ago' },
  ]);

  // Mock data for pending admin requests
  const [pendingRequests, setPendingRequests] = useState([
    { 
      id: 3, 
      name: 'New Applicant', 
      email: 'applicant@example.com', 
      requestDate: '2023-05-15',
      status: 'pending'
    },
    { 
      id: 4, 
      name: 'Another Applicant', 
      email: 'another@example.com', 
      requestDate: '2023-05-16',
      status: 'pending'
    }
  ]);

  const handleApprove = (requestId) => {
    const request = pendingRequests.find(req => req.id === requestId);
    if (!request) return;

    // Add to admins list
    const newAdmin = {
      id: requestId,
      name: request.name,
      email: request.email,
      lastActive: 'Just now'
    };

    setAdmins([...admins, newAdmin]);
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  const handleReject = (requestId) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg shadow p-6">
        <header className="mb-8">
          <nav>
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Admin Dashboard
            </button>

          </nav>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-indigo-600 mr-2" />
            Admin Management
          </h1>
        </header>

        {/* Pending Requests Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-yellow-500 mr-2" />
            Pending Admin Requests
          </h2>
          
          {pendingRequests.length > 0 ? (

            <figure className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">

                      <th scope="row" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <menu className="flex space-x-2">
                          <li>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="sr-only">Approve {request.name}</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
                              <span className="sr-only">Reject {request.name}</span>
                            </button>
                          </li>
                        </menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          ) : (
            <aside className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700 flex items-center">
                <Clock className="h-5 w-5 text-yellow-400 mr-2" />
                No pending admin requests at this time.
              </p>
            </aside>
          )}
        </section>

        {/* Current Admins Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            Current Admins
          </h2>
          
          <figure className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">

                    <th scope="row" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</th>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </section>
      </article>
    </main>
  );
};

export default SuperAdminPage;
