
export const getImagenUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url  
    return `${import.meta.env.VITE_API_URL}${url}` 
}