'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { rekarelLanguage } from './rekarel-lang';

interface CodeEditorProps {
    initialValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
}

export default function CodeEditor({
    initialValue = '',
    value,
    onChange,
    name = 'code',
    placeholder = 'Paste your source code here...',
    readOnly = false,
}: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (value: string) => {
            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = value;
            }
            onChange?.(value);
        },
        [onChange]
    );

    useEffect(() => {
        if (!editorRef.current) return;

        const extensions = [
            lineNumbers(),
            rekarelLanguage,
            oneDark,
            EditorView.lineWrapping,
            EditorView.theme({
                '&': {
                    height: readOnly ? 'auto' : '350px',
                    maxHeight: readOnly ? '400px' : undefined,
                    fontSize: '14px',
                },
                '.cm-scroller': {
                    overflow: 'auto',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                },
                '.cm-content': {
                    minHeight: readOnly ? undefined : '300px',
                },
                '&.cm-focused': {
                    outline: readOnly ? 'none' : '2px solid #3b82f6',
                    outlineOffset: '-1px',
                },
            }),
            placeholder ? EditorView.contentAttributes.of({ 'aria-label': placeholder }) : [],
        ];

        if (readOnly) {
            extensions.push(EditorState.readOnly.of(true));
            extensions.push(EditorView.editable.of(false));
        } else {
            extensions.push(
                highlightActiveLine(),
                highlightActiveLineGutter(),
                history(),
                bracketMatching(),
                closeBrackets(),
                indentOnInput(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        handleChange(update.state.doc.toString());
                    }
                }),
                keymap.of([
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    indentWithTab,
                ]),
            );
        }

        const state = EditorState.create({
            doc: value ?? initialValue,
            extensions,
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className="relative">
            <div
                ref={editorRef}
                className="rounded-md overflow-hidden border border-gray-700"
            />
            {!readOnly && (
                <input
                    ref={hiddenInputRef}
                    type="hidden"
                    name={name}
                    defaultValue={initialValue}
                />
            )}
        </div>
    );
}
