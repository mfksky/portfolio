import directus from './directus';
import { readItems } from "@directus/sdk";

// Функция для экспоненциальной задержки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Функция для повторных попыток с экспоненциальной задержкой
async function retryWithExponentialBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            const delayTime = baseDelay * Math.pow(2, attempt);
            console.log(`Попытка ${attempt + 1} не удалась. Повтор через ${delayTime}мс...`);
            await delay(delayTime);
        }
    }
}

export async function getPortfolioItems() {
    return retryWithExponentialBackoff(async () => {
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
                        'gallery.directus_files_id',
                        'gallery.directus_files_id.id',
                        'gallery.directus_files_id.title',
                        'gallery.directus_files_id.description',
                        'additionTag',
                        'stacks.stack_id.id',
                        'stacks.stack_id.title',
                        'stacks.stack_id.image',
                        'about'
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
                gallery: item.gallery.map(galleryItem => ({
                    id: galleryItem.id,
                    imageUrl: galleryItem.directus_files_id
                        ? `${process.env.DIRECTUS_URL}/assets/${galleryItem.directus_files_id.id}`
                        : null,
                    alt: galleryItem.directus_files_id?.title || '',
                    title: galleryItem.directus_files_id?.description || '',
                })),
                stacks: item.stacks.map(stack => ({
                    ...stack.stack_id,
                    imageUrl: stack.stack_id.image ? `${process.env.DIRECTUS_URL}/assets/${stack.stack_id.image}` : null
                }))
            }));

            return portfolioItemsWithImageUrls;
        } catch (error) {
            console.error('Ошибка при получении данных портфолио:', error);
            throw error; // Перебрасываем ошибку для обработки в retryWithExponentialBackoff
        }
    });
}