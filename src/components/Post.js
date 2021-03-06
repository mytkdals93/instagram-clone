import React, { useState,useEffect } from 'react'
import './Post.css'
// import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post({user,postId, username, imageUrl,caption}) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp",'asc')
            .onSnapshot(snapshot=>{
                setComments(
                    snapshot.docs.map((doc)=>doc.data())
                )
            })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])
    const postComment = (e)=>{
        e.preventDefault();
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("")

    }
    return (
        <div className="post">
        <div className="post__header">
        {/* <Avatar 
            className="post__avatar"
            alt='RafehQaizi'
            src="https://picsum.photos/100"
        /> */}
        <h3>{username}</h3>
        </div>
        <img className="post__image" src={imageUrl} alt="" srcset=""/>
        <h4 className="post__text">
        <strong>{username}</strong>
        <br/>
            {caption}
        </h4>
        <div className="post__comments">
 
        {
            comments.map((comment)=>(
                <p>
                    <strong>{comment.username}</strong> {comment.text}
                </p>
            ))
        }
        </div>

        <form className="post__commentBox" onSubmit={postComment}>
            <input 
            className="post__input"
             type="text"
             placeholder={user ? "Add a comment":"Login please"}
             value={comment}
             onChange = {e =>setComment(e.target.value)}
             disabled={!user}
             />
             <button className="post__button"
             disabled ={!comment}
             type="submit"
             >
                 Post
             </button>
        </form>
        </div>
    )
}

export default Post
