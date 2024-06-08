import directus from './directus';
import { readItems } from "@directus/sdk";

export async function fetchSEOData(pageId) {
	try {
		const seoData = await directus.request(
			readItems('seo', {
				filter: {
					page_id: pageId,
				},
				fields: ['post_id', 'title', 'description', 'lang', 'fonts'],
			})
		);

		return seoData[0];
	} catch (error) {
		console.error('Error fetching SEO data:', error);
		return null;
	}
}