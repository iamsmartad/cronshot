# syntax=docker/dockerfile:1
FROM golang:1.17 as builder
WORKDIR /app/
COPY go.mod go.sum ./
RUN  go mod download
COPY pkg/ ./pkg/
COPY *.go .
ENV CGO_ENABLED=0
RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -ldflags="-s -w" -o cronshot .

FROM alpine:latest as runner
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/
COPY --from=builder /app/cronshot /root/
CMD ["./cronshot"]

FROM node as uibuilder 
WORKDIR /app/
COPY ui /app
RUN yarn build -p

FROM alpine:latest as runner-production
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/
COPY --from=builder /app/cronshot /root/
COPY --from=uibuilder /app/build /root/web/
CMD ["./cronshot"]
