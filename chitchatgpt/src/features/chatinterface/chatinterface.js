import React, { useEffect } from 'react';
import './chatinterface.css';

import { UPDATE_MESSAGE, ADD_MESSAGE, UPDATE_CONVERSATION_STATUS, UPDATE_ChitChat_META, UPDATE_ERROR_MESSAGE } from './chatinterfaceSlice'
import { useSelector, useDispatch } from 'react-redux';

//const BASE_URL_DOMAIN = "localhost:5004"
//const BASE_URL = "http://localhost:5004"

const BASE_URL_DOMAIN = "chit-chat-gpt.herokuapp.com"
const BASE_URL = "https://chit-chat-gpt.herokuapp.com"

const ChatInterface = () => {

    const messages = useSelector((state) => state.chatinterface.messages)
    const conversationON = useSelector((state) => state.chatinterface.conversationON)
    const character1 = useSelector((state) => state.chatinterface.character1)
    const character2 = useSelector((state) => state.chatinterface.character2)
    const topic = useSelector((state) => state.chatinterface.topic)
    const errorMessage = useSelector((state) => state.chatinterface.errorMessage)
    const dispatch = useDispatch()
    
    useEffect(
        () => {
            dispatch(
                UPDATE_MESSAGE(
                    []
                ))
        },[]
    )

    const onChitChatMetaChange = React.useCallback((event) => {
        const eventTitle = event.target.title
        const eventValue = event.target.value.trim()

        if(eventTitle === 'character1') {
            dispatch(UPDATE_ChitChat_META({character1: eventValue, character2, topic}))
        }
        else if(eventTitle === 'character2') {
            dispatch(UPDATE_ChitChat_META({character1, character2: eventValue, topic}))
        }
        else {
            dispatch(UPDATE_ChitChat_META({character1, character2, topic: eventValue}))
        }
    })

    const onGenerateChitChat = React.useCallback((event) => {
        if(conversationON === false) {
            if(character1 === "" || character2 === "" || topic === "") {
                dispatch(UPDATE_ERROR_MESSAGE("fields cannot be empty..."))
            }
            else if (false) {
                dispatch(UPDATE_ERROR_MESSAGE(""))
                dispatch(UPDATE_CONVERSATION_STATUS(true))

                const requestData = {
                    "character1": character1,
                    "character2": character2,
                    "topic": topic
                }

                fetch(BASE_URL + '/chitchatgpt/generate', {
                    method: "POST",
                    Headers: {"Content-type": "application/json"},
                    body: JSON.stringify(requestData)
                })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    dispatch(UPDATE_CONVERSATION_STATUS(false))
                    dispatch(UPDATE_MESSAGE(json))
                })
                .catch(err => {
                    console.log(err)
                    dispatch(UPDATE_CONVERSATION_STATUS(false))
                    dispatch(UPDATE_MESSAGE([]))
                })
            }
            else {
                dispatch(UPDATE_ERROR_MESSAGE(""))
                dispatch(UPDATE_CONVERSATION_STATUS(true))
                dispatch(UPDATE_MESSAGE([]))

                const url = 'ws://' + BASE_URL_DOMAIN + '/chitchatgpt/stream';
                const requestData = {
                    "character1": character1,
                    "character2": character2,
                    "topic": topic
                }

                const socket = new WebSocket(url);

                socket.addEventListener('open', (event) => {
                  socket.send(JSON.stringify(requestData));
                });
            
                socket.addEventListener('message', (event) => {
                    console.log(event.data)
                    const receivedData = JSON.parse(event.data);
                    dispatch(ADD_MESSAGE(receivedData))
                });
            
                socket.addEventListener('error', (event) => {
                    dispatch(UPDATE_CONVERSATION_STATUS(false))
                    console.error('WebSocket error:', event);
                });
            
                socket.addEventListener('close', (event) => {
                    dispatch(UPDATE_CONVERSATION_STATUS(false))
                    console.log('WebSocket closed:', event);
                });
            }
        }
        else {
            dispatch(UPDATE_ERROR_MESSAGE("previous request is being processed..."))
        }
    })

    

    return (
        <div className="chat-container">

            <div className='chat-title'>ChitChatting Generative Pre-Trained Transformer</div>
            
            <div className='chat-input-form'>
                <input title='character1' type="text" className='input-text-rounded' placeholder='Character 1' onChange={onChitChatMetaChange}></input>
                <input title='character2' type="text" className='input-text-rounded' placeholder='Character 2' onChange={onChitChatMetaChange}></input>
                <input title='topic' type="text" className='input-text-rounded' placeholder='Topic' onChange={onChitChatMetaChange}></input>
                <button type="button" className='input-button-rounded' onClick={onGenerateChitChat}>Generate</button>
                <div className='input-text-error'>{conversationON?errorMessage:""}</div>
            </div>

            <div className="chat-window">
                {messages.map((message, index) => (
                    <div key={index} className={index % 2=== 0 ? 'chat-message chat-message-alternate' : 'chat-message'}>
                    <div className='chat-avatar'>{message.name.slice(0,2)}</div>
                    <div className='chat-message-text'>
                        <div className="chat-name">{message.name}</div>
                        <div className="chat-text">{message.text}</div>
                    </div>
                    </div>
                ))}
                <div className='chat-typing'></div>
            </div>
        </div>
    );
};

export default ChatInterface;
