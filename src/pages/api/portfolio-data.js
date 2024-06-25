import { getPortfolioItems } from '../../utils/portfolio';

export async function GET() {
	const portfolioItems = await getPortfolioItems();
	return new Response(JSON.stringify(portfolioItems), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}