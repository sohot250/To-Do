# Thai Todo (Vite + React + Tailwind)

## รันในเครื่อง
    npm install
    npm run dev

## Build
    npm run build      # ได้โฟลเดอร์ dist

## Deploy ไป Cloudflare Pages
วิธี CLI:

    npx wrangler login
    npm run deploy

วิธีเชื่อมกับ Git (Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git):
- Framework preset: Vite (หรือ None)
- Build command: npm run build
- Build output directory: dist
