import * as monaco from 'monaco-editor';

// Register the custom language
monaco.languages.register({ id: 'driven-script' });

// Define tokenization rules for the custom language
monaco.languages.setMonarchTokensProvider('driven-script', {
    // operators: [
    //     '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    //     '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    //     '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    //     '%=', '<<=', '>>=', '>>>='
    // ],

    // // we include these common regular expressions
    // symbols:  /[=><!~?:&|+\-*\/\^%]+/,

    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
        root: [
            [/===/, { token: 'comment', next: '@multiLineComment' }],
            [/--.*$/, 'comment'],
            [/\b[Mm][Oo][Dd][Uu][Ll][Ee]\b/, { token: 'keyword', next: '@module' }],
            [/\s/, 'text'], // Whitespace
            [/./, 'invalid'], // Invalid if anything else is found at the top-level
        ],
        multiLineComment: [
            // Match the closing '===' for multi-line comments
            [/===/, { token: 'comment', next: '@pop' }],
            // Match everything inside the multi-line comment
            [/./, 'comment'],
        ],
        // Context for processing inside a module
        module: [
            [/===/, { token: 'comment', next: '@multiLineComment' }],
            [/--.*$/, 'comment'],
            [/\b[Rr][Uu][Ll][Ee][Ss][Ee][Tt]\b/, { token: 'keyword', next: '@ruleset' }],
            [/\b[Ee][Nn][Dd]\b/, { token: 'keyword', next: '@pop' }], // End module
            [/\[.*?\]/, 'identifier'], // Identifier (e.g., name of the module)
            [/./, 'text'], // Other module-level content
        ],
        // Context for processing inside a ruleset
        ruleset: [
            [/===/, { token: 'comment', next: '@multiLineComment' }],
            [/--.*$/, 'comment'],
            [/\b[Rr][Uu][Ll][Ee]\b/, { token: 'keyword', next: '@rule' }],
            [/\b[Ee][Nn][Dd]\b/, { token: 'keyword', next: '@pop' }], // End ruleset
            [/\[.*?\]/, 'identifier'], // Identifier (e.g., name of the ruleset)
            [/./, 'text'], // Other ruleset-level content
        ],
        // Context for processing inside a rule
        rule: [
            [/===/, { token: 'comment', next: '@multiLineComment' }],
            [/--.*$/, 'comment'],
            [/\b[Ee][Nn][Dd]\b/, { token: 'keyword', next: '@pop' }], // End rule (though not expected)
            [/\[.*?\]/, 'identifier'], // Identifier (e.g., name of the rule)
            // Rule body content
            [/=/, { token: 'operator', next: '@ruleExpression' }],
            [/./, 'text'], // Other rule-level content
        ],
        // Context for processing rule expressions
        ruleExpression: [
            [/===/, { token: 'comment', next: '@multiLineComment' }],
            [/--.*$/, 'comment'],
            // Keywords for functions and constants
            [/\b(?:TRUE|FALSE|TIME|IF|ELSE|AND|OR|NOT|NULL|DEFINED|UNDEFINED)\b/, 'keyword.control'],
            // Operators
            [/[=<>!&|+*/%-]/, 'operator'],
            [/[(){}[\],;:]/, 'delimiter'],
            // Literals
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
            [/"/, 'string', '@string'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string
            [/'/, 'string', '@stringAPO'],
            [/\d*\.\d+([eE][+-]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            // Identifiers
            [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
            [/\s/, 'text'], // Whitespace
            [/./, 'invalid'], // Invalid characters
        ],
        // String handling
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],
        stringAPO: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],
    },
});

// Define a custom theme
monaco.editor.defineTheme('driven-theme', {
    base: 'vs-dark', // Can also be 'vs-light' or 'hc-black'
    inherit: true, // Inherit styles from the base theme
    rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'C586C0', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'D4D4D4' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'string.escape', foreground: 'D7BA7D' },
        { token: 'string.escape.invalid', foreground: 'FF0000' },
        { token: 'string.invalid', foreground: 'FF0000' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'number.float', foreground: 'B5CEA8' },
        { token: 'number.hex', foreground: 'B5CEA8' },
        { token: 'invalid', foreground: 'FF0000', background: 'FFCCCC' },
    ],
    colors: {
        'editor.foreground': '#D4D4D4',
        'editor.background': '#1E1E1E',
        'editorCursor.foreground': '#AEAFAD',
        'editor.lineHighlightBackground': '#0000FF20',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41'
    }
});