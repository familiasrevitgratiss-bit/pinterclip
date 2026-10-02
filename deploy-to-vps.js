const { Client } = require('C:/Users/Jesus/.gemini/antigravity/scratch/reddclip/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const config = {
  host: '169.58.16.90',
  port: 22,
  username: 'root',
  password: 'ReddClip2026!',
  tryKeyboard: true,
  readyTimeout: 30000,
};

const localFile = path.join(__dirname, 'pinterclip-deploy.tar.gz');
const remoteFile = '/var/www/pinterclip-deploy.tar.gz';

console.log('Iniciando conexion SSH con VPS Contabo (169.58.16.90)...');

conn.on('ready', () => {
  console.log('Conectado exitosamente por SSH.');
  console.log('Transfiriendo pinterclip-deploy.tar.gz por SFTP...');

  conn.sftp((err, sftp) => {
    if (err) {
      console.error('Error abriendo SFTP:', err);
      conn.end();
      return;
    }

    sftp.fastPut(localFile, remoteFile, {}, (err) => {
      if (err) {
        console.error('Error subiendo archivo:', err);
        conn.end();
        return;
      }

      console.log('¡PinterClip transferido con éxito!');
      console.log('Descomprimiendo en /var/www/pinterclip, compilando y configurando Nginx...');

      const cmd = `
        mkdir -p /var/www/pinterclip
        tar -xzf /var/www/pinterclip-deploy.tar.gz -C /var/www/pinterclip
        rm -f /var/www/pinterclip-deploy.tar.gz
        cd /var/www/pinterclip
        ln -sf /usr/local/bin/yt-dlp /var/www/pinterclip/yt-dlp
        mkdir -p /var/www/pinterclip/public/downloads
        npm install
        npm run build
        pm2 delete pinterclip 2>/dev/null || true
        pm2 start npm --name "pinterclip" -- run start -- -p 3001
        pm2 save

        cat << 'EOF' > /etc/nginx/sites-available/pinterclip
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /etc/ssl/reddclip/selfsigned.crt;
    ssl_certificate_key /etc/ssl/reddclip/selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    server_name pinterclip.com www.pinterclip.com;

    client_max_body_size 100M;

    location /downloads/ {
        alias /var/www/pinterclip/public/downloads/;
        add_header Content-Disposition 'attachment';
        add_header Access-Control-Allow-Origin *;
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        expires 1h;
        try_files $uri @node_pinterclip;
    }

    location @node_pinterclip {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

        ln -sf /etc/nginx/sites-available/pinterclip /etc/nginx/sites-enabled/pinterclip
        nginx -t && systemctl reload nginx
        echo "=== PINTERCLIP DESPLEGADO Y VIVO EN https://pinterclip.com ==="
      `;

      conn.exec(cmd, (err, stream) => {
        if (err) {
          console.error('Error ejecutando comandos:', err);
          conn.end();
          return;
        }

        stream.on('close', (code) => {
          console.log('Proceso remoto finalizado con código: ' + code);
          conn.end();
        });

        stream.on('data', (d) => process.stdout.write(d.toString()));
        stream.stderr.on('data', (d) => process.stderr.write(d.toString()));
      });
    });
  });
});

conn.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
  finish([config.password]);
});

conn.on('error', (err) => {
  console.error('Error SSH:', err);
});

conn.connect(config);
