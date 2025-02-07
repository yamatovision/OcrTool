FROM node:18-alpine

WORKDIR /app

# 依存関係のファイルをコピー
COPY frontend/package.json frontend/package-lock.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY frontend/ ./

# ビルド
RUN npm run build

# 本番用の軽量なnginxイメージ
FROM nginx:alpine

# ビルドしたファイルをnginxのHTMLディレクトリにコピー
COPY --from=0 /app/dist /usr/share/nginx/html

# nginxの設定ファイル
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
