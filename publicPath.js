// Этот файл будет использоваться для корректировки путей в production
if (process.env.NODE_ENV === 'production') {
  // Устанавливаем базовый путь для GitHub Pages
  const script = document.currentScript;
  if (script) {
    const src = script.src;
    const baseUrl = src.substring(0, src.lastIndexOf('/') + 1);
    window.__webpack_public_path__ = baseUrl;
  }
}