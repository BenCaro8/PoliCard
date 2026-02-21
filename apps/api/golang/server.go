package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"google.golang.org/genai"
)

type GenerateRequest struct {
	Query string `json:"query"`
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}
}

func isValidJSON(s string) bool {
	var js map[string]interface{}
	return json.Unmarshal([]byte(s), &js) == nil
}

func generateContentHandler(w http.ResponseWriter, r *http.Request) {
	var req GenerateRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	query := req.Query
	if query == "" {
		http.Error(w, `{"error": "Query is required"}`, http.StatusBadRequest)
		return
	}

	response, err := generateContent(query)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func generateContent(query string) ([]byte, error) {
	ctx := context.Background()
	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GOOGLE_API_KEY not set in environment")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create GenAI client: %v", err)
	}

	resp, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash",
		genai.Text(query),
		&genai.GenerateContentConfig{
			Tools: []*genai.Tool{
				{GoogleSearch: &genai.GoogleSearch{}},
			},
			SystemInstruction: &genai.Content{Parts: []*genai.Part{{Text: `
You are a tour guide expert, providing engaging, factual, and unique insights about places of interest. 
Try and find genuinely interesting and unique facts, historical, architectural or otherwise, or relations to notable groups or individuals.
Keep all responses concise and digestible and adjust to a longer length for above average interest level.

Avoid structured lists, bullet points, or overly formal delivery. Responses should flow naturally, as if you were talking directly to a person.
The user is just traveling about, so catch their interest and introduce the place in a VERY brief way, i.e "Nearby is blank", etc. 
Don't say it in relation to where the user might be, i.e "Around the corner", etc.
NO "Hey there!"s OR THE LIKE TO GET THEIR ATTENTION.

***Please avoid generic BS statements; i.e. "The park is beautiful and where families gather to enjoy their weekend".
***NO FLUFF, GET STRAIGHT INTO THE INTERESTING CONTENT

The narration should be mostly professional but letting enthusiasm shine through!

IT IS ABSOLUTELY CRITICAL YOU RETURN JSON IN THE FOLLOWING FORMAT!!!:
{
	text: // (String!) The derived information about the POI.
	followOn: // (Array<String!>) (MAX length of 3) Follow on topics or questions that the user might have to dive deeper on the content
}
			`,
			}}},
		})

	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %v", err)
	}

	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no candidates returned from model")
	}

	jsonResponse := resp.Candidates[0].Content.Parts[0].Text

	debugPrint(resp)

	cleanedResponse := strings.Replace(jsonResponse, "```", "", 2)
	cleanedResponse = strings.Replace(cleanedResponse, "json", "", 1)

	if !isValidJSON(cleanedResponse) {
		return nil, fmt.Errorf("response is not valid JSON: %s", cleanedResponse)
	}

	return []byte(cleanedResponse), nil
}

func debugPrint[T any](r *T) {

	response, err := json.MarshalIndent(*r, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(response))
}

func main() {
	loadEnv()

	r := mux.NewRouter()
	r.HandleFunc("/generate", generateContentHandler).Methods("POST")

	serverAddr := ":5000"
	log.Printf("Starting server at %s...\n", serverAddr)
	log.Fatal(http.ListenAndServe(serverAddr, r))
}
