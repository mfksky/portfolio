import { createDirectus, rest, readItem, createItem } from '@directus/sdk';

const directus = createDirectus(import.meta.env.PUBLIC_DIRECTUS_URL)
    .with(rest())
    .with(readItem())
    .with(createItem());

export default directus;