import directus from './directus';
import { readItems } from '@directus/sdk';

export async function fetchSEOData(pageId) {
	const seoData = await directus.request(
		readItems('seo', {
			filter: {
				page_id: pageId,
			},
			fields: ['post_id', 'title', 'description'],
		})
	);

	return seoData[0];
}