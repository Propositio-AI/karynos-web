"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { VerticalStackContainer } from '@/components/ui/molecules/Container'
import { getDreamerDreamActionMaterials } from '@/lib/api/gen/dreamAction/dreamAction'
import { DreamerDreamActionMaterial } from '@/types/feature/dream-action/dreamAction'

const subjectColorMap: Record<string, string> = {
    '数学I': 'bg-blue-100 text-blue-800',
    '数学II': 'bg-blue-100 text-blue-800',
    '現代文': 'bg-purple-100 text-purple-800',
    '歴史総合': 'bg-yellow-100 text-yellow-800',
    '化学': 'bg-green-100 text-green-800',
    '物理': 'bg-orange-100 text-orange-800',
    '英語': 'bg-red-100 text-red-800',
}

const getSubjectColor = (subject: string) =>
    subjectColorMap[subject] ?? 'bg-slate-100 text-slate-800'

function MaterialCardSkeleton() {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-200 rounded w-24" />
                    <div className="h-5 bg-zinc-200 rounded w-4/5" />
                    <div className="h-4 bg-zinc-200 rounded w-2/3" />
                </div>
                <div className="h-4 w-4 bg-zinc-200 rounded" />
            </div>
            <div className="mt-3 h-3 bg-zinc-200 rounded w-32" />
        </div>
    )
}

function MaterialCard({ material }: { material: DreamerDreamActionMaterial }) {
    return (
        <Link href={`/dream-action/${material.id}`}>
            <div className="bg-white border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSubjectColor(material.subject)}`}>
                                {material.subject}
                            </span>
                            <span className="text-xs text-zinc-500">{material.unit}</span>
                            {!material.isRead && (
                                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    NEW
                                </span>
                            )}
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 leading-snug mb-1">
                            {material.relevanceTitle}
                        </h3>
                        <p className="text-xs text-zinc-500">
                            あなたの仮の夢: <span className="font-medium text-blue-600">{material.dreamerJob}</span> との接続
                        </p>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-zinc-400 mt-1 flex-shrink-0" />
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                    {new Date(material.distributedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })} に届きました
                </p>
            </div>
        </Link>
    )
}

export default function DreamActionListPageContent() {
    const [materials, setMaterials] = useState<DreamerDreamActionMaterial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showUnreadOnly, setShowUnreadOnly] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getDreamerDreamActionMaterials()
                setMaterials(data)
            } catch {
                setError('教材の読み込みに失敗しました。')
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [])

    const unreadCount = materials.filter((m) => !m.isRead).length
    const displayed = showUnreadOnly ? materials.filter((m) => !m.isRead) : materials

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <VerticalStackContainer space={4}>
                <div className="flex items-center gap-3 pt-4">
                    <FontAwesomeIcon icon={faBook} className="text-blue-500 text-2xl" />
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">補助教材</h1>
                        <p className="text-sm text-zinc-500">あなたの仮の夢に合わせた学習サポート教材</p>
                    </div>
                    {unreadCount > 0 && (
                        <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            未読 {unreadCount}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="unread-filter"
                        type="checkbox"
                        checked={showUnreadOnly}
                        onChange={(e) => setShowUnreadOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-500 border-zinc-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="unread-filter" className="text-sm text-slate-700 cursor-pointer">
                        未読のみ表示
                    </label>
                </div>

                {isLoading ? (
                    <VerticalStackContainer space={2}>
                        {[1, 2, 3].map((i) => <MaterialCardSkeleton key={i} />)}
                    </VerticalStackContainer>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={() => { setError(''); setIsLoading(true); getDreamerDreamActionMaterials().then(setMaterials).catch(() => setError('教材の読み込みに失敗しました。')).finally(() => setIsLoading(false)) }}
                            className="mt-2 text-sm text-blue-500 underline"
                        >
                            再試行
                        </button>
                    </div>
                ) : displayed.length === 0 ? (
                    <VerticalStackContainer space={4} className="py-12 text-center">
                        <FontAwesomeIcon icon={faBook} className="text-5xl text-zinc-300 mx-auto" />
                        <div>
                            <p className="text-slate-700 font-medium">
                                {showUnreadOnly ? '未読の教材はありません' : 'まだ教材が届いていません'}
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">
                                先生が授業資料をもとに教材を作成・配布すると、ここに表示されます
                            </p>
                        </div>
                        {!showUnreadOnly && (
                            <Link href="/job/match" className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 mx-auto">
                                仮の夢を探す
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        )}
                    </VerticalStackContainer>
                ) : (
                    <VerticalStackContainer space={2}>
                        {displayed.map((material) => (
                            <MaterialCard key={material.id} material={material} />
                        ))}
                    </VerticalStackContainer>
                )}

                {!isLoading && !error && materials.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-200">
                        <Link
                            href="/job/match"
                            className="flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-600 py-2"
                        >
                            仮の夢をもっと探してみる
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                )}
            </VerticalStackContainer>
        </div>
    )
}
