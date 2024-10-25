import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';

export default function CreatePost() {
  const api = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  async function createNewPost(ev) {
    ev.preventDefault();
    
    if (!files?.[0]) {
      alert('Please select an image file');
      return;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    try {
      const response = await fetch(`${api}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }
    
  return (
    <form 
      className="max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-20"
      onSubmit={createNewPost}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Post</h1>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        className="w-full mb-4 p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        className="w-full mb-4 p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
        className="w-full mb-4 p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        required
        accept="image/*"
      />
      
      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        modules={modules}
        formats={formats}
        className="h-64 mb-4"
      />

      <button
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-10"
        type="submit"
      >
        Create Post
      </button>
    </form>
  );
}
