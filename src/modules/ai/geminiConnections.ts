

import { GoogleGenerativeAI } from '@google/generative-ai';
import { llm_model, llm_api_key } from '../../config/secrets';
import { showAiErrorAlerts } from '../../config/settings';
import { print_lg, critical_error_log, convert_to_json } from '../helpers';
import { extract_skills_prompt, ai_answer_prompt } from './prompts';

let showAiErrorAlertsFlag = showAiErrorAlerts;

export function gemini_get_models_list(): Promise<string[]> {
  return new Promise(async (resolve) => {
    try {
      print_lg("Getting Gemini models list...");
      // Note: listModels() might not be available in the same way, so we'll use a simplified approach
      const models = ["gemini-pro", "gemini-1.5-flash", "gemini-2.5-flash"];
      print_lg("Available models:");
      for (const model of models) {
        print_lg(`- ${model}`);
      }
      resolve(models);
    } catch (e: any) {
      critical_error_log("Error occurred while getting Gemini models list!", e);
      resolve(["error", e.message]);
    }
  });
}

export function gemini_create_client(): any {
  try {
    print_lg("Configuring Gemini client...");
    if (!llm_api_key || llm_api_key.includes("YOUR_API_KEY")) {
      throw new Error("Gemini API key is not set. Please set it in `.env` file as `LLM_API_KEY`.");
    }
    
    const genAI = new GoogleGenerativeAI(llm_api_key);
    const model = genAI.getGenerativeModel({ model: llm_model });
    
    print_lg("---- SUCCESSFULLY CONFIGURED GEMINI CLIENT! ----");
    print_lg(`Using Model: ${llm_model}`);
    print_lg("Check './config/secrets.ts' for more details.\n");
    print_lg("---------------------------------------------");
    
    return model;
  } catch (e: any) {
    const error_message = "Error occurred while configuring Gemini client. Make sure your API key and model name are correct.";
    critical_error_log(error_message, e);
    if (showAiErrorAlertsFlag) {
      console.log(`Gemini Connection Error: ${error_message}\n${e.message}`);
    }
    return null;
  }
}

export async function gemini_completion(model: any, prompt: string, is_json: boolean = false): Promise<any> {
  if (!model) {
    throw new Error("Gemini client is not available!");
  }

  try {
    print_lg("Calling Gemini API for completion...");
    
    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });
    
    const response = result.response;
    if (!response.text()) {
      throw new Error("The response from the Gemini API was empty. This might be due to the safety filters blocking the prompt or the response.");
    }

    let textResult = response.text();

    if (is_json) {
      if (textResult.startsWith("```json")) {
        textResult = textResult.slice(7);
      }
      if (textResult.endsWith("```")) {
        textResult = textResult.slice(0, -3);
      }
      return convert_to_json(textResult);
    }
    
    return textResult;
  } catch (e: any) {
    critical_error_log("Error occurred while getting Gemini completion!", e);
    return { error: e.message };
  }
}

export async function gemini_extract_skills(model: any, job_description: string): Promise<any> {
  try {
    print_lg("Extracting skills from job description using Gemini...");
    const prompt = extract_skills_prompt.replace('{}', job_description) + "\n\nImportant: Respond with only the JSON object, without any markdown formatting or other text.";
    return await gemini_completion(model, prompt, true);
  } catch (e: any) {
    critical_error_log("Error occurred while extracting skills with Gemini!", e);
    return { error: e.message };
  }
}

export async function gemini_answer_question(
  model: any,
  question: string,
  options: string[] | null = null,
  question_type: 'text' | 'textarea' | 'single_select' | 'multiple_select' = 'text',
  job_description?: string | null,
  about_company?: string | null,
  user_information_all?: string | null
): Promise<string> {
  try {
    print_lg(`Answering question using Gemini AI: ${question}`);
    const user_info = user_information_all || "";
    let prompt = ai_answer_prompt.replace('{}', user_info).replace('{}', question);

    if (options && (question_type === 'single_select' || question_type === 'multiple_select')) {
      const options_str = "OPTIONS:\n" + options.map(opt => `- ${opt}`).join("\n");
      prompt += `\n\n${options_str}`;
      if (question_type === 'single_select') {
        prompt += "\n\nPlease select exactly ONE option from the list above.";
      } else {
        prompt += "\n\nYou may select MULTIPLE options from the list above if appropriate.";
      }
    }
    
    if (job_description) {
      prompt += `\n\nJOB DESCRIPTION:\n${job_description}`;
    }
    
    if (about_company) {
      prompt += `\n\nABOUT COMPANY:\n${about_company}`;
    }

    return await gemini_completion(model, prompt);
  } catch (e: any) {
    critical_error_log("Error occurred while answering question with Gemini!", e);
    return JSON.stringify({ error: e.message });
  }
}
