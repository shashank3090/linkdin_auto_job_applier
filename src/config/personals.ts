

import * as dotenv from 'dotenv';
dotenv.config();

// Your legal name
export const first_name = process.env.FIRST_NAME || "Sai";                 // Your first name in quotes Eg: "First", "Sai"
export const middle_name = process.env.MIDDLE_NAME || "Vignesh";            // Your name in quotes Eg: "Middle", "Vignesh", ""
export const last_name = process.env.LAST_NAME || "Golla";                // Your last name in quotes Eg: "Last", "Golla"

// Phone number (required), make sure it's valid.
export const phone_number = process.env.PHONE_NUMBER || "9876543210";        // Enter your 10 digit number in quotes Eg: "9876543210"

// What is your current city?
export const current_city = process.env.CURRENT_CITY || "";                  // Los Angeles, San Francisco, etc.
/**
 * Note: If left empty as "", the bot will fill in location of jobs location.
 */

// Address, not so common question but some job applications make it required!
export const street = process.env.STREET || "123 Main Street";
export const state = process.env.STATE || "STATE";
export const zipcode = process.env.ZIPCODE || "";
