export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al crear la cuenta")

  return data
}
