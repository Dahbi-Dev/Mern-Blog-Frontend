import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const PostComments = ({ postId }) => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    // Apply the dark mode setting based on `isDarkMode` state
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${api}/post/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${api}/post/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment })
      });
      
      if (response.ok) {
        await fetchComments();
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comments ({comments.length})
        <button
          onClick={toggleDarkMode}
          className="ml-auto p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={userInfo ? "Write a comment..." : "Login to comment"}
            className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!userInfo || loading}
          />
          <button
            type="submit"
            disabled={!userInfo || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={() => !userInfo && navigate('/login')}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {userInfo ? 'Post' : 'Login to comment'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-blue-600 dark:text-blue-400">
                {comment.author.username}
              </div>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
              </time>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
