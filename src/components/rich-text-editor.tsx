"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Quote } from "lucide-react";
import { Button } from "./ui/button";

interface RichTextEditorProps {
  content: string;
  onChange?: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: "prose-letter min-h-[400px] outline-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border border-border-subtle rounded-xl overflow-hidden bg-surface">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border-subtle bg-background/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-accent/20 text-accent" : ""}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-accent/20 text-accent" : ""}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border-subtle mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-accent/20 text-accent" : ""}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-accent/20 text-accent" : ""}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border-subtle mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("blockquote") ? "bg-accent/20 text-accent" : ""}`}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="flex-1 cursor-text" />
    </div>
  );
}
