// Web Worker — busca cotacoes em background sem travar a UI
self.onmessage = async function(e) {
  const { url } = e.data

  try {
    const res  = await fetch(url)
    const data = await res.json()
    self.postMessage({ success: true, data })
  } catch (err) {
    self.postMessage({ success: false, error: err.message })
  }
}