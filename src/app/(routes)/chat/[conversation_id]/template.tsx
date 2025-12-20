'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // 初期状態：画面の右外側 (x: 100%)
      initial={{ x: '100%' }}
      // アニメーション後：定位置 (x: 0)
      animate={{ x: 0 }}
      // 画面から消える時：右外側に戻る (x: 100%)
      exit={{ x: '100%' }}
      // アニメーション設定：バネのような自然な動き
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white" // 全画面を覆う
    >
      {children}
    </motion.div>
  );
}