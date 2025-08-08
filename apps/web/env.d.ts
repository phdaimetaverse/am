/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL?: string;
    OPENAI_API_KEY?: string;
    TURN_URL?: string;
    TURN_USER?: string;
    TURN_PASS?: string;
  }
}

