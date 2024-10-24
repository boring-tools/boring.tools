FROM oven/bun:1

COPY ./build/page/dist .
COPY ./node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=4020

USER bun
EXPOSE 4020/tcp

ENTRYPOINT [ "bun", "run", "server/entry.mjs" ]