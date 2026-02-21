package main

import (
	"daemon/graph"
	"daemon/graph/model"
	"daemon/state"
	"daemon/telepresence"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/gorilla/websocket"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Environments []struct {
		Name        string `yaml:"name"`
		KubeContext string `yaml:"kubeContext"`
	} `yaml:"environments"`

	Services []struct {
		Name  string `yaml:"name"`
		URL   string `yaml:"url"`
		Ports []struct {
			Name   string `yaml:"name"`
			Remote int    `yaml:"remote"`
			Native int    `yaml:"native"`
			Mapped int    `yaml:"mapped"`
		} `yaml:"ports"`
	} `yaml:"services"`
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	data, err := os.ReadFile("../config.yaml")
	if err != nil {
		log.Fatalf("❌ Failed to read config.yaml: %v", err)
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		log.Fatalf("❌ Failed to parse config.yaml: %v", err)
	}

	go telepresence.Connect()

	// Load environments from config
	for _, env := range cfg.Environments {
		envObj := &state.Environment{
			Name:        env.Name,
			KubeContext: env.KubeContext,
		}
		state.GlobalStore.AddEnvironment(envObj)
		fmt.Printf("Added environment: %s (kube context: %s)\n", env.Name, env.KubeContext)
		
		// Set as target environment if it's the first one
		if env.KubeContext == "docker-desktop" {
			state.GlobalStore.SetTargetEnvironment(envObj)
		}
	}

	for _, svc := range cfg.Services {
		name := strings.ToLower(svc.Name)
		fmt.Println("Adding service:", name)
		state.GlobalStore.AddService(name, svc.URL, model.ServiceTargetRemote)

		for _, port := range svc.Ports {
			portName := port.Name
			mappedPort := port.Mapped

			localURL, err := url.Parse(fmt.Sprintf("http://localhost:%d", port.Native))
			if err != nil {
				log.Fatalf("Invalid local URL for %s:%s: %v", name, portName, err)
			}

			remoteURL, err := url.Parse(fmt.Sprintf("http://%s:%d", svc.URL, port.Remote))
			if err != nil {
				log.Fatalf("Invalid remote URL for %s:%s: %v", name, portName, err)
			}

			ps := &state.ProxyService{
				Name:   fmt.Sprintf("%s:%s", name, portName),
				Local:  localURL,
				Remote: remoteURL,
			}
			if err := ps.SetTarget(model.ServiceTargetRemote); err != nil {
				log.Fatalf("Failed to set initial target for %s:%s: %v", name, portName, err)
			}

			state.GlobalStore.AddProxyToService(name, ps)

			mux := http.NewServeMux()
			mux.HandleFunc("/", ps.Handler())

			go func(name string, port int, mux *http.ServeMux) {
				addr := fmt.Sprintf(":%d", port)
				if err := http.ListenAndServe(addr, mux); err != nil {
					log.Fatalf("❌ Server for %s failed: %v", name, err)
				}
			}(ps.Name, mappedPort, mux)
		}
	}

	log.Printf("🚀 Serving Routes")

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	srv.AddTransport(&transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	})
	srv.AddTransport(&transport.POST{})
	srv.AddTransport(&transport.Options{})
	srv.Use(extension.Introspection{})

	mux := http.NewServeMux()
	mux.Handle("/graphql", corsMiddleware(srv))
	log.Fatal(http.ListenAndServe(":8080", mux))

	select {}
}
