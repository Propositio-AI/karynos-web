import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
};

export const ChatHeader: React.FC<Props> = ({ title }) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white border-b border-zinc-200 flex items-center px-4 z-20">
      <button 
        onClick={() => router.back()} 
        className="mr-3 p-1 rounded-full hover:bg-zinc-100 transition-colors"
        aria-label="戻る"
      >
        <ArrowLeft className="w-6 h-6 text-slate-900" />
      </button>
      <h1 className="text-lg font-bold text-slate-900 truncate">
        {title}
      </h1>
    </header>
  );
};