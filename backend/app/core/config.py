from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "FounderOS API"
    API_V1_PREFIX: str = "/api/v1"
    APP_ENV: str = "development"
    DATABASE_URL: str = "postgresql://portfolio:portfolio@db:5432/portfolio"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_COOKIE_NAME: str = "founderos_refresh"
    LOGIN_RATE_LIMIT: int = 10
    LOGIN_RATE_WINDOW_SECONDS: int = 60
    BCRYPT_ROUNDS: int = 12
    CORS_ORIGINS: str = "http://localhost:13000,http://frontend:3000"
    MEDIA_ROOT: str = "/data/media"
    TENANT_ID: str = "default"
    GITHUB_TOKEN: str = ""
    GITHUB_USERNAME: str = "soumenkarmakar"
    YOUTUBE_API_KEY: str = ""
    YOUTUBE_CHANNEL_ID: str = ""
    ADMIN_EMAIL: str = "admin@soumenkarmakar.com"
    ADMIN_PASSWORD: str = "admin123"
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    NOTIFY_EMAIL: str = ""
    SITE_URL: str = "http://localhost:13000"
    FORM_RATE_LIMIT: int = 10
    FORM_RATE_WINDOW_SECONDS: int = 3600

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"


settings = Settings()
