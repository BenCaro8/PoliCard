package state

import (
	"daemon/graph/model"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"
	"time"
)

type Environment struct {
	Name        string
	KubeContext string
}

type ProxyService struct {
	Name    string
	Local   *url.URL
	Remote  *url.URL
	Current *url.URL
	Mu      sync.RWMutex
}

type Service struct {
	Name    string
	URL     string
	Target  model.ServiceTarget
	Proxies []*ProxyService
}

func (ps *ProxyService) SetTarget(which model.ServiceTarget) error {
	ps.Mu.Lock()
	defer ps.Mu.Unlock()
	switch which {
	case model.ServiceTargetLocal:
		ps.Current = ps.Local
	case model.ServiceTargetRemote:
		ps.Current = ps.Remote
	default:
		return fmt.Errorf("invalid target: %s", which)
	}
	return nil
}

func (ps *ProxyService) Handler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ps.Mu.RLock()
		tgt := ps.Current
		ps.Mu.RUnlock()
		if tgt == nil {
			http.Error(w, "No target set", http.StatusServiceUnavailable)
			return
		}
		proxy := httputil.NewSingleHostReverseProxy(tgt)
		proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
			log.Printf("[%s] proxy error: %v", ps.Name, err)
			http.Error(w, "Bad gateway", http.StatusBadGateway)
		}
		proxy.ServeHTTP(w, r)
	}
}

type Store struct {
	mu                           sync.RWMutex
	services                     map[string]*Service
	environments                 []*Environment
	targetEnvironment            *Environment
	telepresenceConnectionStatus model.ConnectionStatus
	stateSubscribers             []chan *model.State
	lastNotifiedState            *model.State
	
	// Global ticker management
	globalTicker     *time.Ticker
	globalTickerOnce sync.Once
}

var GlobalStore = &Store{
	services:                     make(map[string]*Service),
	environments:                 []*Environment{},
	targetEnvironment:            &Environment{},
	telepresenceConnectionStatus: model.ConnectionStatusDisconnected,
	stateSubscribers:             make([]chan *model.State, 0),
}

func (s *Store) GetServices() map[string]*Service {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make(map[string]*Service)
	for k, v := range s.services {
		result[k] = &Service{Name: v.Name, Target: v.Target, URL: v.URL, Proxies: v.Proxies}
	}
	return result
}

func (s *Store) AddProxyToService(serviceName string, proxy *ProxyService) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if svc, exists := s.services[serviceName]; exists {
		svc.Proxies = append(svc.Proxies, proxy)
		log.Printf("✅ Added proxy %s to service %s (now has %d proxies)", proxy.Name, serviceName, len(svc.Proxies))
	} else {
		log.Printf("❌ Service %s not found when adding proxy %s", serviceName, proxy.Name)
	}
}

func (s *Store) SetServiceTarget(name string, target model.ServiceTarget) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if svc, exists := s.services[name]; exists {
		svc.Target = target
		for _, ps := range svc.Proxies {
			if err := ps.SetTarget(target); err != nil {
				return err
			}
		}
		s.notifyStateSubscribers()
		return nil
	}
	return fmt.Errorf("service %s not found", name)
}

func (s *Store) SetServiceTargetBatch(updates map[string]model.ServiceTarget) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Validate all services exist first
	for name := range updates {
		if _, exists := s.services[name]; !exists {
			return fmt.Errorf("service %s not found", name)
		}
	}

	// Apply all updates
	for name, target := range updates {
		svc := s.services[name]
		svc.Target = target
		for _, ps := range svc.Proxies {
			if err := ps.SetTarget(target); err != nil {
				return err
			}
		}
	}

	// Notify only once at the end
	s.notifyStateSubscribers()
	return nil
}

func (s *Store) AddService(name string, url string, target model.ServiceTarget) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.services[name] = &Service{Name: name, URL: url, Target: target}
}

func (s *Store) AddOrUpdateService(name string, url string, target model.ServiceTarget) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	if svc, exists := s.services[name]; exists {
		// Update existing service
		svc.Target = target
		if url != "" {
			svc.URL = url
		}
	} else {
		// Add new service
		s.services[name] = &Service{Name: name, URL: url, Target: target}
	}
	
	s.notifyStateSubscribers()
}

func (s *Store) GetTelepresenceStatus() model.ConnectionStatus {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.telepresenceConnectionStatus
}

func (s *Store) SetTelepresenceStatus(status model.ConnectionStatus) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	oldStatus := s.telepresenceConnectionStatus
	s.telepresenceConnectionStatus = status
	
	// Only notify if status actually changed
	if oldStatus != status {
		s.notifyStateSubscribers()
	}
}

func (s *Store) GetState() *model.State {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Convert internal services to model services
	var services []*model.Service
	for _, svc := range s.services {
		services = append(services, &model.Service{
			Name:   svc.Name,
			URL:    svc.URL,
			Target: svc.Target,
		})
	}

	// Convert internal environments to model environments
	var environments []*model.Environment
	for _, env := range s.environments {
		environments = append(environments, &model.Environment{
			Name:        env.Name,
			KubeContext: env.KubeContext,
		})
	}

	var targetEnv *model.Environment
	if s.targetEnvironment != nil {
		targetEnv = &model.Environment{
			Name:        s.targetEnvironment.Name,
			KubeContext: s.targetEnvironment.KubeContext,
		}
	}

	return &model.State{
		TargetEnvironment: targetEnv,
		Environments:      environments,
		Services:          services,
		ConnectionStatus:  s.telepresenceConnectionStatus,
	}
}

func (s *Store) SubscribeToState() chan *model.State {
	s.mu.Lock()
	defer s.mu.Unlock()

	ch := make(chan *model.State, 10) // Buffered to prevent blocking
	s.stateSubscribers = append(s.stateSubscribers, ch)
	
	fmt.Printf("New state subscription added (total subscribers: %d)\n", len(s.stateSubscribers))
	
	// Start the global ticker when the first subscriber connects
	if len(s.stateSubscribers) == 1 {
		s.startGlobalTicker()
	}
	
	return ch
}

func (s *Store) UnsubscribeFromState(ch chan *model.State) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, subscriber := range s.stateSubscribers {
		if subscriber == ch {
			s.stateSubscribers = append(s.stateSubscribers[:i], s.stateSubscribers[i+1:]...)
			close(ch)
			fmt.Printf("State subscription removed (remaining subscribers: %d)\n", len(s.stateSubscribers))
			
			// Stop the global ticker when no subscribers remain
			if len(s.stateSubscribers) == 0 {
				s.stopGlobalTicker()
			}
			break
		}
	}
}

func (s *Store) notifyStateSubscribers() {
	// Should be called with lock already held
	currentState := s.getStateUnsafe()
	
	// Only notify if state has actually changed
	if !statesEqual(s.lastNotifiedState, currentState) {
		s.lastNotifiedState = currentState
		for _, ch := range s.stateSubscribers {
			select {
			case ch <- currentState:
			default:
				// Channel is full or closed, skip
			}
		}
	}
}

func (s *Store) getStateUnsafe() *model.State {
	// Helper method that doesn't acquire lock - for internal use
	var services []*model.Service
	for _, svc := range s.services {
		services = append(services, &model.Service{
			Name:   svc.Name,
			URL:    svc.URL,
			Target: svc.Target,
		})
	}

	var environments []*model.Environment
	for _, env := range s.environments {
		environments = append(environments, &model.Environment{
			Name:        env.Name,
			KubeContext: env.KubeContext,
		})
	}

	var targetEnv *model.Environment
	if s.targetEnvironment != nil {
		targetEnv = &model.Environment{
			Name:        s.targetEnvironment.Name,
			KubeContext: s.targetEnvironment.KubeContext,
		}
	}

	return &model.State{
		TargetEnvironment: targetEnv,
		Environments:      environments,
		Services:          services,
		ConnectionStatus:  s.telepresenceConnectionStatus,
	}
}

func (s *Store) SetTargetEnvironment(env *Environment) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	s.targetEnvironment = env
	
	// Add to environments list if not already present
	found := false
	for _, existingEnv := range s.environments {
		if existingEnv.Name == env.Name {
			found = true
			break
		}
	}
	if !found {
		s.environments = append(s.environments, env)
	}
	
	s.notifyStateSubscribers()
}

func (s *Store) AddEnvironment(env *Environment) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	// Check if environment already exists
	for _, existingEnv := range s.environments {
		if existingEnv.Name == env.Name {
			return // Already exists
		}
	}
	
	s.environments = append(s.environments, env)
	s.notifyStateSubscribers()
}

func (s *Store) UpdateServiceTargetsWithStatus(updates map[string]model.ServiceTarget, finalStatus model.ConnectionStatus) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Validate all services exist first
	for name := range updates {
		if _, exists := s.services[name]; !exists {
			return fmt.Errorf("service %s not found", name)
		}
	}

	// Set connecting status
	s.telepresenceConnectionStatus = model.ConnectionStatusConnecting

	// Apply all service updates
	for name, target := range updates {
		svc := s.services[name]
		svc.Target = target
		for _, ps := range svc.Proxies {
			if err := ps.SetTarget(target); err != nil {
				return err
			}
		}
	}

	// Set final status
	s.telepresenceConnectionStatus = finalStatus

	// Notify only once at the very end
	s.notifyStateSubscribers()
	return nil
}

func (s *Store) SyncServicesFromTelepresence(services []*model.Service) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	// Update all services without triggering individual notifications
	for _, service := range services {
		if svc, exists := s.services[service.Name]; exists {
			// Update existing service
			svc.Target = service.Target
			if service.URL != "" {
				svc.URL = service.URL
			}
		} else {
			// Add new service
			s.services[service.Name] = &Service{
				Name:   service.Name,
				URL:    service.URL,
				Target: service.Target,
			}
		}
	}
	
	// Notify only once at the end
	s.notifyStateSubscribers()
}

func (s *Store) GetStateSubscriberCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.stateSubscribers)
}

func (s *Store) startGlobalTicker() {
	s.globalTickerOnce.Do(func() {
		fmt.Printf("Starting global telepresence status ticker (10 second interval)\n")
		s.globalTicker = time.NewTicker(3 * time.Second)
		go func() {
			for range s.globalTicker.C {
				subscriberCount := s.GetStateSubscriberCount()
				if subscriberCount > 0 {
					fmt.Printf("Global ticker: Updating telepresence status (%d subscribers)\n", subscriberCount)
					// Import telepresence here to avoid circular dependency
					// We'll call this via an interface or callback
					s.triggerTelepresenceUpdate()
				}
			}
		}()
	})
}

func (s *Store) stopGlobalTicker() {
	if s.globalTicker != nil {
		s.globalTicker.Stop()
	}
}

// This will be called by the telepresence package to avoid circular imports
var TelepresenceUpdateCallback func()

func (s *Store) triggerTelepresenceUpdate() {
	if TelepresenceUpdateCallback != nil {
		TelepresenceUpdateCallback()
	}
}

func statesEqual(state1, state2 *model.State) bool {
	if state1 == nil || state2 == nil {
		return state1 == state2
	}
	
	// Compare connection status
	if state1.ConnectionStatus != state2.ConnectionStatus {
		return false
	}
	
	// Compare target environment
	if (state1.TargetEnvironment == nil) != (state2.TargetEnvironment == nil) {
		return false
	}
	if state1.TargetEnvironment != nil && state2.TargetEnvironment != nil {
		if state1.TargetEnvironment.Name != state2.TargetEnvironment.Name ||
			state1.TargetEnvironment.KubeContext != state2.TargetEnvironment.KubeContext {
			return false
		}
	}
	
	// Compare environments count
	if len(state1.Environments) != len(state2.Environments) {
		return false
	}
	
	// Compare environments
	for i, env1 := range state1.Environments {
		if i >= len(state2.Environments) || 
			env1.Name != state2.Environments[i].Name ||
			env1.KubeContext != state2.Environments[i].KubeContext {
			return false
		}
	}
	
	// Compare services count
	if len(state1.Services) != len(state2.Services) {
		return false
	}
	
	// Compare services (convert to maps for easier comparison)
	services1Map := make(map[string]*model.Service)
	for _, svc := range state1.Services {
		services1Map[svc.Name] = svc
	}
	
	services2Map := make(map[string]*model.Service)
	for _, svc := range state2.Services {
		services2Map[svc.Name] = svc
	}
	
	for name, svc1 := range services1Map {
		svc2, exists := services2Map[name]
		if !exists || svc1.URL != svc2.URL || svc1.Target != svc2.Target {
			return false
		}
	}
	
	return true
}
