# 💡 Lembra Aí!

Um aplicativo de bloco de notas com lista de compras.

## 🚀 Como executar (Desenvolvimento)

### Backend (em um terminal)
```bash
cd backend
npm start
```

### Frontend (em outro terminal)
```bash
cd frontend
npm run dev
```

Depois abra http://localhost:5173 no navegador.

## 📱 Deploy para Produção (Android)

### 1. Deploy do Backend

O backend precisa estar hospedado em um servidor para o app Android funcionar.

**Opção recomendada: Render.com (gratuito)**

1. Crie uma conta em [render.com](https://render.com)
2. Crie um novo "Web Service"
3. Conecte seu repositório GitHub ou faça upload do código
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
5. Após o deploy, copie a URL (ex: `https://seu-app.onrender.com`)

**Outras opções:** Railway, Heroku, Fly.io, VPS próprio

### 2. Configurar Frontend

1. Edite o arquivo `frontend/.env.production`:
```env
VITE_API_URL=https://seu-backend.onrender.com
```

2. Faça o build do frontend:
```bash
cd frontend
npm run build
npx cap sync android
```

### 3. Build do APK

```bash
cd frontend/android
./gradlew assembleDebug
```

O APK estará em `frontend/android/app/build/outputs/apk/debug/`

## 📱 Funcionalidades

- ✅ Criar, visualizar e deletar notas
- ✅ Lista de compras com checkbox
- ✅ Marcar itens como comprados
- ✅ Buscar notas
- ✅ Design responsivo e moderno
- ✅ Dados persistidos com SQLite

## 🛠️ Tecnologias

**Frontend:**
- React 19
- Vite
- CSS3

**Backend:**
- Node.js
- Express
- SQLite (better-sqlite3)
