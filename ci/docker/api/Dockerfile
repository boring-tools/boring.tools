FROM oven/bun:1

COPY ./build/api .
COPY ./packages/database/src/migrations ./migrations

ENV HOST=0.0.0.0
ENV PORT=3000

USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "index.js" ]
