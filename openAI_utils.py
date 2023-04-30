import os
import openai

# Load the keys from a json file
import json

ORGANIZATION_ID = ""
API_KEY = ""
try:
    f = open('keys')
    data = json.load(f)
    ORGANIZATION_ID = data['ORG_KEY']
    API_KEY = data['API_KEY']
except Exception:
    ORGANIZATION_ID = os.environ['ORG_KEY']
    API_KEY = os.environ['API_KEY']
    
openai.organization = ORGANIZATION_ID
openai.api_key = API_KEY

def create_system_message(you, them, onTopic):
    return f"You should act as {you} and respond like how the character is and use the same accent always. Also have sarcasm and be witty in your tone and do not agree to others perspective, if it does not seem correct. You will be talking to {them}. This is a conversation between you both. Always respond with 1 or 2 sentances. Your topic for discussion is {onTopic}."


def generate_chitchat(character1, character2, topic):
    '''Generate Chit Chat using GPT'''
    user1 = character1
    user2 = character2
    conversationCount = 11

    user1_system = create_system_message(user1, user2, topic)
    user2_system = create_system_message(user2, user1, topic)

    user1_response = []
    user2_response = ["Hi"]

    isUser1 = True
    for _ in range(conversationCount):
        # user 1
        if(isUser1):
            prompts = []
            for i, resp in enumerate(user2_response):
                prompts.append({"role": "user", "content": resp})
                if len(user1_response) > i:
                    prompts.append({"role": "assistant", "content": user1_response[i]})
            
        else:
            prompts = []
            for i, resp in enumerate(user1_response):
                prompts.append({"role": "user", "content": resp})
                if len(user2_response)-1 > i:
                    prompts.append({"role": "assistant", "content": user2_response[i+1]})

        system_prompt = [{"role": "system", "content": user1_system} if isUser1 else {"role": "system", "content": user2_system}]
        messages = system_prompt + prompts

        completion = openai.ChatCompletion.create(
                        model="gpt-3.5-turbo",
                        temperature=1,
                        messages=messages)
        
        user1_response.append(completion.choices[0].message.content) if isUser1 else user2_response.append(completion.choices[0].message.content)
        isUser1 = False if isUser1 else True
    

    response = []
    for i, value in enumerate(user2_response):
        response.append({"name": user2, "text": value})
        response.append({"name": user1, "text": user1_response[i]})
    
    del response[0]
    return response


def stream_chitchat(info, topic):
    '''Generate Chit Chat using GPT'''
    user1 = info["character1"]
    user2 = info["character2"]
    isUser1 = info["isUser1"]
    user1_response = info["user1_response"]
    user2_response = info["user2_response"]

    user1_system = create_system_message(user1, user2, topic)
    user2_system = create_system_message(user2, user1, topic)

    # user 1
    if(isUser1):
        prompts = []
        for i, resp in enumerate(user2_response):
            prompts.append({"role": "user", "content": resp})
            if len(user1_response) > i:
                prompts.append({"role": "assistant", "content": user1_response[i]})
        
    else:
        prompts = []
        for i, resp in enumerate(user1_response):
            prompts.append({"role": "user", "content": resp})
            if len(user2_response)-1 > i:
                prompts.append({"role": "assistant", "content": user2_response[i+1]})

    system_prompt = [{"role": "system", "content": user1_system} if isUser1 else {"role": "system", "content": user2_system}]
    messages = system_prompt + prompts

    completion = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    temperature=1,
                    messages=messages)
    
    user1_response.append(completion.choices[0].message.content) if isUser1 else user2_response.append(completion.choices[0].message.content)
    isUser1 = False if isUser1 else True

    new_info = {
        "character1" : user1,
        "character2" : user2,
        "isUser1" : isUser1,
        "user1_response" : user1_response,
        "user2_response" : user2_response
    }

    return {
        "info" : new_info,
        "result" : { "name": user2 if isUser1 else user1, "text": completion.choices[0].message.content }
    }