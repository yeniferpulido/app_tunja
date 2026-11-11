# Tunja sobre Ruedas

Aplicación web móvil para presentar recorridos, actividades y una experiencia de movilidad urbana para Tunja, con acceso público mediante código QR.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

La aplicación quedará disponible en http://localhost:5173.

## Publicación web y QR

1. Publica la app en un dominio real, por ejemplo Vercel, Netlify o GitHub Pages.
2. Define la variable de entorno `VITE_PUBLIC_APP_URL` con la URL pública final.
3. Abre la ruta `/#/admin` o la sección administrativa dentro de la app.
4. Genera e imprime el QR desde el panel administrativo para usarlo en carteles, afiches o espacios físicos.

La URL pública debe mantenerse estable para que el QR siga funcionando aunque se actualicen el contenido o el diseño de la aplicación.

## Funcionalidades incluidas

- Landing page adaptada a móviles.
- Acceso sin crear cuenta.
- Pantalla administrativa para generar QR en PNG y SVG.
- Diseño de QR con identidad visual institucional de la app.
