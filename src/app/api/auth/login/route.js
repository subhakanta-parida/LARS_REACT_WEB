export async function POST() {
  return Response.json(
    { message: 'LARS authentication is not configured.' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}