/**
 * Google Sheets Waitlist Submission Handler
 * 
 * SETUP INSTRUCTIONS:
 * ===================
 * 
 * 1. Create a new Google Sheet for your waitlist data
 * 
 * 2. Open Google Apps Script (Extensions > Apps Script)
 * 
 * 3. Replace the default code with this script:
 * 
 * ```javascript
  function doPost(e) {
 *   try {
 *     // Get the active spreadsheet (or specify by ID)
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     
 *     // Parse the incoming data
 *     const data = JSON.parse(e.postData.contents);
 *     
 *     // Get current timestamp
 *     const timestamp = new Date();
 *     
 *     // Add headers if this is the first row
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow(['Timestamp', 'Email', 'Source']);
 *     }
 *     
 *     // Append the new data
 *     sheet.appendRow([
 *       timestamp,
 *       data.email,
 *       data.source || 'website'
 *     ]);
 *     
 *     // Return success response
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ 
 *         success: true, 
 *         message: 'Email added to waitlist' 
 *       }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *       
 *   } catch (error) {
 *     // Return error response
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ 
 *         success: false, 
 *         message: error.toString() 
 *       }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ```
 * 
 * 4. Deploy the script:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (or "Anyone with Google account" for more security)
 *    - Click "Deploy"
 *    - Copy the Web app URL
 * 
 * 5. Update the GOOGLE_SCRIPT_URL constant below with your deployed URL
 * 
 * 6. Grant necessary permissions when prompted
 * 
 * SECURITY NOTES:
 * ===============
 * - The Google Apps Script URL is public but only accepts POST requests
 * - Consider adding rate limiting in the Apps Script
 * - Add email validation in the Apps Script for extra security
 * - For production, consider adding a simple token-based authentication
 */

// Replace this with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export interface WaitlistSubmission {
  email: string;
  source?: string;
  timestamp?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Submit email to Google Sheets waitlist
 * @param email - The email address to add to the waitlist
 * @param source - Optional source identifier (e.g., 'hero', 'cta', 'footer')
 * @returns Promise with submission result
 */
export async function submitToWaitlist(
  email: string,
  source: string = 'website'
): Promise<SubmissionResponse> {
  // Validate email format
  if (!isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
      error: 'INVALID_EMAIL'
    };
  }
  // Check if Google Script URL is configured
  if (!GOOGLE_SCRIPT_URL) {
    console.error('Google Apps Script URL not configured');
    return {
      success: false,
      message: 'Service configuration error. Please try again later.',
      error: 'CONFIG_ERROR'
    };
  }

  const submissionData: WaitlistSubmission = {
    email: email.trim().toLowerCase(),
    source,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    console.log('Waitlist submission response:', response);

    // Note: With no-cors mode, we can't read the response
    // We assume success if no error was thrown
    // For a production app, you might want to use a proxy server
    // that can handle CORS properly
    
    return {
      success: true,
      message: 'Successfully added to waitlist!'
    };

  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    
    return {
      success: false,
      message: 'Unable to submit. Please try again later.',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Alternative: Submit with CORS support using redirect mode
 * Use this if you configure your Google Apps Script to handle CORS properly
 */
export async function submitToWaitlistWithCORS(
  email: string,
  source: string = 'website'
): Promise<SubmissionResponse> {
  if (!isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
      error: 'INVALID_EMAIL'
    };
  }

  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
    return {
      success: false,
      message: 'Service configuration error. Please try again later.',
      error: 'CONFIG_ERROR'
    };
  }

  const submissionData: WaitlistSubmission = {
    email: email.trim().toLowerCase(),
    source,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
      redirect: 'follow'
    });

    const data = await response.json();
    
    return {
      success: data.success || false,
      message: data.message || 'Submitted successfully'
    };

  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    
    return {
      success: false,
      message: 'Unable to submit. Please try again later.',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ALTERNATIVE GOOGLE APPS SCRIPT WITH CORS SUPPORT:
 * ==================================================
 * 
 * If you want to receive response data and handle CORS properly,
 * use this enhanced Google Apps Script instead:
 * 
 * ```javascript
 * function doPost(e) {
 *   try {
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     const data = JSON.parse(e.postData.contents);
 *     const timestamp = new Date();
 *     
 *     // Add headers if needed
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow(['Timestamp', 'Email', 'Source']);
 *     }
 *     
 *     // Check for duplicate emails (optional)
 *     const emails = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
 *     const emailExists = emails.some(row => row[0] === data.email);
 *     
 *     if (emailExists) {
 *       return createResponse({ 
 *         success: false, 
 *         message: 'Email already registered' 
 *       });
 *     }
 *     
 *     // Append new data
 *     sheet.appendRow([timestamp, data.email, data.source || 'website']);
 *     
 *     return createResponse({ 
 *       success: true, 
 *       message: 'Email added to waitlist' 
 *     });
 *     
 *   } catch (error) {
 *     return createResponse({ 
 *       success: false, 
 *       message: error.toString() 
 *     });
 *   }
 * }
 * 
 * function createResponse(data) {
 *   return ContentService
 *     .createTextOutput(JSON.stringify(data))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doGet(e) {
 *   return createResponse({ 
 *     success: false, 
 *     message: 'Only POST requests are accepted' 
 *   });
 * }
 * ```
 * 
 * USING WITH SUPABASE EDGE FUNCTION AS PROXY (Advanced):
 * =======================================================
 * 
 * For better CORS handling and security, you can create a Supabase Edge Function
 * that proxies requests to your Google Apps Script. This allows you to:
 * - Handle CORS properly
 * - Add rate limiting
 * - Add authentication
 * - Process responses correctly
 * 
 * The edge function would call your Google Apps Script and return the response.
 */
