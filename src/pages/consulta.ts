import type { APIRoute } from 'astro';
import ApisNetPe from '~/utils/reniec.ts';

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const identifier = url.searchParams.get('identifier');

  const api = new ApisNetPe('apis-token-9050.HaViptSB-lzKv6U21Y00LcjT6iU2DFIh');

  let data;
  try {
    if (type === 'dni' && identifier) {
      data = await api.getPerson(identifier);
    } else if (type === 'ruc' && identifier) {
      data = await api.getCompany(identifier);
    }

    if (data) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'No data found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
