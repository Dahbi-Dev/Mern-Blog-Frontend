import { useEffect, useState } from "react";
import Post from "./post";

export default function AllPosts(){
    const [posts, setPosts] = useState([])
    useEffect(()=>{
        fetch('https://mern-blog-backend-hmpo.onrender.com:3001/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);

                

            });
        });
    },[]);

    return(
        <>
        
            {posts.length > 0 && posts.map(post => (
               
               <Post key={post._id} {...post} />                
                
                ))}
        
        </> 
    )
}