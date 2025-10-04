import requests
import pyttsx3
import speech_recognition as sr

# Initialize text-to-speech
engine = pyttsx3.init()

# FastAPI endpoint
QUERY_URL = "http://127.0.0.1:8000/query"

# Initialize speech recognizer
recognizer = sr.Recognizer()
mic = sr.Microphone()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    with mic as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    try:
        query = recognizer.recognize_google(audio)
        print(f"You said: {query}")
        return query
    except sr.UnknownValueError:
        print("Sorry, I could not understand audio")
        return None

def ask_backend(question):
    payload = {"question": question}
    try:
        response = requests.post(QUERY_URL, json=payload)
        answer = response.json().get("answer", "No answer received.")
        return answer
    except Exception as e:
        return f"Error contacting server: {e}"

# Main loop
while True:
    question = listen()
    if question:
        answer = ask_backend(question)
        print(f"Answer: {answer}")
        speak(answer)
