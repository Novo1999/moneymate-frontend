const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

/**
 * Uploads an image file to imgBB and returns the hosted URL.
 * Uses plain fetch (not axiosInstance) — imgBB is an external host and must not
 * receive our auth headers.
 */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY')

  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`${IMGBB_UPLOAD_URL}?key=${key}`, { method: 'POST', body: form })
  const json = await res.json().catch(() => null)
  const url = json?.data?.url
  if (!res.ok || typeof url !== 'string') {
    console.error('imgBB upload failed', { status: res.status, response: json })
    throw new Error(json?.error?.message ?? 'Image upload failed')
  }
  return url
}
