
FROM node:20 as build

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node prisma ./
COPY --chown=node:node views ./
COPY --chown=node:node public ./

RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build

FROM node:20
RUN apt-get update && apt-get install curl -y
WORKDIR /app
COPY --chown=node:node --from=build /app/package.json /app/package-lock.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/views ./views
COPY --chown=node:node --from=build /app/public ./public
RUN npm prune --production
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=15s CMD curl -f http://localhost:3000/api/health
CMD ["node",  "dist/src/main"]