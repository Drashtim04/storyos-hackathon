from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Ensure .env is loaded into environment variables (e.g. GROQ_API_KEY)
load_dotenv()


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_key: str = ""
    groq_api_key: str = ""
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    app_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
