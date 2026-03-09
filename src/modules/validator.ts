

import {
  first_name, middle_name, last_name, phone_number, current_city, street, state, zipcode
} from '../config/personals';
import {
  default_resume_path, years_of_experience, require_visa, desired_salary, current_ctc, notice_period,
  linkedin_headline, linkedin_summary, cover_letter, recent_employer, confidence_level,
  pause_before_submit, pause_at_failed_question, overwrite_previous_answers
} from '../config/questions';
import {
  search_terms, search_location, switch_number, randomize_search_order,
  sort_by, date_posted, salary, easy_apply_only, experience_level, job_type, on_site,
  companies, location, industry, job_function, job_titles, benefits, commitments,
  under_10_applicants, in_your_network, fair_chance_employer, pause_after_filters,
  about_company_bad_words, about_company_good_words, bad_words, security_clearance,
  did_masters, current_experience
} from '../config/search';
import {
  username, password, use_AI, llm_api_url, llm_api_key, llm_model, stream_output, ai_provider
} from '../config/secrets';
import {
  close_tabs, follow_companies, run_non_stop, alternate_sortby, cycle_date_posted,
  stop_date_cycle_at_24hr, file_name, failed_file_name, logs_folder_path, click_gap,
  run_in_background, disable_extensions, safe_mode, smooth_scroll, keep_screen_awake, stealth_mode
} from '../config/settings';

let __validation_file_path = "";

function check_int(var_value: number, var_name: string, min_value: number = 0): void {
  if (typeof var_value !== 'number' || !Number.isInteger(var_value)) {
    throw new TypeError(`The variable "${var_name}" in "${__validation_file_path}" must be an Integer!\nReceived "${var_value}" of type "${typeof var_value}" instead!\n\nSolution:\nPlease open "${__validation_file_path}" and update "${var_name}" to be an Integer.\nExample: \`${var_name} = 10\`\n\nNOTE: Do NOT surround Integer values in quotes ("10")!\n\n`);
  }
  if (var_value < min_value) {
    throw new Error(`The variable "${var_name}" in "${__validation_file_path}" expects an Integer greater than or equal to \`${min_value}\`! Received \`${var_value}\` instead!\n\nSolution:\nPlease open "${__validation_file_path}" and update "${var_name}" accordingly.`);
  }
}

function check_boolean(var_value: boolean, var_name: string): void {
  if (typeof var_value !== 'boolean') {
    throw new Error(`The variable "${var_name}" in "${__validation_file_path}" expects a Boolean input \`true\` or \`false\`, not "${var_value}" of type "${typeof var_value}" instead!\n\nSolution:\nPlease open "${__validation_file_path}" and update "${var_name}" to either \`true\` or \`false\`.\nExample: \`${var_name} = true\`\n\n`);
  }
}

function check_string(var_value: string, var_name: string, options: string[] = [], min_length: number = 0): void {
  if (typeof var_value !== 'string') {
    throw new TypeError(`Invalid input for ${var_name}. Expecting a String!`);
  }
  if (min_length > 0 && var_value.length < min_length) {
    throw new Error(`Invalid input for ${var_name}. Expecting a String of length at least ${min_length}!`);
  }
  if (options.length > 0 && !options.includes(var_value)) {
    throw new Error(`Invalid input for ${var_name}. Expecting a value from ${options.join(', ')}, not ${var_value}!`);
  }
}

function check_list(var_value: string[], var_name: string, options: string[] = [], min_length: number = 0): void {
  if (!Array.isArray(var_value)) {
    throw new TypeError(`Invalid input for ${var_name}. Expecting a List!`);
  }
  if (var_value.length < min_length) {
    throw new Error(`Invalid input for ${var_name}. Expecting a List of length at least ${min_length}!`);
  }
  for (const element of var_value) {
    if (typeof element !== 'string') {
      throw new TypeError(`Invalid input for ${var_name}. All elements in the list must be strings!`);
    }
    if (options.length > 0 && !options.includes(element)) {
      throw new Error(`Invalid input for ${var_name}. Expecting all elements to be values from ${options.join(', ')}. This "${element}" is NOT in options!`);
    }
  }
}

export function validate_personals(): void {
  __validation_file_path = "config/personals.ts";
  check_string(first_name, "first_name", [], 1);
  check_string(middle_name, "middle_name");
  check_string(last_name, "last_name", [], 1);
  check_string(phone_number, "phone_number", [], 10);
  check_string(current_city, "current_city");
  check_string(street, "street");
  check_string(state, "state");
  check_string(zipcode, "zipcode");
}

export function validate_questions(): void {
  __validation_file_path = "config/questions.ts";
  check_string(default_resume_path, "default_resume_path");
  check_string(years_of_experience, "years_of_experience");
  check_string(require_visa, "require_visa", ["Yes", "No"]);
  check_int(desired_salary, "desired_salary");
  check_int(current_ctc, "current_ctc");
  check_string(linkedin_headline, "linkedin_headline");
  check_int(notice_period, "notice_period");
  check_string(linkedin_summary, "linkedin_summary");
  check_string(cover_letter, "cover_letter");
  check_string(recent_employer, "recent_employer");
  check_string(confidence_level, "confidence_level");
  check_boolean(pause_before_submit, "pause_before_submit");
  check_boolean(pause_at_failed_question, "pause_at_failed_question");
  check_boolean(overwrite_previous_answers, "overwrite_previous_answers");
}

export function validate_search(): void {
  __validation_file_path = "config/search.ts";
  check_list(search_terms, "search_terms", [], 1);
  check_string(search_location, "search_location");
  check_int(switch_number, "switch_number", 1);
  check_boolean(randomize_search_order, "randomize_search_order");
  check_string(sort_by, "sort_by", ["", "Most recent", "Most relevant"]);
  check_string(date_posted, "date_posted", ["", "Any time", "Past month", "Past week", "Past 24 hours"]);
  check_string(salary, "salary");
  check_boolean(easy_apply_only, "easy_apply_only");
  check_list(experience_level, "experience_level", ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"]);
  check_list(job_type, "job_type", ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship", "Other"]);
  check_list(on_site, "on_site", ["On-site", "Remote", "Hybrid"]);
  check_list(companies, "companies");
  check_list(location, "location");
  check_list(industry, "industry");
  check_list(job_function, "job_function");
  check_list(job_titles, "job_titles");
  check_list(benefits, "benefits");
  check_list(commitments, "commitments");
  check_boolean(under_10_applicants, "under_10_applicants");
  check_boolean(in_your_network, "in_your_network");
  check_boolean(fair_chance_employer, "fair_chance_employer");
  check_boolean(pause_after_filters, "pause_after_filters");
  check_list(about_company_bad_words, "about_company_bad_words");
  check_list(about_company_good_words, "about_company_good_words");
  check_list(bad_words, "bad_words");
  check_boolean(security_clearance, "security_clearance");
  check_boolean(did_masters, "did_masters");
  check_int(current_experience, "current_experience", -1);
}

export function validate_secrets(): void {
  __validation_file_path = "config/secrets.ts";
  check_string(username, "username", [], 5);
  check_string(password, "password", [], 5);
  check_boolean(use_AI, "use_AI");
  check_string(llm_api_url, "llm_api_url", [], 5);
  check_string(llm_api_key, "llm_api_key");
  check_boolean(stream_output, "stream_output");
  check_string(ai_provider, "ai_provider", ["openai", "deepseek", "gemini"]);
  check_string(llm_model, "llm_model");
}

export function validate_settings(): void {
  __validation_file_path = "config/settings.ts";
  check_boolean(close_tabs, "close_tabs");
  check_boolean(follow_companies, "follow_companies");
  check_boolean(run_non_stop, "run_non_stop");
  check_boolean(alternate_sortby, "alternate_sortby");
  check_boolean(cycle_date_posted, "cycle_date_posted");
  check_boolean(stop_date_cycle_at_24hr, "stop_date_cycle_at_24hr");
  check_string(file_name, "file_name", [], 1);
  check_string(failed_file_name, "failed_file_name", [], 1);
  check_string(logs_folder_path, "logs_folder_path", [], 1);
  check_int(click_gap, "click_gap", 0);
  check_boolean(run_in_background, "run_in_background");
  check_boolean(disable_extensions, "disable_extensions");
  check_boolean(safe_mode, "safe_mode");
  check_boolean(smooth_scroll, "smooth_scroll");
  check_boolean(keep_screen_awake, "keep_screen_awake");
  check_boolean(stealth_mode, "stealth_mode");
}

export function validate_config(): boolean {
  validate_personals();
  validate_questions();
  validate_search();
  validate_secrets();
  validate_settings();
  return true;
}
