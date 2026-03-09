

import OpenAI from 'openai';
import { use_AI, llm_api_url, llm_api_key, llm_model, stream_output } from '../../config/secrets';
import { showAiErrorAlerts } from '../../config/settings';
import { print_lg, critical_error_log, convert_to_json } from '../helpers';
import { deepseek_extract_skills_prompt, ai_answer_prompt } from './prompts';

let showAiErrorAlertsFlag = showAiErrorAlerts;

export function deepseek_create_client(): OpenAI | null {
  try {
    print_lg("Creating DeepSeek client...");
    if (!use_AI) {
      throw new Error("AI is not enabled! Please enable it by setting `USE_AI=true` in `.env` file.");
    }
    
    let base_url = llm_api_url;
    if (base_url.endsWith('/')) {
      base_url = base_url.slice(0, -1);
    }
    
    const client = new OpenAI({
      baseURL: base_url,
      apiKey: llm_api_key,
    });
    
    print_lg("---- SUCCESSFULLY CREATED DEEPSEEK CLIENT! ----");
    print_lg(`Using API URL: ${base_url}`);
    print_lg(`Using Model: ${llm_model}`);
    print_lg("Check './config/secrets.ts' for more details.\n");
    print_lg("---------------------------------------------");
    
    return client;
  } catch (e: any) {
    const error_message = "Error occurred while creating DeepSeek client. Make sure your API connection details are correct.";
    critical_error_log(error_message, e);
    if (showAiErrorAlertsFlag) {
      console.log(`DeepSeek Connection Error: ${error_message}\n${e.message}`);
    }
    return null;
  }
}

function deepseek_model_supports_temperature(model_name: string): boolean {
  const deepseek_models = ["deepseek-chat", "deepseek-reasoner"];
  return deepseek_models.includes(model_name);
}

export async function deepseek_completion(
  client: OpenAI,
  messages: Array<{ role: string; content: string }>,
  response_format?: any,
  temperature: number = 0,
  stream: boolean = stream_output
): Promise<any> {
  if (!client) {
    throw new Error("DeepSeek client is not available!");
  }
  
  const params: any = {
    model: llm_model,
    messages,
    stream,
    timeout: 30000
  };
  
  if (deepseek_model_supports_temperature(llm_model)) {
    params.temperature = temperature;
  }

  if (response_format) {
    params.response_format = response_format;
  }

  try {
    print_lg("Calling DeepSeek API for completion...");
    print_lg(`Using model: ${llm_model}`);
    print_lg(`Message count: ${messages.length}`);
    const completion = await client.chat.completions.create(params);
    
    let result = "";
    
    if (stream) {
      print_lg("--STREAMING STARTED");
      const stream = completion as any;
      for await (const chunk of stream) {
        const chunk_message = chunk.choices[0]?.delta?.content;
        if (chunk_message) {
          result += chunk_message;
          print_lg(chunk_message);
        }
      }
      print_lg("\n--STREAMING COMPLETE");
    } else {
      result = completion.choices[0]?.message?.content || "";
    }
    
    if (response_format) {
      result = convert_to_json(result);
    }
    
    print_lg("\nDeepSeek Answer:\n");
    print_lg(result);
    return result;
  } catch (e: any) {
    const error_message = `DeepSeek API error: ${e.message}`;
    print_lg(`Full error details: ${e.constructor.name}: ${e.message}`);
    
    if (e.message.includes("Connection")) {
      print_lg("This might be a network issue. Please check your internet connection.");
    } else if (e.message.includes("401")) {
      print_lg("This appears to be an authentication error. Your API key might be invalid or expired.");
    } else if (e.message.includes("404")) {
      print_lg("The requested resource could not be found. The API URL or model name might be incorrect.");
    } else if (e.message.includes("429")) {
      print_lg("You've exceeded the rate limit. Please wait before making more requests.");
    }
    
    throw new Error(error_message);
  }
}

export async function deepseek_extract_skills(client: OpenAI, job_description: string, stream: boolean = stream_output): Promise<any> {
  try {
    print_lg("Extracting skills from job description using DeepSeek...");
    const prompt = deepseek_extract_skills_prompt.replace('{}', job_description);
    const messages = [{ role: "user", content: prompt }];
    const custom_response_format = { type: "json_object" };
    
    let result = await deepseek_completion(client, messages, custom_response_format, 0, stream);
    
    if (typeof result === 'string') {
      result = convert_to_json(result);
    }
    
    return result;
  } catch (e: any) {
    critical_error_log("Error occurred while extracting skills with DeepSeek!", e);
    return { error: e.message };
  }
}

export async function deepseek_answer_question(
  client: OpenAI,
  question: string,
  options: string[] | null = null,
  question_type: 'text' | 'textarea' | 'single_select' | 'multiple_select' = 'text',
  job_description?: string | null,
  about_company?: string | null,
  user_information_all?: string | null,
  stream: boolean = stream_output
): Promise<any> {
  try {
    print_lg(`Answering question using DeepSeek AI: ${question}`);
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
    
    const messages = [{ role: "user", content: prompt }];
    const result = await deepseek_completion(client, messages, undefined, 0.1, stream);
    return result;
  } catch (e: any) {
    critical_error_log("Error occurred while answering question with DeepSeek!", e);
    return { error: e.message };
  }
}
