// app/api/image-proxy/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": res.headers.get("content-type"),
      "Access-Control-Allow-Origin": "*"
    }
  });
}
