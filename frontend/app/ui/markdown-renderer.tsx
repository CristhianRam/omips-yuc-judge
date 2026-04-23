/**
 * @file frontend/app/ui/markdown-renderer.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols MarkdownRenderer
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './markdown-renderer.css';

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
