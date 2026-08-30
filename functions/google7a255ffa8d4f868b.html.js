export function onRequest() {
  return new Response('google-site-verification: google7a255ffa8d4f868b.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
