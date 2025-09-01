export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'email' | 'select' | 'number' | 'toggle';
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  fields: ConfigField[];
  testConnection?: boolean; // Whether this integration supports connection testing
}

export const integrationConfigs: Record<string, IntegrationConfig> = {
  // CRM Systems
  PESTPAC: {
    id: 'PESTPAC',
    name: 'PestPac',
    description: 'Configure your PestPac connection to sync customer and service data.',
    fields: [
      {
        key: 'companyKey',
        label: 'Company Key',
        type: 'text',
        required: true,
        placeholder: 'your-company-key',
        description: 'The PestPac company key identifier'
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'your-username',
        description: 'PestPac login username'
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'PestPac login password'
      }
    ],
    testConnection: true
  },

  FIELDROUTES: {
    id: 'FIELDROUTES',
    name: 'FieldRoutes',
    description: 'Connect to FieldRoutes to sync routes, customers, and service data.',
    fields: [
      {
        key: 'base_url',
        label: 'API Base URL',
        type: 'url',
        required: true,
        placeholder: 'https://company.fieldroutes.com/api/',
        description: 'Your FieldRoutes API base URL (replace "company" with your subdomain)'
      },
      {
        key: 'key',
        label: 'Authentication Key',
        type: 'text',
        required: true,
        placeholder: 'your-auth-key',
        description: 'Authentication Key from FieldRoutes API settings'
      },
      {
        key: 'token',
        label: 'Authentication Token',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'Authentication Token from FieldRoutes API settings'
      },
      {
        key: 'officeID',
        label: 'Office ID',
        type: 'text',
        required: false,
        placeholder: 'optional-office-id',
        description: 'Optional Office ID for multi-office setups'
      },
      {
        key: 'free',
        label: 'Free Account',
        type: 'toggle',
        required: false,
        description: 'Enable if you have a FieldRoutes free account (API requests will be limited)'
      }
    ],
    testConnection: true
  },

  FIELDWORK: {
    id: 'FIELDWORK',
    name: 'FieldWork',
    description: 'Integrate with FieldWork for mobile field service management.',
    fields: [
      {
        key: 'username',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'your-email@example.com',
        description: 'Your FieldWork login email'
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'Your FieldWork login password'
      },
      {
        key: 'api_key',
        label: 'API Key (Optional)',
        type: 'password',
        required: false,
        placeholder: 'your-fieldwork-api-key',
        description: 'If provided, will use API Key authentication instead of email/password'
      }
    ],
    testConnection: true
  },

  BRIOSTACK: {
    id: 'BRIOSTACK',
    name: 'BrioStack',
    description: 'Connect to BrioStack for comprehensive business management.',
    fields: [
      {
        key: 'organization_id',
        label: 'Organization ID',
        type: 'text',
        required: true,
        placeholder: 'your-organization-id',
        description: 'Your BrioStack organization identifier (used in URL: https://your-org.briostack.com)'
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'your-username',
        description: 'Your BrioStack username'
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'Your BrioStack password'
      }
    ],
    testConnection: true
  },

  // Communication & Marketing
  HUBSPOT: {
    id: 'HUBSPOT',
    name: 'HubSpot',
    description: 'Sync leads, contacts, and marketing data with HubSpot.',
    fields: [
      {
        key: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'pat-na1-...',
        description: 'HubSpot private app access token'
      },
      {
        key: 'portal_id',
        label: 'Portal ID',
        type: 'number',
        required: true,
        placeholder: '12345678',
        description: 'Your HubSpot portal/hub ID'
      }
    ],
    testConnection: true
  },

  RINGCENTRAL: {
    id: 'RINGCENTRAL',
    name: 'RingCentral',
    description: 'Integrate call data and communications from RingCentral.',
    fields: [
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true,
        placeholder: 'your-app-client-id',
        description: 'RingCentral app client ID'
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'RingCentral app client secret'
      },
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        description: 'RingCentral environment',
        options: [
          { value: 'production', label: 'Production' },
          { value: 'sandbox', label: 'Sandbox' }
        ]
      }
    ],
    testConnection: true
  },

  CALLRAIL: {
    id: 'CALLRAIL',
    name: 'CallRail',
    description: 'Track and analyze call data from CallRail.',
    fields: [
      {
        key: 'api_token',
        label: 'API Token',
        type: 'password',
        required: true,
        placeholder: 'your-api-token',
        description: 'CallRail API token from Account Settings'
      },
      {
        key: 'account_id',
        label: 'Account ID',
        type: 'text',
        required: true,
        placeholder: 'AC...',
        description: 'Your CallRail account ID'
      }
    ],
    testConnection: true
  },

  // Fleet Management
  SAMSARA: {
    id: 'SAMSARA',
    name: 'Samsara',
    description: 'Connect fleet tracking and driver safety data from Samsara.',
    fields: [
      {
        key: 'api_token',
        label: 'API Token',
        type: 'password',
        required: true,
        placeholder: 'samsara_api_...',
        description: 'Samsara API token from Admin Settings'
      },
      {
        key: 'group_id',
        label: 'Group ID',
        type: 'text',
        required: false,
        placeholder: '123456789',
        description: 'Specific group ID (optional, leave blank for all)'
      }
    ],
    testConnection: true
  },

  VERIZONCONNECT: {
    id: 'VERIZONCONNECT',
    name: 'Verizon Connect',
    description: 'Integrate fleet management data from Verizon Connect.',
    fields: [
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'your-username',
        description: 'Verizon Connect login username'
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: '••••••••',
        description: 'Verizon Connect login password'
      },
      {
        key: 'fleet_id',
        label: 'Fleet ID',
        type: 'text',
        required: true,
        placeholder: 'fleet-123',
        description: 'Your fleet identifier'
      }
    ],
    testConnection: true
  },

  // Reviews & Feedback
  LISTEN360: {
    id: 'LISTEN360',
    name: 'Listen360',
    description: 'Sync customer feedback and review data from Listen360.',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'L360_...',
        description: 'Listen360 API key from your account settings'
      },
      {
        key: 'location_id',
        label: 'Location ID',
        type: 'text',
        required: false,
        placeholder: 'loc_123',
        description: 'Specific location ID (optional)'
      }
    ],
    testConnection: true
  },

  // Default configuration for integrations not specifically defined
  DEFAULT: {
    id: 'DEFAULT',
    name: 'Integration',
    description: 'Configure this integration with the required connection details.',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'your-api-key',
        description: 'API key or access token for this integration'
      },
      {
        key: 'api_url',
        label: 'API URL',
        type: 'url',
        required: false,
        placeholder: 'https://api.example.com',
        description: 'API endpoint URL (if required)'
      }
    ],
    testConnection: false
  }
};

export const getIntegrationConfig = (integrationId: string): IntegrationConfig => {
  return integrationConfigs[integrationId] || integrationConfigs.DEFAULT;
};