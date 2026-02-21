# Unified Proxy Daemon for Telepresence-Driven Development

This is a Go-based background daemon that unifies traffic routing between local services and remote Kubernetes services exposed via [Telepresence](https://www.telepresence.io/). It simplifies development in hybrid environments by exposing consistent mapped ports, allowing developers to seamlessly toggle between local and remote service targets.

## ✨ What It Does

- Proxies traffic to services running **locally** or in a **remote Kubernetes cluster**, accessible through consistent mapped ports.
- Provides a **GraphQL interface** to interact with the proxy state:
  - Toggle individual services between local or remote targets
  - Monitor real-time Telepresence connection status
  - List all services and their current proxy targets
- Maintains a thread-safe registry of all managed services and port mappings
- Automatically monitors and reconnects to Telepresence if the connection is lost

## 🧩 Use Case

Ideal for microservice development where some services run locally and others in a remote cluster. This tool enables:

- **Consistent routing**: All services expose a single, predictable mapped port regardless of target location
- **Dynamic switching**: Instantly switch traffic routing without restarting apps or containers
- **Live visibility**: Real-time feedback on Telepresence connection state

## 🛠 Configuration

The daemon loads service definitions from a `config.yaml` file located at the root of the repository. This file defines:

- Each service name
- The port mappings (local, remote, mapped)
- Telepresence context and namespace information

## 🚀 Getting Started

### 1. Run the Daemon in Development

This project uses `Air` for hot reloading during development:

```bash
air
```

### 2. Regenerate GraphQL Code (When Schema Changes)

When modifying the GraphQL schema (e.g. adding/removing queries or mutations), regenerate the Go types and resolvers:

```bash
go run github.com/99designs/gqlgen generate
```

## 📡 GraphQL Server

    The GraphQL API is served on: http://localhost:8080/graphql
  
## 🧪 Example Use Flow

    Start the daemon

    Use a GraphQL client (like GraphQL Playground or Postman) to:

        View currently active service routes

        Switch services from local to remote and vice versa

        Monitor Telepresence status in real-time

## 🔒 Thread Safety

All proxy and state operations are thread-safe and protected with mutexes to support concurrent GraphQL interactions and background health checks.