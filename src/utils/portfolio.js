import directus from './directus';
import { readItems } from "@directus/sdk";

export async function getPortfolioItems() {
    try {
        const response = await directus.request(
            readItems('portfolio', {
                fields: [
                    'id',
                    'title',
                    'subtitle',
                    'image',
                    'tags',
                    'url',
                    'tasks',
                    'skills',
                    'additionTag',
                    'stacks.stack_id.id',
                    'stacks.stack_id.title',
                    'stacks.stack_id.image',
                ],
                sort: ['id'],
            })
        );

        if (!Array.isArray(response)) {
            console.error('Ответ от Directus не является массивом:', response);
            return [];
        }

        // Преобразуем идентификаторы изображений в полные URL
        const portfolioItemsWithImageUrls = response.map(item => ({
            ...item,
            imageUrl: item.image ? `${process.env.DIRECTUS_URL}/assets/${item.image}` : null,
            stacks: item.stacks.map(stack => ({
                ...stack.stack_id,
                imageUrl: stack.stack_id.image ? `${process.env.DIRECTUS_URL}/assets/${stack.stack_id.image}` : null
            }))
        }));

        return portfolioItemsWithImageUrls;
    } catch (error) {
        console.error('Ошибка при получении данных портфолио:', error);
        return [];
    }
}
