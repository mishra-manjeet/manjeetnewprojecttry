async function fetchJobs(q) {
  const apiUrl = q ? `/api/jobs?q=${encodeURIComponent(q)}` : '/api/jobs'
  try {
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('API unavailable')
    return await res.json()
  } catch (e) {
    // fallback to static JSON in /data/jobs.json
    const staticUrl = '/data/jobs.json'
    const res2 = await fetch(staticUrl)
    let jobs = await res2.json()
    if (q) {
      const term = q.toLowerCase()
      jobs = jobs.filter(j => (j.title || '').toLowerCase().includes(term) || (j.organization || '').toLowerCase().includes(term) || (j.location || '').toLowerCase().includes(term))
    }
    return jobs
  }
}

function renderList(jobs) {
  const el = document.getElementById('list')
  if (!jobs || jobs.length === 0) {
    el.innerHTML = '<li>No jobs found</li>'
    return
  }
  el.innerHTML = jobs.map(j => `
    <li><a href="/jobs/${j.id}">${escapeHtml(j.title)}<span>${escapeHtml(j.organization)} • ${escapeHtml(j.location)}</span></a></li>
  `).join('')
}

function escapeHtml(s) {
  if (!s) return ''
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])
}

const searchBtn = document.getElementById('searchBtn')
if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    const q = document.getElementById('q').value.trim()
    const jobs = await fetchJobs(q)
    renderList(jobs)
  })
}

fetchJobs().then(renderList)
