import 'dotenv/config';  // Loads .env vars
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',  // Path to your schema
  datasource: {
    url: env('DIRECT_URL')  // Direct Supabase connection for CLI/migrations
  },
  // Optional: Add if you have custom migration paths
  migrations: {
    path: 'prisma/migrations'
  }
});