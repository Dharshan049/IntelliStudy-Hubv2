import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
        url: "postgresql://neondb_owner:W8MKzriPf7Vw@ep-white-violet-a5uzjllz.us-east-2.aws.neon.tech/LMS-AI-Gen?sslmode=require"

  }
});