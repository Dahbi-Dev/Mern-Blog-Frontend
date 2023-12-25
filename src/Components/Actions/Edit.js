import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from 'react-router-dom';


export default function Edit() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          // setFiles(postInfo.files);
        });
      })
  }, []);

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



  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:3001/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true)

    }

  }

  if (redirect) {
    return <Navigate to={'/PostPage/' + id} />
  }

  return (
    <form className='container' onSubmit={updatePost}>
      <h1>Edit  Post</h1>
      <input type="text" placeholder="title" value={title} onChange={ev => setTitle(ev.target.value)} />
      <input type="summary" placeholder='summary' value={summary} onChange={ev => setSummary(ev.target.value)} />

      <input type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      <ReactQuill value={content} onChange={newvalue => setContent(newvalue)} theme="snow" modules={modules} formats={formats} />
      <button style={{
        marginTop: '5px',
        cursor: 'pointer'
      }} className='' >Update</button>
    </form>

  )
}
