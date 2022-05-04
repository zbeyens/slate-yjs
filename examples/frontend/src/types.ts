import { CursorEditor, YHistoryEditor, YjsEditor } from '@slate-yjs/core';
import { Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HocuspocusProvider } from '@hocuspocus/provider';

export type CursorData = {
  name: string;
  color: string;
};

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  text: string;
};

export type Paragraph = {
  type: 'paragraph';
  children: Descendant[];
};

export type InlineCode = {
  type: 'inline-code';
  children: Descendant[];
};

export type HeadingOne = {
  type: 'heading-one';
  children: Descendant[];
};

export type HeadingTwo = {
  type: 'heading-two';
  children: Descendant[];
};

export type BlockQuote = {
  type: 'block-quote';
  children: Descendant[];
};

export type CustomElement =
  | Paragraph
  | InlineCode
  | HeadingOne
  | HeadingTwo
  | BlockQuote;

export interface CollaborationEditor {
  yjs: {
    isOnline?: boolean;
    isSynced?: boolean;
    start: () => void;
    stop: () => void;
    provider: HocuspocusProvider;
  };
}

export type CustomEditor = ReactEditor &
  YjsEditor &
  YHistoryEditor &
  CursorEditor<CursorData> &
  CollaborationEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
