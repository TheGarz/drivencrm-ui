// Mock API layer for user rules functionality
// This can be easily replaced with actual backend API calls

export interface UserRulesAPI {
    getRulesForUser(params: { id: number }): Promise<string>;
    updateRulesForUser(params: { id: number; script: string }): Promise<string>;
    testCompileRules(script: string): Promise<string>;
}

// Mock implementation - replace with actual API calls
const mockUserRulesAPI: UserRulesAPI = {
    async getRulesForUser(params: { id: number }): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Return sample script for the user
        return `-- Sample Driven script for User ${params.id}
MODULE [User ${params.id}]:
    RULESET [Personal Preferences]:
        RULE [Work Hours]: TIME(8, 0, 0) AND TIME(17, 0, 0)
        RULE [Priority Level]: 
            = IF(role == "MANAGER", "HIGH")
            = "NORMAL"
    END

    ===
    User-specific rules override
    organization and branch rules
    ===
    RULESET [Service Schedule]:
        RULE [Default]: TIME(9, 0, 0)
        RULE [Early Start]:
            = IF(early_bird == TRUE, TIME(7, 0, 0))
            = TIME(9, 0, 0)
    END
END`;
    },

    async updateRulesForUser(params: { id: number; script: string }): Promise<string> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Log for debugging - replace with proper API call
        // eslint-disable-next-line no-console
        console.log(`Saving rules for user ${params.id}:`, params.script);
        
        // Simulate successful save
        return 'User rules updated successfully';
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
        console.log('User script compiled successfully:', script);
        return 'User script compilation successful';
    }
};

export const rulesAPI = mockUserRulesAPI;