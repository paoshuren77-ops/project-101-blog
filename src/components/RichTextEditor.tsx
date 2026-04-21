import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { useEffect, useMemo, useState } from "react";
import type { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
};

type InsertImage = (url: string, alt?: string, href?: string) => void;

function RichTextEditor({ value, onChange, onUploadImage }: RichTextEditorProps) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  const toolbarConfig = useMemo<Partial<IToolbarConfig>>(
    () => ({
      excludeKeys: ["fullScreen", "uploadVideo", "insertVideo"],
    }),
    [],
  );

  const editorConfig = useMemo<Partial<IEditorConfig>>(
    () => ({
      placeholder: "输入文章正文...",
      MENU_CONF: {
        uploadImage: {
          async customUpload(file: File, insertFn: InsertImage) {
            if (!onUploadImage) {
              throw new Error("图片上传未配置。");
            }

            const url = await onUploadImage(file);
            insertFn(url, file.name, url);
          },
        },
      },
    }),
    [onUploadImage],
  );

  useEffect(() => {
    return () => {
      if (!editor) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div className="rich-editor">
      <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" className="rich-editor-toolbar" />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(currentEditor) => onChange(currentEditor.getHtml())}
        mode="default"
        className="rich-editor-body"
        style={{ minHeight: "420px" }}
      />
    </div>
  );
}

export default RichTextEditor;
