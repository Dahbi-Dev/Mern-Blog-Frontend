import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { User, Calendar, MessageCircle, Heart, ThumbsUp, ThumbsDown, Flame } from "lucide-react";

function Post({ _id, title, summary, cover, createdAt, author }) {
  const [reactions, setReactions] = useState({
    likes: 0,
    dislikes: 0,
    loves: 0,
    fires: 0,
  });
  const [comments, setComments] = useState([]);
  const api = process.env.REACT_APP_API_URL;

  const fetchReactions = useCallback(async () => {
    try {
      const response = await fetch(`${api}/post/${_id}/reactions`);
      if (!response.ok) throw new Error('Failed to fetch reactions');
      const data = await response.json();
      setReactions(data);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, [api, _id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`${api}/post/${_id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [api, _id]);

  useEffect(() => {
    fetchReactions();
    fetchComments();
  }, [fetchReactions, fetchComments]);

  const limitText = (text, wordCount) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordCount
      ? words.slice(0, wordCount).join(" ") + "..."
      : text;
  };

  const ReactionIcon = ({ type, count, icon: Icon }) => {
    const getIconStyle = () => {
      if (count === 0) {
        return "text-gray-400 dark:text-gray-500";
      }

      const styles = {
        like: "text-blue-500 dark:text-blue-400",
        love: "text-red-500 dark:text-red-400",
        fire: "text-orange-500 dark:text-orange-400",
        dislike: "text-gray-600 dark:text-gray-400"
      };
      return styles[type];
    };

    const getTextStyle = () => {
      if (count === 0) {
        return "text-gray-400 dark:text-gray-500";
      }
      return "text-gray-600 dark:text-gray-300";
    };

    return (
      <div className="flex items-center gap-1">
        <Icon className={`w-4 h-4 ${getIconStyle()}`} />
        <span className={getTextStyle()}>{count}</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link
        to={`/postPage/${_id}`}
        className="block aspect-video overflow-hidden"
      >
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400";
            e.target.onerror = null;
          }}
        />
      </Link>

      <div className="p-6">
        <Link to={`/postPage/${_id}`}>
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {limitText(title, 8)}
          </h2>
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author?.username || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time>{format(new Date(createdAt), "E-MM-yyyy HH:mm")}</time>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {limitText(summary, 8)}
        </p>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <Link 
            to={`/postPage/${_id}`} 
            className={`flex items-center gap-1 ${
              comments.length > 0 
                ? "text-blue-500 dark:text-blue-400" 
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <ReactionIcon type="like" count={reactions.likes} icon={ThumbsUp} />
            <ReactionIcon type="love" count={reactions.loves} icon={Heart} />
            <ReactionIcon type="fire" count={reactions.fires} icon={Flame} />
            <ReactionIcon type="dislike" count={reactions.dislikes} icon={ThumbsDown} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;