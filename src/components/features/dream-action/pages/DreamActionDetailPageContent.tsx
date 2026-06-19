"use client";

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBook, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { VerticalStackContainer } from '@/components/ui/molecules/Container'
import {
    getDreamerDreamActionMaterials,
    markDreamActionAsRead,
} from '@/lib/api/gen/dreamAction/dreamAction'
import { DreamerDreamActionMaterial } from '@/types/feature/dream-action/dreamAction'

function DetailSkeleton() {
    return (
        <div className="p-4 max-w-2xl mx-auto animate-pulse">
            <div className="h-4 bg-zinc-200 rounded w-16 mb-6" />
            <div className="space-y-3 mb-8">
                <div className="h-3 bg-zinc-200 rounded w-24" />
                <div className="h-7 bg-zinc-200 rounded w-full" />
                <div className="h-7 bg-zinc-200 rounded w-4/5" />
            </div>
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-zinc-200 rounded w-full" />
                ))}
            </div>
        </div>
    )
}

export default function DreamActionDetailPageContent({
    params,
}: {
    params: Promise<{ material_id: string }>
}) {
    const { material_id } = use(params)
    const [material, setMaterial] = useState<DreamerDreamActionMaterial | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                const all = await getDreamerDreamActionMaterials()
                const found = all.find((m) => m.id === material_id)
                if (!found) {
                    setError('教材が見つかりませんでした。')
                    return
                }
                setMaterial(found)
                if (!found.isRead) {
                    await markDreamActionAsRead(material_id)
                }
            } catch {
                setError('教材の読み込みに失敗しました。')
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [material_id])

    if (isLoading) return <DetailSkeleton />

    if (error || !material) {
        return (
            <div className="p-4 max-w-2xl mx-auto">
                <Link href="/dream-action" className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    補助教材一覧に戻る
                </Link>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600">{error || '教材が見つかりませんでした。'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 max-w-2xl mx-auto pb-8">
            <VerticalStackContainer space={4}>
                <Link
                    href="/dream-action"
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 pt-2"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    補助教材一覧に戻る
                </Link>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {material.subject}
                    </span>
                    <span className="text-xs text-zinc-500">{material.unit}</span>
                </div>

                <div>
                    <h1 className="text-2xl font-black text-slate-800 leading-snug">
                        {material.relevanceTitle}
                    </h1>
                    <p className="mt-2 text-sm text-blue-600 font-medium">
                        あなたの仮の夢: {material.dreamerJob}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        授業の元単元: {material.sourceUnit}
                    </p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faBook} className="text-blue-500" />
                        <h2 className="text-base font-semibold text-slate-800">学習の接点</h2>
                    </div>
                    <div className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                        {material.relevanceContent}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">この補助教材について</p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            この教材はあなたの仮の夢と現在の授業の接点を示す「補助教材」です。
                            教員の授業スタイルを変えるものではありません。
                            今の学習がどう将来につながるかを考えるきっかけとして活用してください。
                        </p>
                    </div>
                </div>

                <p className="text-xs text-zinc-400 text-right">
                    {new Date(material.distributedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })} に配布
                </p>
            </VerticalStackContainer>
        </div>
    )
}
