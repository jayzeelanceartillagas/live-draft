export function onRequest() {
  return new Response('google-site-verification: google9a2156e10c8845d3.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
