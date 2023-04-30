import json

import quart
import quart_cors
from quart import request, stream_with_context, websocket, Quart

import openAI_utils
import asyncio

app = quart_cors.cors(quart.Quart(__name__), allow_origin=["http://localhost:3000", "null", "https://boringengineer.com"])

@app.route("/chitchatgpt/generate", methods=["POST"])
async def generate_chitchat():
    '''Generate the ChitCHat Conversation based on the Given inputs'''
    request_data = await request.get_data()
    request_data = json.loads(request_data)
    print(request_data)

    try:
        response = openAI_utils.generate_chitchat(request_data["character1"], request_data["character2"], request_data["topic"])
        return quart.Response(response=json.dumps(response), status=200, content_type="application/json")
    except Exception:
        print("Error occured when calling OpenAI API: " + Exception)

class WebSocketManager:
    def __init__(self):
        self.connections = set()

    async def connect(self, websocket):
        self.connections.add(websocket)
        #print("**********New Connection**************")

    async def disconnect(self, websocket):
        self.connections.remove(websocket)
        #print("**********Closing Connection************")

    async def handle_chat(self, websocket):
        message = await websocket.receive()
        #print("**********Recieved and Acting on data Connection*********")
        request_data = json.loads(message)

        number_of_conversation = 11
        info = {
            "character1": request_data["character1"],
            "character2": request_data["character2"],
            "isUser1": True,
            "user1_response": [],
            "user2_response": ["Hi"],
        }

        for _ in range(number_of_conversation):
            result = openAI_utils.stream_chitchat(info, request_data["topic"])
            info = result["info"]
            await websocket.send(json.dumps(result["result"]))

websocket_manager = WebSocketManager()

@app.websocket('/chitchatgpt/stream')
async def ws():
    #print("*********Websocket is called********")
    await websocket_manager.connect(websocket)
    try:
        await websocket_manager.handle_chat(websocket)
    except asyncio.CancelledError:
        print("Connection cancelled...")
    finally:
        await websocket_manager.disconnect(websocket)

def main():
    app.run(debug=True, host="0.0.0.0", port=5004)

if __name__ == "__main__":
    main()