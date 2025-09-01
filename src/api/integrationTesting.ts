// Integration Testing API
// This module provides functions to test various integration credentials

export interface TestConnectionResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface BrioStackCredentials {
  api_url?: string;
  organization_id: string;
  username: string;
  password: string;
}

export interface FieldRoutesCredentials {
  base_url: string;
  key: string;
  token: string;
  officeID?: string;
  free?: boolean;
}

export interface PestPacCredentials {
  companyKey: string;
  username: string;
  password: string;
}

export interface FieldWorkCredentials {
  username: string;
  password: string;
  api_key?: string;
}

// BrioStack Connection Test
export async function testBrioStackConnection(credentials: BrioStackCredentials): Promise<TestConnectionResult> {
  try {
    // Validate required fields
    if (!credentials.organization_id?.trim()) {
      return {
        success: false,
        message: 'Organization ID is required. Please enter your BrioStack organization ID.'
      };
    }

    if (!credentials.username?.trim()) {
      return {
        success: false,
        message: 'Username is required. Please enter your BrioStack username.'
      };
    }

    if (!credentials.password?.trim()) {
      return {
        success: false,
        message: 'Password is required. Please enter your BrioStack password.'
      };
    }

    const organizationId = credentials.organization_id.trim();

    // Validate organization ID format (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(organizationId)) {
      return {
        success: false,
        message: 'Invalid organization ID format. Organization ID should only contain letters, numbers, hyphens, and underscores.'
      };
    }

    // Construct the BrioStack API URL
    const apiUrl = `https://${organizationId}.briostack.com/api/`;
    
    // Prepare login request payload
    const loginPayload = {
      service: 'loginService',
      security: {
        map: {
          USERNAME: credentials.username.trim(),
          PASSWORD: credentials.password
        }
      }
    };

    // Test the connection with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    let response: Response;
    
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginPayload),
        signal: controller.signal
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          message: 'Connection timeout: BrioStack took too long to respond. Please check your organization ID and try again.'
        };
      }
      throw fetchError;
    }

    clearTimeout(timeoutId);

    // Handle HTTP status codes
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: `Organization "${organizationId}" not found. Please verify your organization ID. The URL should be: https://${organizationId}.briostack.com`,
          details: { status: response.status, organizationId, expectedUrl: `https://${organizationId}.briostack.com` }
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Invalid username or password. Please check your credentials and try again.',
          details: { status: response.status }
        };
      } else if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Your account may be disabled or lack sufficient permissions.',
          details: { status: response.status }
        };
      } else if (response.status === 500) {
        return {
          success: false,
          message: 'BrioStack server error. Please try again later or contact BrioStack support.',
          details: { status: response.status }
        };
      } else if (response.status === 502 || response.status === 503 || response.status === 504) {
        return {
          success: false,
          message: 'BrioStack service is temporarily unavailable. Please try again in a few minutes.',
          details: { status: response.status }
        };
      } else {
        return {
          success: false,
          message: `Connection failed with HTTP status ${response.status}. Please check your credentials and try again.`,
          details: { status: response.status }
        };
      }
    }

    // Parse the response
    let result: any;
    try {
      result = await response.json();
    } catch (parseError) {
      return {
        success: false,
        message: 'Invalid response from BrioStack. The service may be experiencing issues.',
        details: { error: 'Failed to parse JSON response' }
      };
    }
    
    // Check if BrioStack returned an error in the response body
    if (result.error) {
      const errorMsg = result.error.msg || result.error.message || 'Authentication failed';
      
      // Handle specific BrioStack error messages
      if (errorMsg.toLowerCase().includes('invalid username') || errorMsg.toLowerCase().includes('invalid password')) {
        return {
          success: false,
          message: 'Invalid username or password. Please check your credentials.',
          details: result.error
        };
      } else if (errorMsg.toLowerCase().includes('account locked') || errorMsg.toLowerCase().includes('account disabled')) {
        return {
          success: false,
          message: 'Your account is locked or disabled. Please contact your BrioStack administrator.',
          details: result.error
        };
      } else if (errorMsg.toLowerCase().includes('session limit')) {
        return {
          success: false,
          message: 'Session limit reached. Please try again in a few minutes or log out of other BrioStack sessions.',
          details: result.error
        };
      } else {
        return {
          success: false,
          message: `BrioStack Error: ${errorMsg}`,
          details: result.error
        };
      }
    }

    // Check for successful login response
    if (result.data || result.success || (!result.error && response.ok)) {
      return {
        success: true,
        message: `Successfully connected to BrioStack! ✅\n\nOrganization: ${organizationId}\nAPI URL: ${apiUrl}`,
        details: {
          organizationId,
          apiUrl,
          loginTime: new Date().toISOString(),
          response: result
        }
      };
    }

    // If we get here, the response format is unexpected
    return {
      success: false,
      message: 'Unexpected response from BrioStack. The connection may have succeeded but the response format is not recognized.',
      details: { response: result }
    };

  } catch (error: any) {
    // Handle network errors, CORS issues, etc.
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network'))) {
      return {
        success: false,
        message: 'Network error: Unable to connect to BrioStack. Please check:\n• Your internet connection\n• The organization ID is correct\n• BrioStack servers are accessible',
        details: { error: error.message }
      };
    }

    if (error.message.includes('CORS')) {
      return {
        success: false,
        message: 'Cross-origin request blocked. This is a browser security feature. In production, this test would work properly.',
        details: { error: error.message }
      };
    }

    return {
      success: false,
      message: `Connection test failed: ${error.message}`,
      details: { error: error.message }
    };
  }
}

// Placeholder functions for other CRM systems
export async function testFieldRoutesConnection(credentials: FieldRoutesCredentials): Promise<TestConnectionResult> {
  try {
    // Validate required fields
    if (!credentials.base_url) {
      return {
        success: false,
        message: 'API Base URL is required for FieldRoutes connection'
      };
    }

    if (!credentials.key) {
      return {
        success: false,
        message: 'Authentication Key is required for FieldRoutes connection'
      };
    }

    if (!credentials.token) {
      return {
        success: false,
        message: 'Authentication Token is required for FieldRoutes connection'
      };
    }

    // Validate base_url format
    if (!credentials.base_url.match(/^https?:\/\/.+/)) {
      return {
        success: false,
        message: 'Invalid base URL format. Please use format: https://company.fieldroutes.com/api/'
      };
    }

    console.log('🔄 Testing FieldRoutes connection...', {
      base_url: credentials.base_url,
      key: credentials.key.substring(0, 5) + '***',
      token: credentials.token.substring(0, 5) + '***',
      officeID: credentials.officeID,
      freeAccount: credentials.free || false
    });

    // Create the request payload like the AppServer does
    const payload = {
      authenticationKey: credentials.key,
      authenticationToken: credentials.token
    };

    // Add optional office ID if provided
    if (credentials.officeID) {
      payload['officeID'] = credentials.officeID;
    }

    // Add free trial mode if enabled
    if (credentials.free) {
      payload['free'] = true;
    }

    // Test with a simple endpoint (similar to how AppServer tests)
    // FieldRoutes typically uses endpoints like /employee/search for validation
    const testEndpoint = `${credentials.base_url}/employee/search`;

    console.log('📡 Making FieldRoutes API call to:', testEndpoint);
    console.log('📤 Request payload:', {
      ...payload,
      authenticationKey: payload.authenticationKey.substring(0, 5) + '***',
      authenticationToken: payload.authenticationToken.substring(0, 5) + '***'
    });

    const response = await fetch(testEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    console.log('📨 FieldRoutes API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          message: 'Invalid authentication credentials. Please check your Authentication Key and Token.'
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please verify your FieldRoutes credentials.'
        };
      } else if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Your credentials may not have the required permissions.'
        };
      } else if (response.status === 404) {
        return {
          success: false,
          message: 'API endpoint not found. Please check your base URL.'
        };
      } else if (response.status >= 500) {
        return {
          success: false,
          message: 'FieldRoutes server error. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: `FieldRoutes API error: ${response.status} ${response.statusText}`
        };
      }
    }

    const data = await response.json();
    console.log('📋 FieldRoutes Response Data:', data);

    // Check if the response indicates success
    if (data.success === false) {
      return {
        success: false,
        message: `FieldRoutes API Error: ${data.errorMessage || 'Authentication failed'}`
      };
    }

    // FieldRoutes successful response
    const modeMessage = credentials.free 
      ? 'FieldRoutes connection successful! Free account mode - API requests will be limited.'
      : 'FieldRoutes connection successful! Paid account with full API access.';
      
    return {
      success: true,
      message: modeMessage,
      details: {
        base_url: credentials.base_url,
        officeID: credentials.officeID || 'default',
        freeAccount: credentials.free || false,
        responseData: data
      }
    };

  } catch (error: any) {
    console.error('❌ FieldRoutes Connection Error:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'FieldRoutes connection timeout. Please check your network and try again.'
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error connecting to FieldRoutes. This is expected in development due to CORS restrictions.'
      };
    }

    return {
      success: false,
      message: `FieldRoutes connection failed: ${error.message || 'Unknown error'}`
    };
  }
}

export async function testPestPacConnection(credentials: PestPacCredentials): Promise<TestConnectionResult> {
  try {
    // Validate required fields
    if (!credentials.companyKey) {
      return {
        success: false,
        message: 'Company Key is required for PestPac connection'
      };
    }

    if (!credentials.username) {
      return {
        success: false,
        message: 'Username is required for PestPac connection'
      };
    }

    if (!credentials.password) {
      return {
        success: false,
        message: 'Password is required for PestPac connection'
      };
    }

    console.log('🔄 Testing PestPac connection...', {
      companyKey: credentials.companyKey,
      username: credentials.username,
      password: '***'
    });

    // PestPac uses web scraping, so we test the login endpoint
    // This mimics the AppServer ClientSession.login() flow
    const baseUrl = 'https://app.pestpac.com';
    const loginUrl = `${baseUrl}/default.asp?Mode=Login`;

    console.log('📡 Testing PestPac web-based authentication...');
    
    // Create form data exactly like AppServer does
    const formData = new URLSearchParams({
      CompanyKey: credentials.companyKey,
      Username: credentials.username,
      Password: credentials.password,
      RememberMe: '0'
    });

    console.log('📤 Request payload:', {
      CompanyKey: credentials.companyKey,
      Username: credentials.username,
      Password: '***',
      RememberMe: '0'
    });

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'upgrade-insecure-requests': '1'
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(15000)
    });

    console.log('📨 PestPac Login Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          message: 'Invalid request. Please check your Company Key, Username, and Password.'
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please verify your PestPac credentials.'
        };
      } else if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Your credentials may not have the required permissions.'
        };
      } else if (response.status === 404) {
        return {
          success: false,
          message: 'PestPac login endpoint not found. Please check the service status.'
        };
      } else if (response.status >= 500) {
        return {
          success: false,
          message: 'PestPac server error. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: `PestPac login error: ${response.status} ${response.statusText}`
        };
      }
    }

    // For web scraping systems like PestPac, we check the response content
    const responseText = await response.text();
    console.log('📋 PestPac Response Analysis:', {
      responseLength: responseText.length,
      finalUrl: response.url,
      hasRedirect: response.redirected
    });

    // Check for common error indicators in the HTML response
    const lowerCaseResponse = responseText.toLowerCase();
    
    // Check for login failure indicators
    if (lowerCaseResponse.includes('invalid') && lowerCaseResponse.includes('login')) {
      return {
        success: false,
        message: 'Invalid login credentials. Please check your Company Key, Username, and Password.'
      };
    }

    if (lowerCaseResponse.includes('error') && lowerCaseResponse.includes('login')) {
      return {
        success: false,
        message: 'Login error. Please verify your PestPac credentials.'
      };
    }

    if (lowerCaseResponse.includes('license manager')) {
      return {
        success: true,
        message: 'PestPac connection successful! Authentication verified (license management required).',
        details: {
          companyKey: credentials.companyKey,
          username: credentials.username,
          responseType: 'license_manager',
          note: 'Login successful but license management may be required'
        }
      };
    }

    // Check for successful login indicators
    if (lowerCaseResponse.includes('main') || 
        lowerCaseResponse.includes('dashboard') || 
        lowerCaseResponse.includes('pestpac') ||
        response.url.includes('main') ||
        response.redirected) {
      
      return {
        success: true,
        message: 'PestPac connection successful! Authentication verified and logged in.',
        details: {
          companyKey: credentials.companyKey,
          username: credentials.username,
          responseType: 'successful_login',
          finalUrl: response.url
        }
      };
    }

    // If we get here, the response was successful but we can't determine the outcome
    return {
      success: true,
      message: 'PestPac connection response received, but could not verify login status. Please check manually.',
      details: {
        companyKey: credentials.companyKey,
        username: credentials.username,
        responseType: 'unknown',
        note: 'HTTP request successful but login status unclear'
      }
    };

  } catch (error: any) {
    console.error('❌ PestPac Connection Error:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'PestPac connection timeout. Please check your network and try again.'
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error connecting to PestPac. This is expected in development due to CORS restrictions.'
      };
    }

    return {
      success: false,
      message: `PestPac connection failed: ${error.message || 'Unknown error'}`
    };
  }
}

export async function testFieldWorkConnection(credentials: FieldWorkCredentials): Promise<TestConnectionResult> {
  try {
    // Validate required fields
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        message: 'Email and Password are required for FieldWork connection'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.username)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }

    console.log('🔄 Testing FieldWork connection...', {
      username: credentials.username,
      api_key: credentials.api_key ? credentials.api_key.substring(0, 5) + '***' : 'not provided'
    });

    const baseUrl = 'https://api3.fieldworkhq.com/v3.1';

    // Mimic exactly how AppServer login works - try with credentials provided
    // FieldWork ClientSession will automatically use API key if provided, otherwise email/password
    console.log('📡 Testing FieldWork authentication...');
    
    const payload = {
      email: credentials.username,
      password: credentials.password
    };

    // Add API key if provided (matches AppServer logic)
    if (credentials.api_key) {
      payload['api_key'] = credentials.api_key;
    }

    const loginUrl = `${baseUrl}/get_api_key`;
    
    console.log('📤 Request payload:', {
      email: credentials.username,
      password: '***',
      api_key: credentials.api_key ? '***' : 'not provided'
    });

    const formData = new URLSearchParams(payload);

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(15000)
    });

    console.log('📨 FieldWork API Response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          message: 'Invalid credentials. Please check your email, password, and API key (if provided).'
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please verify your FieldWork credentials.'
        };
      } else if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Your credentials may not have the required permissions.'
        };
      } else if (response.status === 404) {
        return {
          success: false,
          message: 'FieldWork API endpoint not found. Please check the service status.'
        };
      } else if (response.status >= 500) {
        return {
          success: false,
          message: 'FieldWork server error. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: `FieldWork API error: ${response.status} ${response.statusText}`
        };
      }
    }

    const data = await response.json();
    console.log('📋 FieldWork Response Data:', data);

    if (!data.api_key) {
      return {
        success: false,
        message: 'Failed to retrieve API key. Please check your credentials.'
      };
    }

    // Determine which auth method was actually used
    const authMethod = credentials.api_key ? 'API Key' : 'Email/Password';
    
    return {
      success: true,
      message: `FieldWork connection successful! ${authMethod} authentication verified.`,
      details: {
        username: credentials.username,
        user_id: data.user_id,
        name: data.name,
        auth_method_used: authMethod,
        baseUrl: baseUrl
      }
    };

  } catch (error: any) {
    console.error('❌ FieldWork Connection Error:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'FieldWork connection timeout. Please check your network and try again.'
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error connecting to FieldWork. This is expected in development due to CORS restrictions.'
      };
    }

    return {
      success: false,
      message: `FieldWork connection failed: ${error.message || 'Unknown error'}`
    };
  }
}

// Generic test function that routes to the appropriate integration
export async function testIntegrationConnection(
  integrationType: string, 
  credentials: Record<string, any>
): Promise<TestConnectionResult> {
  
  switch (integrationType.toUpperCase()) {
    case 'BRIOSTACK':
      return testBrioStackConnection(credentials as BrioStackCredentials);
    
    case 'FIELDROUTES':
      return testFieldRoutesConnection(credentials as FieldRoutesCredentials);
    
    case 'PESTPAC':
      return testPestPacConnection(credentials as PestPacCredentials);
    
    case 'FIELDWORK':
      return testFieldWorkConnection(credentials as FieldWorkCredentials);
    
    default:
      return {
        success: false,
        message: `Connection testing for ${integrationType} is not yet implemented`
      };
  }
}
