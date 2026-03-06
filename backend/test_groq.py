from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

completion = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[
        {"role": "user", "content": "Write a one sentence mystery story"}
    ],
)

print(completion.choices[0].message.content)
print(os.getenv("GROQ_API_KEY"))
