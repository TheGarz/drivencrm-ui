import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'eventemitter3';
import { useTheme } from '../../../theme/ThemeContext';
import './userWorker';
import './highlighting';
import './auto-complete';

interface ScriptEditorProps {
    script: string; // Initial script text
    onCompile: (script: string) => Promise<void> // Callback for compile action
    onSave: (script: string) => Promise<void> // Callback for save action
}

/**
 * A bit of a hack to allow the button to change
 * its label and behavior dynamically with respect
 * to the editor and server state.
 */
const eventBus = new EventEmitter();

const ScriptButton: React.FC<{
    label: string,
    enabled: boolean,
    onClick: () => void,
}> = ({ label, enabled, onClick }) => {
    const { currentTheme } = useTheme();
    
    return <button
        onClick={onClick}
        style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            marginTop: '10px',
            alignSelf: 'flex-end',
            opacity: enabled ? 1 : 0.5,
            pointerEvents: enabled ? 'auto' : 'none',
            cursor: enabled ? 'pointer' : 'default',
            transition: 'opacity 0.3s ease',
            backgroundColor: currentTheme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
        }}
    >
        {label}
    </button>;
};

const ScriptControls: React.FC<{
    eventBus: EventEmitter,
    uid: string,
    scriptEditorProps: ScriptEditorProps,
    editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>
}> = ({ eventBus, uid, scriptEditorProps, editorRef }) => {
    const { currentTheme } = useTheme();
    const [canCompile, setCanCompile] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { onCompile, onSave } = scriptEditorProps;

    // Subscribe to the 'change' event
    useEffect(() => {
        eventBus.on(`change-${uid}`, () => {
            setCanCompile(true);
            // NOTE: do not set canSave to true here;
            // only when we have a successful compile.
        });
    }, [eventBus, uid]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (target: string, error: any) => {
        let codeerror = '';
        if (error && typeof error === 'object' && error.message) {
            codeerror = `${target} Error: ${error.message}`;
        } else {
            // Handle other types of errors
            codeerror = `Unexpected ${target} Error: ${error || 'Unknown error'}`;
        }
        console.error(`Failed to ${target.toLowerCase()}!`, codeerror);
        setErrorMessage(codeerror);
    };

    const handleCompileClicked = async () => {
        try {
            await onCompile(editorRef.current?.getValue() ?? '');
            setCanCompile(false); // Disable compile button after successful compile
            setCanSave(true); // Enable save button after successful compile
            setErrorMessage(null); // Clear any previous error messages
        } catch (error) {
 handleError('Compile', error); 
}
    };

    const handleSaveClicked = async () => {
        try {
            await onSave(editorRef.current?.getValue() ?? '');
            setCanSave(false); // Disable save button after successful save
            setErrorMessage(null); // Clear any previous error messages
        } catch (error) {
 handleError('Save', error); 
}
    };

    return <>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '12px'
        }}>
            <ScriptButton
                label="Compile"
                enabled={canCompile}
                onClick={handleCompileClicked}
            />
            <ScriptButton
                label="Save"
                enabled={canSave}
                onClick={handleSaveClicked}
            />
        </div>
        <div>
            <div style={{
                color: currentTheme.primary,
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
            }}>
                Compilation Status
            </div>
            <pre style={{
                backgroundColor: '#2d2d2d',
                color: errorMessage ? '#ffd727' : '#f8f8f2',
                padding: '1rem',
                margin: '0.5em 0',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                height: '10em',
                maxHeight: '10em',
                border: `1px solid ${currentTheme.border}`
            }}>
                {errorMessage ? errorMessage : 'Success!'}
            </pre>
        </div>
    </>;
};

export const ScriptEditor: React.FC<ScriptEditorProps> = (props: ScriptEditorProps) => {
    const { currentTheme } = useTheme();
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const uidRef = useRef(uuidv4());

    // Initialize the Monaco Editor
    useEffect(() => {
        if (editorContainerRef.current) {
            editorRef.current = monaco.editor.create(editorContainerRef.current, {
                value: props.script,
                language: 'driven-script',
                theme: 'driven-theme',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 12,
            });

            // Handle content change
            editorRef.current.onDidChangeModelContent(() => {
                eventBus.emit(`change-${uidRef.current}`);
            });
        }

        // Cleanup on unmount
        return () => editorRef.current?.dispose();
    }, [props.script]);

    // Update editor content if script prop changes
    useEffect(() => {
        if (editorRef.current && editorRef.current.getValue() !== props.script) {
            editorRef.current.setValue(props.script);
        }
    }, [props.script]);

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
            ref={editorContainerRef}
            style={{
                flex: 1,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '4px',
                minHeight: '50vh',
            }}
        ></div>
        <ScriptControls
            eventBus={eventBus}
            uid={uidRef.current}
            scriptEditorProps={props}
            editorRef={editorRef}
        />
    </div>;
};