import React, { useState, useEffect, useContext } from 'react';
import { ThumbsUp, ThumbsDown, Heart, Flame, X, Users, Loader2, UserCircle2, ChevronDown } from 'lucide-react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

const PostReactions = ({ postId }) => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0, loves: 0, fires: 0 });
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [reactionUsers, setReactionUsers] = useState({});
  const [selectedReactionType, setSelectedReactionType] = useState(null);
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchReactions();
  }, [postId, api]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`${api}/post/${postId}/reactions`);
      const data = await response.json();
      setReactions(data);
      
     
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const fetchReactionUsers = async (type) => {
    try {
      const response = await fetch(`${api}/post/${postId}/reactions/users/${type}`);
      const data = await response.json();
      setReactionUsers(prev => ({ ...prev, [type]: data }));
    } catch (error) {
      console.error('Error fetching reaction users:', error);
    }
  };

  const handleShowUsers = async (type) => {
    setSelectedReactionType(type);
    setShowDetails(true);
    if (!reactionUsers[type]) {
      await fetchReactionUsers(type);
    }
  };

  const handleReaction = async (type) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${api}/post/${postId}/addreaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        await fetchReactions();
        setReactionUsers({}); // Reset reaction users cache to force refresh
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const ReactionGroup = ({ type, icon: Icon, count }) => {
    const isActive = userReaction === type;
    
    const getActiveStyle = (type) => {
      const styles = {
        like: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        love: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
        fire: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
        dislike: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
      };
      return styles[type];
    };

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleReaction(type)}
          disabled={loading}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive 
              ? getActiveStyle(type)
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <Icon className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium ml-1">{count}</span>
        </button>
        {count > 0 && (
          <button
            onClick={() => handleShowUsers(type)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <ReactionGroup 
          type="like" 
          icon={ThumbsUp} 
          count={reactions.likes}
        />
        <ReactionGroup 
          type="love" 
          icon={Heart} 
          count={reactions.loves}
        />
        <ReactionGroup 
          type="fire" 
          icon={Flame} 
          count={reactions.fires}
        />
        <ReactionGroup 
          type="dislike" 
          icon={ThumbsDown} 
          count={reactions.dislikes}
        />
        
        {loading && (
          <Loader2 className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
        )}
      </div>

      {showDetails && selectedReactionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                <Users className="w-5 h-5" />
                {selectedReactionType.charAt(0).toUpperCase() + selectedReactionType.slice(1)}s
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {reactionUsers[selectedReactionType]?.map((user) => (
                <div
                  key={user._id || user.id}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 flex items-center gap-2"
                >
                  <UserCircle2 className="w-5 h-5" />
                  {user.username}
                </div>
              ))}
              {(!reactionUsers[selectedReactionType] || reactionUsers[selectedReactionType]?.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400">No reactions yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostReactions;