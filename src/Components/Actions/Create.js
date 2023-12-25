import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom';

function Create() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('')

    const [redirect ,setRedirect] = useState(false)

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
        const data = new FormData()
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        ev.preventDefault();
    
    const response = await fetch('http://localhost:3001/post', {
            method: 'post',
            body: data,
            credentials: 'include',
        })

        if(response.ok){
            setRedirect(true)
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    
    return (
        <form className='container' onSubmit={createNewPost}>
            <h1>Create New Post</h1>
            <input type="title" placeholder='title' value={title} onChange={ev => setTitle(ev.target.value)} />
            <input type="summary" placeholder='summary' value={summary} onChange={ev => setSummary(ev.target.value)} />
            
            <input type="file"
                // value={files}
                onChange={ev => setFiles(ev.target.files)}
            />
            <ReactQuill value={content} onChange={newvalue => setContent(newvalue)} theme="snow" modules={modules} formats={formats} />
            <button style={{ marginTop: '5px',
        cursor:' pointer' }} className='' >Create</button>
        </form>

    )
}

export default Create