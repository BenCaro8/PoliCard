package telepresence

import (
	"bytes"
	"daemon/graph/model"
	"daemon/state"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
)

func init() {
	// Set up the callback to avoid circular import
	state.TelepresenceUpdateCallback = func() {
		GetStatus()
	}
}

func Connect() {
	state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusConnecting)
	var stderrBuf bytes.Buffer
	multiErr := io.MultiWriter(os.Stdout, &stderrBuf)

	cmd := exec.Command("telepresence", "connect")
	cmd.Stdout = os.Stdout
	cmd.Stderr = multiErr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("Command finished with err: %v\n", err)
	}
	out := stderrBuf.String()

	if strings.Contains(out, "Connected to context") {
		state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusConnected)
	} else if err == nil || strings.Contains(string(out), "Connecting") {
		state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusConnecting)
	} else {
		state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusDisconnected)
	}
}

func InterceptService(name string) {
	fmt.Printf("InterceptService: %s\n", name)
	var stderrBuf bytes.Buffer
	multiErr := io.MultiWriter(os.Stdout, &stderrBuf)

	cmd := exec.Command("telepresence", "intercept", name)
	cmd.Stdout = os.Stdout
	cmd.Stderr = multiErr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("Command finished with err: %v\n", err)
	}
	out := stderrBuf.String()

	if !strings.Contains(out, "Intercepted") {
		fmt.Printf("Failed to intercept service %s\n", name)
	} else {
		fmt.Printf("Successfully intercepted service %s\n", name)
	}
}

func LeaveService(name string) {
	fmt.Printf("LeaveService: %s\n", name)
	var stderrBuf bytes.Buffer
	multiErr := io.MultiWriter(os.Stdout, &stderrBuf)

	cmd := exec.Command("telepresence", "leave", name)
	cmd.Stdout = os.Stdout
	cmd.Stderr = multiErr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("Command finished with err: %v\n", err)
	}
	out := stderrBuf.String()

	if strings.Contains(out, "telepresence leave: error") {
		fmt.Printf("Failed to leave service %s\n", name)
	} else {
		fmt.Printf("Successfully left service %s\n", name)
	}
}

// JSON structures for telepresence status output
type TelepresenceStatus struct {
	UserDaemon *UserDaemon `json:"user_daemon"`
}

type UserDaemon struct {
	KubernetesContext string      `json:"kubernetes_context"`
	Status            string      `json:"status"`
	Intercepts        []Intercept `json:"intercepts"`
	Running           bool        `json:"running"`
}

type Intercept struct {
	Name   string `json:"name"`
	Client string `json:"client"`
}

func GetStatus() *model.State {
	fmt.Printf("-------------------------------------------------------------------------------\n")
	out, err := exec.Command("telepresence", "status", "--output=json").Output()
	if err != nil {
		fmt.Printf("Error checking connection: %v\n", err)
		// Return disconnected state if command fails
		state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusDisconnected)
		return state.GlobalStore.GetState()
	}

	var status TelepresenceStatus
	if err := json.Unmarshal(out, &status); err != nil {
		fmt.Printf("Error parsing telepresence JSON: %v\n", err)
		state.GlobalStore.SetTelepresenceStatus(model.ConnectionStatusDisconnected)
		return state.GlobalStore.GetState()
	}

	var connectionStatus model.ConnectionStatus
	var targetEnvironment *model.Environment
	var environments []*model.Environment
	var services []*model.Service

	// Parse connection status from JSON
	if status.UserDaemon != nil && status.UserDaemon.Running {
		switch strings.ToLower(status.UserDaemon.Status) {
		case "connected":
			connectionStatus = model.ConnectionStatusConnected
			fmt.Printf("Parsed status: Connected\n")
		case "connecting":
			connectionStatus = model.ConnectionStatusConnecting
			fmt.Printf("Parsed status: Connecting\n")
		default:
			connectionStatus = model.ConnectionStatusDisconnected
			fmt.Printf("Parsed status: Disconnected\n")
		}
	} else {
		connectionStatus = model.ConnectionStatusDisconnected
		fmt.Printf("Parsed status: Disconnected (daemon not running)\n")
	}

	// Extract Kubernetes context from JSON
	var kubeContext string
	if status.UserDaemon != nil {
		kubeContext = status.UserDaemon.KubernetesContext
		fmt.Printf("Found Kubernetes context: %s\n", kubeContext)
	}

	// Parse intercepts from JSON to determine service states
	if status.UserDaemon != nil {
		for _, intercept := range status.UserDaemon.Intercepts {
			fmt.Printf("Found intercepted service: %s\n", intercept.Name)

			// Find service by URL (telepresence uses the URL, not the display name)
			storeServices := state.GlobalStore.GetServices()
			var matchedService *state.Service
			var matchedServiceName string
			
			for name, storeService := range storeServices {
				if storeService.URL == intercept.Name {
					matchedService = storeService
					matchedServiceName = name
					break
				}
			}

			if matchedService != nil {
				services = append(services, &model.Service{
					Name:   matchedServiceName, // Use the service name from config
					URL:    matchedService.URL, // Use the URL from config
					Target: model.ServiceTargetLocal, // Intercepted = Local
				})
				fmt.Printf("Mapped intercepted service URL '%s' to service '%s'\n", intercept.Name, matchedServiceName)
			} else {
				// Create service with URL as fallback if not found in store
				services = append(services, &model.Service{
					Name:   intercept.Name,
					URL:    intercept.Name,
					Target: model.ServiceTargetLocal,
				})
				fmt.Printf("No mapping found for intercepted service: %s, using as-is\n", intercept.Name)
			}
		}
	}

	// Add non-intercepted services from store as Remote
	storeServices := state.GlobalStore.GetServices()
	for serviceName, storeService := range storeServices {
		// Check if this service is already in our services list (intercepted)
		found := false
		for _, service := range services {
			if service.Name == serviceName {
				found = true
				break
			}
		}

		// If not intercepted, add as Remote
		if !found {
			services = append(services, &model.Service{
				Name:   serviceName,
				URL:    storeService.URL,
				Target: model.ServiceTargetRemote,
			})
			fmt.Printf("Added non-intercepted service: %s (Remote)\n", serviceName)
		}
	}

	// Get the current environment from store - don't create duplicates
	currentState := state.GlobalStore.GetState()
	targetEnvironment = currentState.TargetEnvironment
	environments = currentState.Environments

	// Update target environment if we found a matching kube context
	var environmentChanged = false
	if kubeContext != "" {
		// Look for an environment with matching kube context
		for _, env := range environments {
			if env.KubeContext == kubeContext && (targetEnvironment == nil || targetEnvironment.KubeContext != kubeContext) {
				targetEnvironment = env
				fmt.Printf("Telepresence connected to context: %s, setting target environment to: %s\n",
					kubeContext, env.Name)
				
				// Update the store with the new target environment
				storeEnv := &state.Environment{
					Name:        env.Name,
					KubeContext: env.KubeContext,
				}
				state.GlobalStore.SetTargetEnvironment(storeEnv)
				environmentChanged = true
				break
			}
		}
		
		if targetEnvironment == nil || targetEnvironment.KubeContext != kubeContext {
			fmt.Printf("No matching environment found for kube context: %s\n", kubeContext)
		}
	}

	// Update store with parsed status (only if status actually changed or environment changed)
	currentStatus := state.GlobalStore.GetTelepresenceStatus()
	statusChanged := currentStatus != connectionStatus || environmentChanged
	
	// Check if services actually changed by comparing with current store state
	currentStoreServices := state.GlobalStore.GetServices()
	servicesChanged := false
	
	// Build a map of what the new state should be
	newServiceStates := make(map[string]*state.Service)
	for _, service := range services {
		newServiceStates[service.Name] = &state.Service{
			Name:   service.Name,
			URL:    service.URL,
			Target: service.Target,
		}
		
		// Check if this service state differs from store
		if currentService, exists := currentStoreServices[service.Name]; !exists ||
			currentService.Target != service.Target ||
			currentService.URL != service.URL {
			servicesChanged = true
		}
	}
	
	// Check if any services were removed (existed in store but not in telepresence)
	for storeName := range currentStoreServices {
		if _, exists := newServiceStates[storeName]; !exists {
			servicesChanged = true
			break
		}
	}

	// Only update store if something actually changed
	if statusChanged {
		state.GlobalStore.SetTelepresenceStatus(connectionStatus)
		fmt.Printf("Updated telepresence status to: %s\n", connectionStatus)
	}
	
	if servicesChanged {
		// Batch update all services to minimize notifications
		state.GlobalStore.SyncServicesFromTelepresence(services)
		fmt.Printf("Synchronized %d services with telepresence state\n", len(services))
	}

	fmt.Printf("Built state with %d services, %d environments\n", len(services), len(environments))
	fmt.Printf("-------------------------------------------------------------------------------\n")

	// Build and return complete state
	return &model.State{
		TargetEnvironment: targetEnvironment,
		Environments:      environments,
		Services:          services,
		ConnectionStatus:  connectionStatus,
	}
}
