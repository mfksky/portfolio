import { createDirectus, rest, authentication } from '@directus/sdk';

type Global = {
  title: string;
};

type Schema = {
  global: Global;
};

const directus = createDirectus<Schema>('http://147.45.246.185:8055')
  .with(rest())
  .with(authentication('json'));

await directus.login('mfksky@icloud.com', 'mainloginDIRECTUSPORTFOLIO1905!');

export default directus;