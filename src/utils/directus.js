import { createDirectus, rest, authentication } from '@directus/sdk';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DIRECTUS_URL || !process.env.DIRECTUS_EMAIL || !process.env.DIRECTUS_PASSWORD) {
  throw new Error('Directus environment variables are not set');
}
const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication('json'));

await directus.login(process.env.DIRECTUS_EMAIL, process.env.DIRECTUS_PASSWORD);

export default directus;