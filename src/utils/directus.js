import { createDirectus, rest, staticToken } from '@directus/sdk';
import dotenv from 'dotenv';
dotenv.config();

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_TOKEN))
  .with(rest());

//await directus.login(process.env.DIRECTUS_EMAIL, process.env.DIRECTUS_PASSWORD);

export default directus;