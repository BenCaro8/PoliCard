import {
  DynamicRetrievalMode,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { NodeText } from '#gql-types';

/**
 * gemini-1.5-flash steering stinks, once grounding / google_search tool works consistently
 * and maybe not experimental, switch to using gemini-2.0-flash
 */
export const generateGeminiResponse = async (
  message: string,
): Promise<Partial<NodeText>> => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
  const model = genAI.getGenerativeModel(
    {
      model: 'models/gemini-1.5-flash',
      systemInstruction: `
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
      tools: [
        {
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_DYNAMIC,
              dynamicThreshold: 0.2,
            },
          },
        },
      ],
    },
    { apiVersion: 'v1beta' },
  );

  let serverResponse;
  try {
    serverResponse = await model.generateContent(message);
  } catch (err) {
    console.error('Error fetching response from Gemini API:', err);
    throw new Error('Failed to generate response from Gemini');
  }
  return JSON.parse(
    serverResponse.response.text().replaceAll('```', '').replace('json', ''),
  );
};
