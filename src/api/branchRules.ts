// Mock API layer for branch rules functionality
// This can be easily replaced with actual backend API calls

export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  manager: string;
  employees: number;
  active: boolean;
  dateEstablished: string;
  type: 'Main Office' | 'Branch' | 'Service Center' | 'Warehouse';
}

export interface BranchRulesAPI {
    getBranchesForOrganization(orgId: number): Promise<Branch[]>;
    getRulesForBranch(params: { branchId: number }): Promise<string>;
    updateRulesForBranch(params: { branchId: number; script: string }): Promise<string>;
    testCompileRules(script: string): Promise<string>;
}

// Mock branches data
const mockBranches: Branch[] = [
  { 
    id: 1, 
    name: 'Main Office', 
    address: '1250 Corporate Drive', 
    city: 'Austin', 
    state: 'TX', 
    zipCode: '78746', 
    phone: '512-555-0100', 
    manager: 'John Smith', 
    employees: 45, 
    active: true, 
    dateEstablished: '2015-03-15',
    type: 'Main Office'
  },
  { 
    id: 2, 
    name: 'North Branch', 
    address: '890 Industrial Blvd', 
    city: 'Round Rock', 
    state: 'TX', 
    zipCode: '78681', 
    phone: '512-555-0200', 
    manager: 'Sarah Johnson', 
    employees: 23, 
    active: true, 
    dateEstablished: '2018-07-20',
    type: 'Branch'
  },
  { 
    id: 3, 
    name: 'South Service Center', 
    address: '456 Service Road', 
    city: 'Kyle', 
    state: 'TX', 
    zipCode: '78640', 
    phone: '512-555-0300', 
    manager: 'Mike Wilson', 
    employees: 18, 
    active: true, 
    dateEstablished: '2020-01-10',
    type: 'Service Center'
  },
  { 
    id: 4, 
    name: 'East Warehouse', 
    address: '123 Storage Way', 
    city: 'Pflugerville', 
    state: 'TX', 
    zipCode: '78660', 
    phone: '512-555-0400', 
    manager: 'Lisa Brown', 
    employees: 12, 
    active: true, 
    dateEstablished: '2019-11-05',
    type: 'Warehouse'
  },
  { 
    id: 5, 
    name: 'West Branch', 
    address: '789 Commerce St', 
    city: 'Lakeway', 
    state: 'TX', 
    zipCode: '78734', 
    phone: '512-555-0500', 
    manager: 'David Garcia', 
    employees: 15, 
    active: false, 
    dateEstablished: '2017-09-12',
    type: 'Branch'
  }
];

// Mock implementation - replace with actual API calls
const mockBranchRulesAPI: BranchRulesAPI = {
    async getBranchesForOrganization(orgId: number): Promise<Branch[]> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Return active branches for the organization
        return mockBranches.filter(branch => branch.active);
    },

    async getRulesForBranch(params: { branchId: number }): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const branch = mockBranches.find(b => b.id === params.branchId);
        if (!branch) {
            throw new Error('Branch not found');
        }
        
        // Return sample script for the branch
        return `-- Sample Driven script for ${branch.name}
MODULE [${branch.name}]:
    RULESET [Branch Operations]:
        RULE [Operating Hours]: 
            = TIME(8, 0, 0) AND TIME(17, 0, 0)
        RULE [Staff Level]: 
            = ${branch.employees} employees
    END

    ===
    Branch-specific rules override organization rules
    for users assigned to this branch
    ===
    RULESET [Service Territory]:
        RULE [Coverage Area]: 
            = "${branch.city}, ${branch.state}"
        RULE [Manager Override]:
            = IF(manager == "${branch.manager}", TRUE)
            = FALSE
    END
    
    RULESET [Branch Type Specific]:
        RULE [${branch.type} Rules]:
            = IF(branch_type == "${branch.type}", TRUE)
            = FALSE
    END
END`;
    },

    async updateRulesForBranch(params: { branchId: number; script: string }): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const branch = mockBranches.find(b => b.id === params.branchId);
        if (!branch) {
            throw new Error('Branch not found');
        }
        
        // Log for debugging - replace with proper API call
        // eslint-disable-next-line no-console
        console.log(`Saving rules for branch ${branch.name} (ID: ${params.branchId}):`, params.script);
        
        // Simulate successful save
        return `Rules updated successfully for ${branch.name}`;
    },

    async testCompileRules(script: string): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Basic validation - check for required keywords
        const hasModule = /MODULE\s*\[.*?\]/i.test(script);
        const hasEnd = /END/i.test(script);
        
        if (!hasModule) {
            throw new Error('Script must contain at least one MODULE declaration');
        }
        
        if (!hasEnd) {
            throw new Error('Script must contain END statements for all MODULE/RULESET blocks');
        }
        
        // Check for basic syntax issues
        const moduleCount = (script.match(/MODULE/gi) || []).length;
        const endCount = (script.match(/END/gi) || []).length;
        
        if (moduleCount > endCount) {
            throw new Error('Missing END statements - each MODULE and RULESET must have a corresponding END');
        }
        
        // Log for debugging - replace with proper API call
        // eslint-disable-next-line no-console
        console.log('Branch script compiled successfully:', script);
        return 'Branch script compilation successful';
    }
};

export const branchRulesAPI = mockBranchRulesAPI;