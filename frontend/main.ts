import app from "./src/index.tsx"

const port = Number(Deno.env.get("PORT")) || 3000
console.log(`Listening on http://localhost:${port}`)

Deno.serve({ port }, (req) => app.fetch(req))
