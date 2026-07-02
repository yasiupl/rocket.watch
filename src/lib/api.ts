export async function fetchFromApi(path: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params);
  searchParams.append('path', path);

  const res = await fetch(`/api/launches?${searchParams.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function fetchSources() {
  const res = await fetch('/api/sources');
  if (!res.ok) {
    throw new Error('Failed to fetch sources');
  }
  return res.json();
}
