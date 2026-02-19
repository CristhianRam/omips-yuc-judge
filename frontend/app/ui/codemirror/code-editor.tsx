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
    onChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
}

export default function CodeEditor({
    initialValue = '',
    onChange,
    name = 'code',
    placeholder = 'Paste your source code here...',
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

        const state = EditorState.create({
            doc: initialValue,
            extensions: [
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                history(),
                bracketMatching(),
                closeBrackets(),
                indentOnInput(),
                rekarelLanguage,
                oneDark,
                EditorView.lineWrapping,
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
                EditorView.theme({
                    '&': {
                        height: '350px',
                        fontSize: '14px',
                    },
                    '.cm-scroller': {
                        overflow: 'auto',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    },
                    '.cm-content': {
                        minHeight: '300px',
                    },
                    '&.cm-focused': {
                        outline: '2px solid #3b82f6',
                        outlineOffset: '-1px',
                    },
                }),
                placeholder ? EditorView.contentAttributes.of({ 'aria-label': placeholder }) : [],
            ],
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
    }, []);

    return (
        <div className="relative">
            <div
                ref={editorRef}
                className="rounded-md overflow-hidden border border-gray-700"
            />
            <input
                ref={hiddenInputRef}
                type="hidden"
                name={name}
                defaultValue={initialValue}
            />
        </div>
    );
}
