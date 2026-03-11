import os
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in environment variables.")
else:
    client = genai.Client(api_key=api_key)
    print("Listing available Gemini models...")
    try:
        # The new SDK list_models returns a list of models
        for m in client.models.list():
            print(f"Model: {m.name}, Supported Methods: {m.supported_generation_methods}")
    except Exception as e:
        print(f"Error listing models: {e}")
