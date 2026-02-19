import { StreamLanguage, StringStream } from '@codemirror/language';

// ReKarel Java-style language definition
// Based on the official ReKarel IDE grammar:
// https://github.com/kishtarn555/ReKarel/blob/master/codemirror/java.grammar

const rekarelKeywords = new Set([
    'class', 'program', 'import', 'void', 'define', 'int', 'bool',
    'while', 'if', 'else', 'iterate',
    'return', 'continue', 'break',
]);

const rekarelBuiltins = new Set([
    'move', 'turnleft', 'putbeeper', 'pickbeeper', 'turnoff',
    'succ', 'pred',
]);

const rekarelBoolFunctions = new Set([
    'nextToABeeper', 'notNextToABeeper',
    'frontIsClear', 'leftIsClear', 'rightIsClear',
    'frontIsBlocked', 'leftIsBlocked', 'rightIsBlocked',
    'facingNorth', 'facingSouth', 'facingEast', 'facingWest',
    'notFacingNorth', 'notFacingSouth', 'notFacingEast', 'notFacingWest',
    'anyBeepersInBeeperBag', 'noBeepersInBeeperBag',
    'iszero', 'isinfinite',
]);

const rekarelGlobals = new Set([
    'true', 'false',
    'beepersOnFloor', 'beepersInBeeperBag',
    'currentRow', 'currentColumn',
    'rekarel', 'globals',
]);

const rekarelDef = {
    startState() {
        return { inBlockComment: false };
    },

    token(stream: StringStream, state: { inBlockComment: boolean }): string | null {
        // Block comments
        if (state.inBlockComment) {
            if (stream.match('*/')) {
                state.inBlockComment = false;
                return 'blockComment';
            }
            stream.next();
            return 'blockComment';
        }

        // Skip whitespace
        if (stream.eatSpace()) return null;

        // Start of block comment
        if (stream.match('/*')) {
            state.inBlockComment = true;
            return 'blockComment';
        }

        // Line comment
        if (stream.match('//')) {
            stream.skipToEnd();
            return 'lineComment';
        }

        // Numbers
        if (stream.match(/^[0-9]+/)) {
            return 'number';
        }

        // Operators
        if (stream.match('<=') || stream.match('==') || stream.match('&&') || stream.match('||')) {
            return 'operator';
        }
        if (stream.match(/^[<>!]/)) {
            return 'operator';
        }

        // Brackets/punctuation
        if (stream.match(/^[{}()\[\];,.]/)) {
            return 'punctuation';
        }

        // Identifiers and keywords
        if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
            const word = stream.current();
            if (rekarelKeywords.has(word)) return 'keyword';
            if (rekarelBuiltins.has(word)) return 'variableName.special';
            if (rekarelBoolFunctions.has(word)) return 'function';
            if (rekarelGlobals.has(word)) return 'atom';
            return 'variableName';
        }

        // Strings (just in case)
        if (stream.match(/^"[^"]*"/)) {
            return 'string';
        }

        stream.next();
        return null;
    },
};

export const rekarelLanguage = StreamLanguage.define(rekarelDef);
