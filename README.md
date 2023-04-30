# chit-chat-gpt

## Introduction
This is a fun project that makes GPT talk to GPT and have a conversation about any topic.

Have you ever wondered what a conversation between your favorite characters would sound like, or wanted to see how two entirely different personas might interact with each other or make fictional conversations between companies, drinks, seasons and many more ? Now you can, with the free Chit-Chat-GPT application powered by OpenAI GPT3.5 turbo model that brings fictional conversations to life!

## Example Screenshots

![ChitChat Google Vs Microsoft](https://user-images.githubusercontent.com/17029551/235376360-dff6fa00-8505-4846-af72-aad55d1ae731.jpg)
![ChitChat Beer Vs Wine](https://user-images.githubusercontent.com/17029551/235376361-c0321c9e-f726-4b78-9980-78ac7fbf8a99.jpg)
![ChitChat Indian Food Vs Mexican Food](https://user-images.githubusercontent.com/17029551/235376362-84cbda07-a7ca-4967-97ba-44ccc0c10cd4.jpg)
![ChitChat Biden Vs Trump](https://user-images.githubusercontent.com/17029551/235376363-6ca34d45-95b5-4ca3-9f6b-d8a7ba82525e.jpg)

## The idea
1. This simple, yet engaging, web application allows users to enter two character names and a topic that the characters should speak about. By harnessing the power of GPT-3.5-turbo, I have created a web page that generates entertaining conversations based on the characters and topics you choose.
2. This is also a way to evaluate how these models are trained and tuned to respond, avoiding hate speeches, being less aggressive and as polite as possible during conversations.
3. This can be improved to make two different models talk to each other or debate and we can evaluate the smartest ones.

## How it works
Behind the scenes, this utilizes two instances of OpenAI GPT, one for each character. These AI-driven language models engage in a dynamic conversation about the chosen topic, resulting in a fascinating back-and-forth that you can watch unfold. The conversation is limited to exchanges only 10 messages now.

## Technology Used
1. Front End: React framework (Javascript, CSS, HTML)
2. Backend: Python 3.11, Quart framework for service, hosted in Heroku
