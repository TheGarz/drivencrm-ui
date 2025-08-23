import * as monaco from 'monaco-editor';

monaco.languages.registerCompletionItemProvider('driven-script', {
    provideCompletionItems: (_model, _position) => {
        const suggestions = [
            {
                label: 'MODULE',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'MODULE [Module Name]:\n\t-- add rulesets\nEND',
                // range: model.getWordUntilPosition(position),
                documentation: 'Define a new module',
            },
            {
                label: 'RULESET',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'RULESET [Ruleset Name]:\n\t-- add rules\nEND',
                // range: model.getWordUntilPosition(position),
                documentation: 'Define a new ruleset inside a module',
            },
            {
                label: 'RULE',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'RULE [Rule Name]:\n\t= value\n',
                // range: model.getWordUntilPosition(position),
                documentation: 'Define a new rule inside a ruleset',
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { suggestions } as any;
    },
});