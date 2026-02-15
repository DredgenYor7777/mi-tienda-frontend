// src/api.js

// Si estamos en mi compu (localhost), usa el backend local.
// Si ya subí esto a internet, usa la URL de la nube.
// (Por ahora, vamos a forzar la de la nube para probar)

export const API_URL = "https://api-mi-ecommerce.onrender.com"; 
//local 
//export const API_URL = "http://localhost:3000";
// Ejemplo: "https://api-mi-ecommerce.onrender.com"
// ¡IMPORTANTE! NO le pongas la barra al final (/), solo hasta .com