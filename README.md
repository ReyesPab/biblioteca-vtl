# 📚 BiblioVirtual - Biblioteca Digital

Biblioteca virtual completa con sistema de administración, soporte para PDFs, organización por categorías (estudio/carreras y ficción), y acceso mediante enlaces y códigos QR.

## ✨ Características

- 📖 **Lectura en línea** - Lee libros directamente en el navegador
- 📄 **Soporte PDF** - Sube y visualiza libros en formato PDF
- 🎓 **Organización por carreras** - Clasifica libros por tipo de estudio y materia
- ✨ **Ficción y entretenimiento** - Romance, terror, fantasía y más géneros
- 🔍 **Búsqueda y filtros** - Encuentra libros rápidamente
- 📱 **Códigos QR** - Comparte acceso mediante QR
- 👨‍💼 **Panel de administración** - Gestiona libros fácilmente
- 💾 **Descargas** - Los usuarios pueden descargar libros
- 🖨️ **Impresión** - Imprime libros directamente

## 🚀 Despliegue en GitHub Pages

### Opción 1: Despliegue Manual (Recomendado)

1. **Crea un repositorio en GitHub**
   - Ve a [github.com/new](https://github.com/new)
   - Nombre: `biblioteca-virtual` (o el que prefieras)
   - Hazlo público
   - NO inicialices con README

2. **Sube tu código**
   ```bash
   # En la carpeta de tu proyecto
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/biblioteca-virtual.git
   git push -u origin main
   ```

3. **Configura GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Click en **Settings** (Configuración)
   - En el menú lateral, busca **Pages**
   - En **Source**, selecciona **GitHub Actions**
   - Crea un workflow o usa el que está en `.github/workflows/deploy.yml`

4. **Accede a tu biblioteca**
   - Tu sitio estará en: `https://TU-USUARIO.github.io/biblioteca-virtual/`

### Opción 2: Despliegue con Vercel (Más Fácil)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Click en **New Project**
4. Importa tu repositorio
5. Vercel detectará automáticamente que es Vite
6. Click en **Deploy**
7. ¡Listo! Tu sitio estará en `https://biblioteca-virtual.vercel.app`

### Opción 3: Despliegue con Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión con GitHub
3. Click en **Add new site** → **Import an existing project**
4. Selecciona tu repositorio
5. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click en **Deploy site**

## 🔐 Acceso de Administrador

- **Contraseña por defecto**: `admin123`
- Para cambiarla, edita `src/context/LibraryContext.tsx` línea ~180
- Busca: `if (password === 'admin123')`
- Cambia `admin123` por tu contraseña

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
biblioteca-virtual/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Estado global (LibraryContext)
│   ├── pages/            # Páginas principales
│   ├── utils/            # Utilidades (PDF, etc.)
│   ├── types.ts          # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos estáticos
└── package.json          # Dependencias
```

## 🎨 Personalización

### Cambiar colores
Edita `src/types.ts` en la sección `COVER_COLORS`

### Agregar categorías
Edita `src/types.ts`:
- `STUDY_CATEGORIES` para carreras/materias
- `FICTION_CATEGORIES` para géneros de ficción

### Cambiar el nombre
Edita `index.html` y busca `<title>`

## 📝 Notas Importantes

- Los libros se guardan en `localStorage` del navegador
- Tamaño máximo de PDF: 4MB (por limitaciones de localStorage)
- Para producción con muchos libros, considera usar una base de datos real

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una sugerencia, abre un issue.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ usando React, Vite y Tailwind CSS**
