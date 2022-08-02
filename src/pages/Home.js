import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import {toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [roomid, setroomid] = useState('');
    const [username, setusername] = useState('');
    const navigate = useNavigate();

    const handleNewRoomId =(e) =>{
        e.preventDefault();
        const id = uuidv4();
        setroomid(id)
        toast.success('Created a new room')
    }

    const sendToEditor =()=>{
        if(!roomid || !username){
            toast.error("Please enter valid username and room-id")
            return
        }

        // Send user to editor page with username as props or data

        navigate(`/editor/${roomid}`, {
            state:{
                username,
            }
        })
    }

    const redirectuserEnter = (e) =>{
        if(e.code === 'Enter'){
            sendToEditor();
        }
    }

  return (
    <div className='homePagewrapper'>
        <div className='formWrapper'>
            <div className='logo-name'>
                <img src='/code.png' alt='code-logo'/>
                <h1>Code-Connect</h1>
            </div>
            <h4 className='mainLabel'>Paste invitation room id</h4>
            <div className='inputGroup'>
                <input 
                    type='text' 
                    className='inputBox' 
                    placeholder ='ROOM ID'
                    onChange={(e) => {setroomid(e.target.value)}}
                    value = {roomid}
                    onKeyUp ={redirectuserEnter}
                    />
                <input 
                    type='text' 
                    className='inputBox' 
                    placeholder ='USERNAME'
                    onChange={(e) => {setusername(e.target.value)}}
                    value = {username}
                    onKeyUp ={redirectuserEnter}
                    />
                <button 
                    className ='btn joinBtn'
                    onClick={sendToEditor}
                    >Join</button>
                <span className='createinfo'> If you dont have an invite then create &nbsp;
                <a href='' onClick={handleNewRoomId} className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4>Built with 💛 by &nbsp;<a href ="https://github.com/Shubham75661">Shubham Kotawar</a></h4>
        </footer>
    </div>
  )
}

export default Home