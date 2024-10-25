import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";

export default function EditPost() {
  const api = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${api}/post/${id}`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        return response.json();
      })
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id, api]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files?.[0]) {
      data.set("file", files[0]);
    }

    try {
      const response = await fetch(`${api}/post/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  }

  if (redirect) {
    return <Navigate to={`/PostPage/${id}`} />;
  }

  return (
    <form
      className="max-w-4xl mx-auto my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-20"
      onSubmit={updatePost}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Edit Post
      </h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        className="w-full mb-4 p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        className="w-full mb-4 p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
        className="w-full mb-4 p-3 hidden"
        id="file-upload"
        accept="image/*"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center gap-2 px-4 py-2 mb-4 border-2 border-dashed dark:border-gray-700 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="text-gray-600 dark:text-gray-300">
          {files?.[0]?.name || "Choose a new image (optional)"}
        </span>
      </label>

      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        modules={modules}
        formats={formats}
        className="h-64 mb-10 lg:mb-4 md:mb-4 xs:mb-4 "
      />

      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-10"
      >
        Update Post
      </button>
    </form>
  );
}
