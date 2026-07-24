# Despliegue en producción

## Opción 1: VPS (DigitalOcean, AWS EC2, etc.)

### Backend
```bash
# Construir
cd server
npm install
npm run build

# Ejecutar con PM2
npm install -g pm2
pm2 start dist/index.js --name sm-api
pm2 save
pm2 startup
```

### Frontend
```bash
cd client
npm install
npm run build

# Con PM2 + next start
pm2 start npm --name sm-web -- start
```

### Nginx como proxy reverso
```nginx
server {
  listen 80;
  server_name servicemerchandise.com;

  location /api/ {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### SSL con Certbot
```bash
sudo certbot --nginx -d servicemerchandise.com -d www.servicemerchandise.com
```

## Opción 2: Vercel (frontend) + Railway (backend)

### Frontend en Vercel
1. Conecta el repo.
2. Root directory: `client`
3. Build command: `npm run build`
4. Output: `.next`
5. Env var: `NEXT_PUBLIC_API_URL=https://api.servicemerchandise.com`

### Backend en Railway
1. Root directory: `server`
2. Start command: `npm start`
3. Add PostgreSQL plugin.
4. Configura todas las variables del `.env`.

## Opción 3: Docker (recomendado para escalar)

Crear `docker-compose.yml` en la raíz:

```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_DB: service_merchandise
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  api:
    build: ./server
    restart: always
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@db:5432/service_merchandise
      JWT_SECRET: ${JWT_SECRET}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
      CLIENT_URL: ${CLIENT_URL}

  web:
    build: ./client
    restart: always
    depends_on:
      - api
    environment:
      NEXT_PUBLIC_API_URL: http://api:4000
      NEXT_PUBLIC_SITE_URL: ${CLIENT_URL}
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

## Checklist pre-producción

- [ ] Cambiar `JWT_SECRET` por uno fuerte y único.
- [ ] Configurar SMTP con cuenta real.
- [ ] Configurar Cloudinary con cuenta de producción.
- [ ] Crear primer usuario admin con contraseña robusta.
- [ ] Configurar dominio y SSL.
- [ ] Activar backups automáticos de PostgreSQL.
- [ ] Revisar políticas de privacidad y términos.
- [ ] Probar flujo completo de cotización.
- [ ] Verificar sitemap.xml y robots.txt.
- [ ] Configurar variables de analytics (Google Analytics, Tag Manager).
- [ ] Configurar monitoreo (Sentry, LogRocket, etc.).