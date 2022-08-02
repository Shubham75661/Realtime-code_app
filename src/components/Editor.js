import React, { useEffect, useRef } from 'react';
import codemirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../pages/Actions';


const Editor = ({socketRef, roomid, changeCode}) => {
  const editorRef = useRef(null)
  useEffect(() =>{
    async function init (){
      
      editorRef.current = codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),{
        mode : {name :'javascript', json : true},
        theme : 'dracula',
        AutoCloseTags : true,
        autoCloseBrackets : true,
        lineNumbers : true
      })

      editorRef.current.on('change', (instance, changes) =>{
        const {origin} = changes
        const code = instance.getValue()
        changeCode(code)
        if(origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomid,
            code,
          })
        }
      })
    }
    init();
  },[])

  useEffect(() =>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) =>{
        if(code !== null){
          editorRef.current.setValue(code)
        }
      })
    }
  },[socketRef.current])


  return (
    <div>
        <textarea id='realtimeEditor'></textarea>
    </div>
  )
}

export default Editor