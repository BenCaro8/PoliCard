# 🧠 Local Dev Router (with Telepresence)

A desktop application that enables seamless development of Kubernetes-based services by transparently routing traffic from a remote cluster to your locally running service using [Telepresence](https://www.telepresence.io/).

---

## 🚀 Goal

To allow a developer to:

- Run a single service (e.g. `auth-service`) locally
- Connect it to a shared remote Kubernetes cluster
- Automatically redirect traffic intended for that service back to the local machine
- Develop and test changes in isolation — without restarting remote services or rebuilding containers

---

## 🧭 How It Works

1. **Telepresence is installed and managed by the app**
   - The Electron app bundles and installs the appropriate Telepresence binary for your OS (macOS or Windows)
   - No manual setup required

2. **The app connects to your Kubernetes cluster**
   - Uses your local `~/.kube/config`
   - Connects via `telepresence connect`

3. **You choose a service to intercept**
   - The app runs `telepresence intercept <service> --port <localPort>:<remotePort>`
   - This intercepts traffic to the Kubernetes service and reroutes it to your local machine

4. **Your local dev service handles real traffic**
   - Your service runs on `localhost:<localPort>`
   - Remote services remain intact — only you see rerouted traffic

---

## 📦 What This Replaces

❌ No need to rebuild containers or restart remote environments  
✅ Local development behaves like production (shared cluster)  
✅ Traffic redirection is instant, reversible, and per-dev

---

## 🛠 Example Use Case

You’re working on `auth-service`, but the rest of your team is not. Instead of deploying your dev version to the cluster:

1. Run your service on `localhost:3000`
2. Open the Electron app and intercept `auth-service`
3. Incoming requests to `auth-service` in the cluster are transparently redirected to your local machine

Now:
- You test real interactions with other services
- You iterate on code instantly
- Everyone else keeps using the official version of the service

---

## 🧰 Requirements

- The Electron app (includes Telepresence)
- Internet access to download dependencies (on first install)

---

## 📚 Learn More

- [Telepresence Docs](https://www.telepresence.io/docs/latest/)
- [Kubernetes Intercepts](https://www.telepresence.io/docs/latest/howtos/intercepts/)
- [Electron Forge](https://www.electronforge.io/)

---

## 💬 Why We Built This

Local development on microservices is painful:
- Too many moving parts
- Slow container rebuilds
- Repeated redeploys

This app removes the friction by letting you “plug in” to your cluster — just like you’re there — but with all the speed of local code changes.

