import { useState, useEffect } from 'react';
import { Trash2, UserCog, AlertCircle, Loader2, Shield, ShieldOff } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    delete: null,
    role: null
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/admin/users', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      
      const statsPromises = data.map(user => 
        fetch(`/admin/users/${user._id}/stats`, {
          credentials: 'include'
        }).then(res => res.json())
      );
      
      const allStats = await Promise.all(statsPromises);
      const statsMap = {};
      data.forEach((user, index) => {
        statsMap[user._id] = allStats[index];
      });
      setStats(statsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will delete all their posts, comments, and reactions.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, delete: userId }));
    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, delete: null }));
    }
  };

  const handleToggleRole = async (userId, currentIsAdmin) => {
    const action = currentIsAdmin ? 'remove admin rights from' : 'make this user an admin';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setActionLoading(prev => ({ ...prev, role: userId }));
    try {
      const response = await fetch(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      
      const { isAdmin } = await response.json();
      
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isAdmin } 
          : user
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, role: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <UserCog className="w-6 h-6" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{user.username}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats[user._id] ? (
                    <span>
                      {stats[user._id].postsCount} posts,{' '}
                      {stats[user._id].commentsCount} comments
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => handleToggleRole(user._id, user.isAdmin)}
                      disabled={actionLoading.role === user._id || user._id === localStorage.getItem('userId')}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={user.isAdmin ? "Remove admin rights" : "Make admin"}
                    >
                      {actionLoading.role === user._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.isAdmin ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={actionLoading.delete === user._id || user._id === localStorage.getItem('userId')}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      {actionLoading.delete === user._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}