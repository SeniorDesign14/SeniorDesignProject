import psycopg2
import warnings
import pandas as pd
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

def get_dataframes():
    """Get data from PostgreSQL database and return as a dictionary of DataFrames"""
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

    tablenames = ['dininghalls', 'dininghours', 'diningstations', 'schedule', 'menu', 'nutritionalinfo', 'users', 'favoritefoods']
    dataframes = {}
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        for table in tablenames:
            query = f"SELECT * FROM {table};"
            df = pd.read_sql_query(query, conn)
            dataframes[table] = df

    conn.close()
    return dataframes

dataframes = get_dataframes()

# dont hard code this plz

client = OpenAI(api_key=os.getenv("API_KEY_AI"))

def testing_question(question):
    """Ask a question and get a response from the OpenAI API"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": question}
        ],
        max_tokens=300,
        temperature=0.7
    )
    summary = response.choices[0].message.content
    return summary

def testing_question_with_data(question, dataframes=dataframes, model_name="gpt-4o-mini"):
    """Ask a question get a response from the OpenAI API with dataframes as context"""
    prompt = f"Based on the following relational data, answer the question:\n{dataframes}\nQuestion: {question}"
    # logging.debug("prompt: " + prompt)
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "you are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        model=model_name,
        max_tokens=300,
        temperature=0.7
    )
    summary = response.choices[0].message.content
    # logging.debug("summary: " + summary)
    return summary

# def user_input():
    """Get user input and return the response from the OpenAI API with dataframes as context"""
    ab = input("Enter 1 if ask question, 2 if ask question with data: ")
    if ab == "1":
        input_question = input("Enter a prompt: ")
        return testing_question(input_question)
    elif ab == "2":
        input_question = input("Enter a prompt: ")
        return testing_question_with_data(input_question)
    return "Invalid input"

@app.route('/')
def index():
    return "Welcome to the API. Use /datachat to interact with the chatbot."

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data['question']
    if not question:
        return jsonify({'error': 'No question provided'})
    
    response = testing_question(question)
    return jsonify({'response': response})

@app.route('/datachat', methods=['POST'])
def datachat():
    data = request.get_json()
    question = data['question']
    if not question:
        return jsonify({'error': 'No question provided'})
    
    # logging.debug("question: " + question)
    response = testing_question_with_data(question)
    # logging.debug("response: " + response)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)

# Example usage

# for table, df in dataframes.items():
#     print(f"Data from {table}:")
#     print(df.head())

# print(testing_question("Write a story about BTC"))

# print(testing_question_with_data("What are the dining halls?"))

# print(user_input())