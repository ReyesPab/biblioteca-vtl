# 📚 BiblioVirtual - Biblioteca Digital

Una biblioteca virtual completa con soporte para PDFs, organizada por carreras y géneros literarios.

## ✨ Características

- 📄 **Soporte PDF completo** - Sube, lee y descarga libros en PDF
- 🎓 **Organización por carreras** - 15 categorías de estudio (Medicina, Derecho, Ingeniería, etc.)
- ✨ **Géneros de ficción** - 12 categorías (Romance, Terror, Fantasía, etc.)
- 🔍 **Búsqueda inteligente** - Busca por título, autor o tema
- 🎯 **Filtros avanzados** - Combina categoría y subcategoría
- 📱 **Códigos QR** - Comparte acceso fácilmente
- 👨‍💼 **Panel de administración** - Gestiona libros con contraseña
- 💾 **Datos persistentes** - Todo se guarda en localStorage
- 📱 **Diseño responsive** - Funciona en móvil, tablet y desktop

## 🚀 Despliegue en Vercel (Paso a Paso)

### **PASO 1: Crear cuenta en GitHub**

1. Ve a [github.com](https://github.com)
2. Haz clic en **"Sign up"** (arriba a la derecha)
3. Completa el formulario con tu email
4. Verifica tu cuenta desde el email que te enviarán

### **PASO 2: Crear un nuevo repositorio**

1. En GitHub, haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
2. Llena los datos:
   - **Repository name**: `biblioteca-virtual` (o el nombre que prefieras)
   - **Description**: `Biblioteca virtual con soporte PDF`
   - **Public** ✅ (debe ser público)
   - ❌ **NO marques** "Add a README file"
   - ❌ **NO marques** "Add .gitignore"
   - ❌ **NO marques** "Choose a license"
3. Haz clic en **"Create repository"**

### **PASO 3: Subir tu código a GitHub**

Abre una terminal en la carpeta de tu proyecto y ejecuta estos comandos **uno por uno**:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Biblioteca virtual - primera versión"

# Cambiar a la rama main
git branch -M main

# Conectar con tu repositorio (CAMBIA "TU-USUARIO" por tu nombre de GitHub)
git remote add origin https://github.com/TU-USUARIO/bibliotecavirtual.git

# Subir el código
git push -u origin main
```

**Nota importante**: Cuando te pida autenticación, usa un **Personal Access Token** en lugar de tu contraseña:
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre (ej: "vercel-deploy")
4. Selecciona el scope **"repo"** (primer checkbox)
5. Haz clic en **"Generate token"**
6. **Copia el token inmediatamente** (solo se muestra una vez)
7. Úsalo como contraseña cuando Git te lo pida

### **PASO 4: Crear cuenta en Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** (arriba a la derecha)
3. Selecciona **"Continue with GitHub"** (la opción más fácil)
4. Autoriza a Vercel para acceder a tu cuenta de GitHub

### **PASO 5: Importar tu proyecto en Vercel**

1. En Vercel, haz clic en **"Add New..."** → **"Project"**
2. Verás una lista de tus repositorios de GitHub
3. Busca **"biblioteca-virtual"** y haz clic en **"Import"**
4. Vercel detectará automáticamente que es un proyecto Vite
5. **No necesitas cambiar nada** en la configuración:
   - Framework Preset: Vite (detectado automáticamente)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Haz clic en **"Deploy"**

### **PASO 6: Esperar el despliegue**

1. Vercel construirá tu proyecto (tarda 1-2 minutos)
2. Verás el progreso en pantalla
3. Cuando termine, verás **"Congratulations!"** con tu URL
4. Tu biblioteca estará en: `https://biblioteca-virtual.vercel.app` (o el nombre que elegiste)

### **PASO 7: ¡Listo! Tu biblioteca está en línea**

- ✅ Tu URL permanente: `https://tu-proyecto.vercel.app`
- ✅ Se actualiza automáticamente cuando hagas push a GitHub
- ✅ HTTPS incluido gratis
- ✅ Sin límite de tiempo

## 🔐 Acceso de Administrador

- **Contraseña por defecto**: `admin123`
- Para cambiarla, edita `src/context/LibraryContext.tsx` línea ~180
- Busca: `if (password === 'admin123')`
- Cambia `admin123` por tu nueva contraseña

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (http://localhost:5173)
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 📁 Estructura del Proyecto

```
biblioteca-virtual/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   └── BookCard.tsx
│   ├── context/          # Estado global
│   │   └── LibraryContext.tsx
│   ├── pages/            # Páginas principales
│   │   ├── Home.tsx
│   │   ├── BrowseBooks.tsx
│   │   ├── BookReader.tsx
│   │   ├── QRPage.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── utils/            # Utilidades
│   │   └── pdfUtils.ts
│   ├── types.ts          # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── tsconfig.json
```

## 🎨 Personalización

### Cambiar colores de portada
Edita `src/types.ts` en la sección `COVER_COLORS`

### Agregar categorías de estudio
Edita `src/types.ts` → `STUDY_CATEGORIES`

### Agregar géneros de ficción
Edita `src/types.ts` → `FICTION_CATEGORIES`

### Cambiar el nombre de la biblioteca
Edita `index.html` → `<title>` tag

## 📝 Notas Importantes

- Los libros se guardan en `localStorage` del navegador
- Tamaño máximo de PDF: 4MB (por limitaciones de localStorage)
- Para producción con muchos libros, considera usar una base de datos real (Firebase, Supabase, etc.)

## 🔄 Actualizar tu sitio

Cuando hagas cambios en el código:

```bash
# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

**Vercel detectará automáticamente el push y actualizará tu sitio en 1-2 minutos.**

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una sugerencia, abre un issue.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ usando React, Vite, TypeScript y Tailwind CSS**
