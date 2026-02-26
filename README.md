# 🏠 Mis Propiedades - Catálogo Inmobiliario

App Next.js para gestionar propiedades en búsqueda. Lee y escribe directamente desde/hacia un archivo Excel (`Deptos.xlsx`).

## 📋 Características

- Catálogo visual con tarjetas de propiedades
- Filtros por zona, ambientes, cochera
- Búsqueda por texto
- Ordenamiento por precio, metros, tiempo al trabajo
- Agregar / editar / eliminar propiedades
- Todo se guarda directamente en el Excel
- Descarga del Excel actualizado

## 🚀 Deploy en Vercel

### ⚠️ Importante sobre el archivo Excel

El archivo `Deptos.xlsx` vive en `/public`. **En Vercel, el filesystem es de solo lectura**, por lo que los cambios (agregar/editar/eliminar) no persisten entre deployments.

**Para uso con persistencia real en producción**, hay dos opciones:

### Opción A: Google Sheets API (recomendado para Vercel)
Reemplazar `lib/excel.ts` para leer/escribir desde Google Sheets.

### Opción B: Railway / Render (más simple)
Deployar en una plataforma que permita filesystem mutable:
1. Subir repo a GitHub
2. Crear nuevo proyecto en [Railway.app](https://railway.app)
3. Conectar con GitHub → Deploy automático
4. El Excel persiste entre requests

### Opción C: Usar localmente
```bash
npm install
npm run dev
# Abrir http://localhost:3000
```
Perfecto para uso local con la vendedora en la misma red o por VPN.

## 🛠️ Setup local

```bash
# Clonar o descomprimir el proyecto
cd deptos-app

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Build para producción
npm run build && npm start
```

## 📁 Estructura

```
deptos-app/
├── app/
│   ├── api/
│   │   ├── properties/route.ts   # GET todas, POST nueva
│   │   └── property/[id]/route.ts # PUT editar, DELETE eliminar
│   ├── page.tsx                  # Página principal del catálogo
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── PropertyCard.tsx          # Tarjeta de propiedad
│   └── PropertyForm.tsx          # Modal de formulario
├── lib/
│   └── excel.ts                  # Lectura/escritura del Excel
└── public/
    └── Deptos.xlsx               # 📊 TU ARCHIVO DE DATOS
```

## 📊 Columnas del Excel

| Columna | Descripción |
|---------|-------------|
| Zona | Barrio |
| Descripción | Notas sobre la propiedad |
| Dirección | Link Google Maps |
| Link | URL de la publicación |
| Ambientes | Número de ambientes |
| Precio | Precio en USD |
| Expensas | Expensas en $ |
| Cochera | SI / NO |
| Antigüedad | Años del edificio |
| Metros Totales | m² totales |
| Metros Cubiertos | m² cubiertos |
| Tiempo al trabajo | Minutos en transporte |
| Descartado | SI / NO |
| MOTIVO | Motivo de descarte |
