// Mock API layer for rules functionality
// This can be easily replaced with actual backend API calls

export interface RulesAPI {
    getRulesForOrganization(id: number): Promise<string>;
    updateRulesForOrganization(params: { id: number; script: string }): Promise<string>;
    testCompileRules(script: string): Promise<string>;
}

// Mock implementation - replace with actual API calls
const mockRulesAPI: RulesAPI = {
    async getRulesForOrganization(id: number): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Return sample script for the organization
        return `-- Sample Driven script for Organization ${id}
MODULE [My Organization]:
    RULESET [Has High Value Customers]:
        RULE [Default]: customer_value > 5000
    END

    ===
    This is a multiline comment
    for organization-wide rules
    ===
    RULESET [Service Schedule]:
        RULE [Default]: TIME(12, 0, 0)
        RULE [Priority Customer]:
            = IF(customer_priority == "HIGH", 30 minutes)
            = TIME(10, 0, 0)
    END
END`;
    },

    async updateRulesForOrganization(params: { id: number; script: string }): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Log for debugging - replace with proper API call
        // eslint-disable-next-line no-console
        console.log(`Saving rules for organization ${params.id}:`, params.script);
        
        // Simulate successful save
        return 'Rules updated successfully';
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
        console.log('Script compiled successfully:', script);
        return 'Compilation successful';
    }
};

export const rulesAPI = mockRulesAPI;