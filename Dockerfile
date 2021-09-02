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
COPY --from=builder /app/cronshot .
CMD ["./cronshot"]
