import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { FiCheck, FiX, FiInfo, FiBold, FiItalic, FiList, FiCode, FiCheckSquare, FiLink, FiImage, FiLayout, FiUploadCloud } from 'react-icons/fi';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import SlashCommandPopover from './SlashCommandPopover';
import ConfirmModal from './ConfirmModal';

const EditorToolbar = ({ editor, showAlert, closeAlert }) => {
  const fileInputRef = useRef(null);

  if (!editor) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 로딩 상태 표시
      showAlert('업로드 중', '이미지를 업로드 중입니다...', null, true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `ideas/images/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      closeAlert();
      editor.chain().focus().setImage({ src: downloadURL }).run();
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      showAlert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  const addImageFromUrl = () => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex items-center flex-wrap gap-1 border-b border-gray-100 pb-3 mb-4">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="굵게">
        <FiBold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="기울임">
        <FiItalic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="취소선">
        <span className="line-through font-bold text-[14px] leading-none px-0.5">S</span>
      </button>
      
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1.5 rounded transition-colors text-[13px] font-bold ${editor.isActive('heading', { level: 1 }) ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="제목 1">
        H1
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded transition-colors text-[13px] font-bold ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="제목 2">
        H2
      </button>
      
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="글머리 기호">
        <FiList size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded transition-colors text-[12px] font-bold leading-none ${editor.isActive('orderedList') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="번호 매기기">
        1.
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('taskList') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="할 일 목록">
        <FiCheckSquare size={16} />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="코드 블록">
        <FiCode size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded transition-colors text-[16px] font-serif font-bold leading-none ${editor.isActive('blockquote') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="인용구">
        "
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button type="button" onClick={setLink} className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'text-primary bg-primary/10' : 'text-neutral-meta hover:bg-gray-100'}`} title="링크 삽입">
        <FiLink size={16} />
      </button>
      
      <div className="relative group/img-btn">
        <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-1.5 rounded transition-colors text-neutral-meta hover:bg-gray-100 flex items-center gap-1`} title="이미지 첨부 (업로드)">
          <FiImage size={16} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <button type="button" onClick={addImageFromUrl} className={`p-1.5 rounded transition-colors text-neutral-meta hover:bg-gray-100`} title="이미지 URL로 삽입">
        <FiLink size={14} className="opacity-70" />
      </button>

      <button type="button" onClick={insertTable} className={`p-1.5 rounded transition-colors text-neutral-meta hover:bg-gray-100`} title="표 삽입">
        <FiLayout size={16} />
      </button>
    </div>
  );
};

export default function IdeaWrite({ boardId, boardTitle, initialIdea = null, onSuccess, onCancel }) {
  const [title, setTitle] = useState(initialIdea?.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Slash Command State
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverCoords, setPopoverCoords] = useState(null);

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', isLoading: false });
  
  const showAlert = (title, message, onConfirm = null, isLoading = false) => {
    setAlertConfig({ isOpen: true, title, message, isLoading });
  };
  
  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: '어떤 멋진 아이디어가 있나요? "/"를 입력하여 명령어를 실행해보세요.',
      }),
    ],
    content: initialIdea?.htmlContent || '',
    editorProps: {
      attributes: {
        class: 'w-full text-[15px] text-neutral-main min-h-[400px] border-none outline-none leading-relaxed prose max-w-none focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        if (isPopoverOpen) {
          // If popover is open, let it handle navigation, prevent editor from acting
          if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) {
            return true; 
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      // Slash Command Detection
      const { state, view } = editor;
      const { selection } = state;
      const { $head } = selection;
      const pos = $head.pos;
      const textBefore = $head.parent.textContent.slice(0, $head.parentOffset);

      if (textBefore.endsWith('/')) {
        const coords = view.coordsAtPos(pos);
        setPopoverCoords({ top: coords.top, left: coords.left });
        setIsPopoverOpen(true);
      } else {
        setIsPopoverOpen(false);
      }
    }
  });

  const handleCommandSelect = (cmd) => {
    if (!editor) return;
    
    // Delete the '/' character
    editor.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
    
    // Execute command
    if (cmd.id === 'todo') {
      editor.chain().focus().toggleTaskList().run();
    } else if (cmd.id === 'text') {
      editor.chain().focus().setParagraph().run();
    } else if (cmd.id === 'image') {
      // Create a temporary hidden input to trigger upload via popover
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `ideas/images/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const storageRef = ref(storage, fileName);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          editor.chain().focus().setImage({ src: downloadURL }).run();
        } catch (error) {
          console.error('Upload failed:', error);
          showAlert('오류', '이미지 upload에 실패했습니다.');
        }
      };
      input.click();
    } else if (cmd.id === 'jira') {
      // Placeholder for Jira integration
      showAlert('Jira 연동', 'Jira 이슈 연결 팝업 (준비 중)');
    }
    
    setIsPopoverOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!editor || editor.isEmpty) {
      setError('본문 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (initialIdea) {
        await updateDoc(doc(db, 'ideas', initialIdea.id), {
          title: title.trim(),
          content: editor.getText(),
          htmlContent: editor.getHTML(),
        });
      } else {
        await addDoc(collection(db, 'ideas'), {
          title: title.trim(),
          content: editor.getText(), // Plain text for lists
          htmlContent: editor.getHTML(), // Full HTML for details view
          author: '현재 사용자', 
          boardId: boardId,
          createdAt: serverTimestamp()
        });
      }
      
      setIsLoading(false);
      onSuccess();
    } catch (err) {
      console.error("Error creating idea:", err);
      if (import.meta.env.DEV) {
        setIsLoading(false);
        onSuccess();
      } else {
        setError('아이디어 등록 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    }
  };

  // cleanup popover on unmount
  useEffect(() => {
    return () => setIsPopoverOpen(false);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-bg-base p-8 relative">
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-main mb-2">
            {initialIdea ? '게시물 수정' : '새 게시물 등록'} <span className="text-primary text-xl">({boardTitle})</span>
          </h1>
          <p className="text-neutral-meta text-sm">해당 게시판에 팀원들에게 공유하고 싶은 내용을 자유롭게 작성해 보세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-[13px] flex items-center gap-2">
              <FiInfo size={14} /> {error}
            </div>
          )}
          
          <div className="p-6 space-y-6 flex-1 flex flex-col">
            <div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-2xl font-bold text-neutral-main border-b border-gray-100 pb-4 outline-none placeholder:text-gray-300 focus:border-primary transition-colors bg-transparent"
                autoFocus
              />
            </div>
            
            <div className="flex-1 relative cursor-text group tiptap-wrapper flex flex-col" onClick={() => editor?.commands.focus()}>
              <EditorToolbar editor={editor} showAlert={showAlert} closeAlert={closeAlert} />
              
              <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                  content: attr(data-placeholder);
                  float: left;
                  color: #D1D5DB;
                  pointer-events: none;
                  height: 0;
                }
                .ProseMirror ul[data-type="taskList"] {
                  list-style: none;
                  padding: 0;
                }
                .ProseMirror ul[data-type="taskList"] li {
                  display: flex;
                  align-items: flex-start;
                  margin-bottom: 0.5rem;
                }
                .ProseMirror ul[data-type="taskList"] li > label {
                  margin-right: 0.5rem;
                  user-select: none;
                }
                .ProseMirror ul[data-type="taskList"] li > div {
                  flex: 1;
                }
                .ProseMirror a {
                  color: #0052CC;
                  text-decoration: underline;
                  cursor: pointer;
                }
                .ProseMirror img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 4px;
                  margin: 1rem 0;
                }
                .ProseMirror table {
                  border-collapse: collapse;
                  table-layout: fixed;
                  width: 100%;
                  margin: 1rem 0;
                  overflow: hidden;
                }
                .ProseMirror table td,
                .ProseMirror table th {
                  min-width: 1em;
                  border: 1px solid #E5E7EB;
                  padding: 0.5rem;
                  vertical-align: top;
                  box-sizing: border-box;
                  position: relative;
                }
                .ProseMirror table th {
                  font-weight: bold;
                  text-align: left;
                  background-color: #F9FAFB;
                }
                .ProseMirror table .selectedCell:after {
                  z-index: 2;
                  position: absolute;
                  content: "";
                  left: 0; right: 0; top: 0; bottom: 0;
                  background: rgba(200, 200, 255, 0.4);
                  pointer-events: none;
                }
              `}</style>
              <div className="flex-1 overflow-y-auto min-h-[300px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex justify-end gap-2 mt-auto">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-5 py-2 text-neutral-meta hover:bg-gray-200 rounded-sm font-medium transition-colors text-[14px] flex items-center gap-1.5"
            >
              <FiX size={16} /> 취소
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-sm font-bold transition-colors text-[14px] flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (initialIdea ? '수정 중...' : '등록 중...') : <><FiCheck size={16} /> {initialIdea ? '수정완료' : '등록하기'}</>}
            </button>
          </div>
        </form>
      </div>

      <SlashCommandPopover 
        isOpen={isPopoverOpen}
        coords={popoverCoords}
        onSelect={handleCommandSelect}
        onClose={() => setIsPopoverOpen(false)}
      />

      <ConfirmModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="확인"
        showCancel={false}
        isLoading={alertConfig.isLoading}
        onConfirm={closeAlert}
      />
    </div>
  );
}
