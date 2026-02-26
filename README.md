# 🏠 Mis Propiedades

App Next.js con catálogo de propiedades. Los datos se guardan en **Google Sheets** y funcionan perfectamente en Vercel.

---

## ⚙️ Setup Google Sheets (una sola vez)

### 1. Crear proyecto y credenciales en Google Cloud

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear un proyecto nuevo (ej: "deptos-app")
3. Buscar **"Google Sheets API"** → Enable
4. Ir a **Credenciales** → Crear credencial → **Cuenta de servicio**
5. Ponerle un nombre cualquiera → Crear → Rol: **Editor** → Listo
6. Click en la cuenta de servicio → pestaña **Claves** → Agregar clave → **JSON**
   - Se descarga un archivo `.json` — **guardalo bien**

### 2. Crear el Google Sheet

1. Crear un Google Sheet nuevo en [sheets.google.com](https://sheets.google.com)
2. Renombrar la primera hoja a **`Propiedades`** (click derecho en la pestaña)
3. Copiar el **ID** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/ *** ESTE_ES_EL_ID *** /edit
   ```
4. **Compartir** el sheet con el `client_email` que está dentro del JSON descargado
   - Darle permiso de **Editor**

### 3. Configurar variables de entorno

#### Para desarrollo local — crear `.env.local`:
```
GOOGLE_SHEET_ID=pegar_el_id_del_sheet

GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...todo el json en una linea..."}
```
> Para poner el JSON en una línea: abrí el archivo JSON, copiá todo el contenido y pegalo como está (Next.js lo maneja bien).

#### Para Vercel — en el dashboard:
1. Ir al proyecto en vercel.com → **Settings** → **Environment Variables**
2. Agregar:
   - `GOOGLE_SHEET_ID` → el ID del sheet
   - `GOOGLE_SERVICE_ACCOUNT_JSON` → el contenido completo del archivo JSON

---

## 🚀 Correr localmente

```bash
npm install
npm run dev
```

## 📁 Estructura

```
deptos-app/
├── app/
│   ├── api/
│   │   ├── properties/route.ts     # GET todas, POST nueva
│   │   └── property/[id]/route.ts  # PUT editar, DELETE eliminar
│   ├── page.tsx                    # Catálogo principal
│   └── globals.css
├── components/
│   ├── PropertyCard.tsx
│   └── PropertyForm.tsx
└── lib/
    └── sheets.ts                   # Toda la lógica de Google Sheets
```
