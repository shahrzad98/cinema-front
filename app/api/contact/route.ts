export async function POST(req: Request) {
  const body = await req.json();

  const base = process.env.API_BASE;
  if (!base) {
    return new Response(JSON.stringify({ error: "API_BASE is not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL("/contact", base);

  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // اگر نیاز داری کوکی/هدر خاصی پاس بده، اینجا اضافه کن
  });

  const text = await upstream.text();

  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json"
    }
  });
}


export async function GET() {
  return new Response("OK");
}