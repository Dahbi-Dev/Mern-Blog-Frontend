import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";

function Post({ _id, title, summary, cover, createdAt, author }) {

  const limitText = (text, wordCount) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordCount
      ? words.slice(0, wordCount).join(" ") + "..."
      : text;
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
          {limitText(summary, 15)}
        </p>
      </div>
    </div>
  );
}

export default Post;
