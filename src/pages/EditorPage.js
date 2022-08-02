import toast from 'react-hot-toast'
import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';
import ACTIONS from './Actions';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate()
  const {roomid} = useParams(); 
  const [clients, setclients] = useState([])

  useEffect(() => {
    const init = async() =>{
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error',(err) => handleError(err))
      socketRef.current.on('connect_failed',(err) => handleError(err))

      function handleError(err){
        console.log(err);
        toast.error('Connection error')
        reactNavigator('/');
      }


      socketRef.current.emit(ACTIONS.JOIN, {
        roomid,
        username : location.state.username
      })

      socketRef.current.on(ACTIONS.JOINED, ({client, socketid, username}) =>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`)
          console.log(`${username} Joined`)
        }
        setclients(client)
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          socketid,
          code : codeRef.current,
        });
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketid, username}) =>{
        toast.success(`${username} left the chat`)
        setclients((prev) =>{
          return prev.filter((client) => client.socketid !== socketid)
        })
      })
    }
    init();
    return () =>{
      socketRef.current.disconnect()
      socketRef.current.of(ACTIONS.JOINED)
      socketRef.current.of(ACTIONS.DISCONNECTED)
    }
  }, [])
  
  const copyroomid = async() =>{
    try{
      await navigator.clipboard.writeText(roomid)
      toast.success('Copied roomID')
    }catch(err){
      toast.error('Error')
      console.log(err)
    }
  }

  const leaveroom =() =>{
    reactNavigator('/');
  } 

  if(!location.state){
    return <Navigate to='/'/>
  }
  return (
    <div className='mainwrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo-editor'>
            <img src='/code.png' alt='code-logo'/>
            <h2>Code-Connect</h2>
          </div>
          <h3>Connected</h3>
          <div className='Clientlist'>
            {clients.map(client =>(
              <Client 
                key={client.socketid}
                username ={client.username}
              />
            )) }
          </div>
        </div>
      <button className='btn copybtn' onClick={copyroomid}>copy roomid</button>
      <button className='btn leavebtn' onClick ={leaveroom}>leave</button>
      </div>

      <div className='editorwrap'>
          <Editor socketRef ={socketRef} roomid ={roomid} 
          changeCode = {(code) =>
          {
            codeRef.current = code
          }}/>    
      </div>

    </div>
  )
}

export default EditorPage