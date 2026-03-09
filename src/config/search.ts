

import * as dotenv from 'dotenv';
dotenv.config();

// These Sentences are Searched in LinkedIn
// Enter your search terms inside '[ ]' with quotes ' "searching title" ' for each search followed by comma ', ' Eg: ["Software Engineer", "Software Developer", "Selenium Developer"]
const searchTermsEnv = process.env.SEARCH_TERMS;
export const search_terms: string[] = ["backend developer node js"];

// Search location, this will be filled in "City, state, or zip code" search box. I
//f left empty as "", tool will not fill it.
export const search_location = process.env.SEARCH_LOCATION || "";                // Some valid examples: "", "United States", "India", "Chicago, Illinois, United States", "90001, Los Angeles, California, United States", "Bengaluru, Karnataka, India", etc.

// After how many number of applications in current search should the bot switch to next search? 
export const switch_number = parseInt(process.env.SWITCH_NUMBER || "30");                 // Only numbers greater than 0... Don't put in quotes

// Do you want to randomize the search order for search_terms?
export const randomize_search_order = process.env.RANDOMIZE_SEARCH_ORDER === "true";     // True of False, Note: True or False are case-sensitive

// >>>>>>>>>>> Job Search Filters <<<<<<<<<<<

export const sort_by = process.env.SORT_BY || "";                       // "Most recent", "Most relevant" or ("" to not select) 
export const date_posted = process.env.DATE_POSTED || "Past 24 hours";         // "Any time", "Past month", "Past week", "Past 24 hours" or ("" to not select)
export const salary = process.env.SALARY || "";                        // "$40,000+", "$60,000+", "$80,000+", "$100,000+", "$120,000+", "$140,000+", "$160,000+", "$180,000+", "$200,000+"

export const easy_apply_only = process.env.EASY_APPLY_ONLY === "true" || process.env.EASY_APPLY_ONLY === undefined ? true : false;             // True or False, Note: True or False are case-sensitive

const experienceLevelEnv = process.env.EXPERIENCE_LEVEL;
export const experience_level: string[] = experienceLevelEnv ? JSON.parse(experienceLevelEnv) : [];              // (multiple select) "Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"

const jobTypeEnv = process.env.JOB_TYPE;
export const job_type: string[] = jobTypeEnv ? JSON.parse(jobTypeEnv) : [];                      // (multiple select) "Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship", "Other"

const onSiteEnv = process.env.ON_SITE;
export const on_site: string[] = onSiteEnv ? JSON.parse(onSiteEnv) : [];                       // (multiple select) "On-site", "Remote", "Hybrid"

const companiesEnv = process.env.COMPANIES;
export const companies: string[] = companiesEnv ? JSON.parse(companiesEnv) : [];                     // (dynamic multiple select) make sure the name you type in list exactly matches with the company name you're looking for, including capitals.

const locationEnv = process.env.LOCATION;
export const location: string[] = locationEnv ? JSON.parse(locationEnv) : [];                      // (dynamic multiple select)

const industryEnv = process.env.INDUSTRY;
export const industry: string[] = industryEnv ? JSON.parse(industryEnv) : [];                      // (dynamic multiple select)

const jobFunctionEnv = process.env.JOB_FUNCTION;
export const job_function: string[] = jobFunctionEnv ? JSON.parse(jobFunctionEnv) : [];                  // (dynamic multiple select)

const jobTitlesEnv = process.env.JOB_TITLES;
export const job_titles: string[] = jobTitlesEnv ? JSON.parse(jobTitlesEnv) : [];                    // (dynamic multiple select)

const benefitsEnv = process.env.BENEFITS;
export const benefits: string[] = benefitsEnv ? JSON.parse(benefitsEnv) : [];                      // (dynamic multiple select)

const commitmentsEnv = process.env.COMMITMENTS;
export const commitments: string[] = commitmentsEnv ? JSON.parse(commitmentsEnv) : [];                      // (dynamic multiple select)

export const under_10_applicants = process.env.UNDER_10_APPLICANTS === "true";        // True or False, Note: True or False are case-sensitive
export const in_your_network = process.env.IN_YOUR_NETWORK === "true";        // True or False, Note: True or False are case-sensitive
export const fair_chance_employer = process.env.FAIR_CHANCE_EMPLOYER === "true";        // True or False, Note: True or False are case-sensitive

// Pause after applying filters to let you modify the search results and filters?
export const pause_after_filters = process.env.PAUSE_AFTER_FILTERS === "true" || process.env.PAUSE_AFTER_FILTERS === undefined ? true : false;         // True or False, Note: True or False are case-sensitive

// >>>>>>>>>>> SKIP IRRELEVANT JOBS <<<<<<<<<<<

const aboutCompanyBadWordsEnv = process.env.ABOUT_COMPANY_BAD_WORDS;
export const about_company_bad_words: string[] = aboutCompanyBadWordsEnv ? JSON.parse(aboutCompanyBadWordsEnv) : ["Crossover"];       // (dynamic multiple search) or leave empty as []. Ex: ["Staffing", "Recruiting", "Name of Company you don't want to apply to"]

const aboutCompanyGoodWordsEnv = process.env.ABOUT_COMPANY_GOOD_WORDS;
export const about_company_good_words: string[] = aboutCompanyGoodWordsEnv ? JSON.parse(aboutCompanyGoodWordsEnv) : [];      // (dynamic multiple search) or leave empty as []. Ex: ["Robert Half", "Dice"]

const badWordsEnv = process.env.BAD_WORDS;
export const bad_words: string[] = badWordsEnv ? JSON.parse(badWordsEnv) : ["US Citizen","USA Citizen","No C2C", "No Corp2Corp", ".NET", "Embedded Programming", "PHP", "Ruby", "CNC"];                     // (dynamic multiple search) or leave empty as []. Case Insensitive. Ex: ["word_1", "phrase 1", "word word", "polygraph", "US Citizenship", "Security Clearance"]

// Do you have an active Security Clearance? (True for Yes and False for No)
export const security_clearance = process.env.SECURITY_CLEARANCE === "true";         // True or False, Note: True or False are case-sensitive

// Do you have a Masters degree? (True for Yes and False for No). If True, the tool will apply to jobs containing the word 'master' in their job description and if it's experience required <= current_experience + 2 and current_experience is not set as -1. 
export const did_masters = process.env.DID_MASTERS === "true" || process.env.DID_MASTERS === undefined ? true : false;                 // True or False, Note: True or False are case-sensitive

// Avoid applying to jobs if their required experience is above your current_experience. (Set value as -1 if you want to apply to all ignoring their required experience...)
export const current_experience = parseInt(process.env.CURRENT_EXPERIENCE || "5");             // Integers > -2 (Ex: -1, 0, 1, 2, 3, 4...)
