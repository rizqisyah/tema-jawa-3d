const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const DEFAULT_SLUG = import.meta.env.VITE_DEFAULT_SLUG || 'tema-jawa'

export function resolveSlug(): string {
  if (typeof window === 'undefined') return DEFAULT_SLUG
  const searchParams = new URLSearchParams(window.location.search)
  const querySlug = searchParams.get('slug')
  if (querySlug) return querySlug

  const segments = window.location.pathname.split('/').filter(Boolean)
  if (segments.length === 0) return DEFAULT_SLUG

  const last = segments[segments.length - 1]
  const reservedThemes = ['temajawa', 'tema-jawa', 'tema-jawa-3d', 'tema3dbasic']
  if (reservedThemes.includes(last.toLowerCase())) {
    return DEFAULT_SLUG
  }
  return last
}

async function request(path: string, options: RequestInit = {}, retries = 2): Promise<any> {
  let lastError: any = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
      })

      let payload: any = null
      try {
        payload = await res.json()
      } catch {
        // Non-JSON response
      }

      if (!res.ok || (payload && payload.success === false)) {
        const message = (payload && payload.message) || `Request failed (${res.status})`
        // Retry only on 5xx or server errors, not on 404/403
        if (res.status >= 500 && attempt < retries) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
          continue
        }
        throw new Error(message)
      }

      return payload
    } catch (err: any) {
      lastError = err
      if (err.message && (err.message.includes('404') || err.message.includes('403') || err.message.includes('privat'))) {
        throw err
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
        continue
      }
    }
  }
  throw lastError || new Error('Network error')
}

export async function getHome(slug: string, to = ''): Promise<any> {
  const query = to ? `?to=${encodeURIComponent(to)}` : ''
  const payload = await request(`/v1/service/menu/getHome/${encodeURIComponent(slug)}${query}`)
  return payload?.data ?? null
}

export async function submitRsvp(slug: string, body: any): Promise<any> {
  return request(`/v1/service/menu/hadir2/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function submitUcapan(slug: string, body: any): Promise<any> {
  return request(`/v1/service/menu/ucapan/${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
