import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages : [],
    conversationON: false,
    character1: '',
    character2: '',
    topic: '',
    errorMessage: '',
    user_typing: undefined
  };

const chatinterfaceSlice = createSlice({
    name: 'chatinterface',
    initialState,

    reducers: {
        UPDATE_MESSAGE: (state, action) => {
            state.messages = action.payload
            state.user_typing = (state.messages[state.messages.length-1])
                ?( (state.messages[state.messages.length-1].name === state.character2)
                    ?state.character1
                    :state.character2 
                    )
                :state.character1
        },

        ADD_MESSAGE: (state, action) => {
            state.messages.push(action.payload)
            state.user_typing = (state.messages[state.messages.length-1])
            ?( (state.messages[state.messages.length-1].name === state.character2)
                ?state.character1
                :state.character2 
                )
            :state.character1
        },

        UPDATE_CONVERSATION_STATUS: (state, action) => {
            state.conversationON = action.payload
        },

        UPDATE_ChitChat_META: (state, action) => {
            state.character1 = action.payload.character1;
            state.character2 = action.payload.character2;
            state.topic = action.payload.topic;
        },

        UPDATE_ERROR_MESSAGE: (state, action) => {
            state.errorMessage = action.payload
        }
    }
})

export const { UPDATE_MESSAGE, ADD_MESSAGE, UPDATE_CONVERSATION_STATUS, UPDATE_ChitChat_META, UPDATE_ERROR_MESSAGE } = chatinterfaceSlice.actions
export default chatinterfaceSlice.reducer