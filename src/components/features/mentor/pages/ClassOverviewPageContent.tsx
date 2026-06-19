"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBolt, faChartBar } from "@fortawesome/free-solid-svg-icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { SideBar } from "@/components/ui/templates/SideBar";
import { VerticalStackContainer, HorizontalStackContainer, GridContainer } from "@/components/ui/molecules/Container";
import { DashboardCard } from "@/components/ui/molecules/Card";
import { ClassStats } from "@/types/feature/mentor/class";
import { getClassStats } from "@/lib/api/gen/mentor/classes";
import { getClasses } from "@/lib/api/gen/mentor/classes";
import { ClassItem } from "@/types/feature/mentor/class";

const STATUS_LABELS: Record<string, string> = {
    distributed: "配布済み",
    generated: "生成済み（未配布）",
    pending: "未生成",
};

const STATUS_COLORS: Record<string, string> = {
    distributed: "#10b981",
    generated: "#3b82f6",
    pending: "#e2e8f0",
};

export default function ClassOverviewPageContent() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [stats, setStats] = useState<ClassStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        getClasses()
            .then((cls) => {
                setClasses(cls);
                if (cls.length > 0) setSelectedClassId(cls[0]?.id ?? "");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        setStatsLoading(true);
        getClassStats(selectedClassId)
            .then(setStats)
            .finally(() => setStatsLoading(false));
    }, [selectedClassId]);

    const dreamActionChartData = stats
        ? [
              { name: "配布済み", value: stats.dreamActionStatus.distributed, color: STATUS_COLORS.distributed },
              {
                  name: "生成済み",
                  value: stats.dreamActionStatus.generated - stats.dreamActionStatus.distributed,
                  color: STATUS_COLORS.generated,
              },
              {
                  name: "未生成",
                  value: stats.dreamActionStatus.pending,
                  color: STATUS_COLORS.pending,
              },
          ]
        : [];

    return (
        <SideBar>
            <VerticalStackContainer space={8}>
                <HorizontalStackContainer className="justify-between flex-wrap gap-4">
                    <h1>クラス全体管理</h1>
                    <select
                        className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        disabled={loading}
                    >
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </HorizontalStackContainer>

                {loading ? (
                    <GridContainer minWidth={200}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-28" />
                        ))}
                    </GridContainer>
                ) : statsLoading || !stats ? (
                    <div className="space-y-4">
                        <GridContainer minWidth={200}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-28" />
                            ))}
                        </GridContainer>
                        <div className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse h-64" />
                    </div>
                ) : (
                    <>
                        <GridContainer minWidth={180}>
                            <DashboardCard title="総生徒数" icon={faUsers}>
                                <h1 className="text-4xl font-black">{stats.dreamActionStatus.total}<span className="text-base font-normal text-zinc-500 ml-1">名</span></h1>
                            </DashboardCard>
                            <DashboardCard title="Dream Action 配布数" icon={faBolt}>
                                <h1 className="text-4xl font-black text-emerald-600">
                                    {stats.dreamActionStatus.distributed}
                                    <span className="text-base font-normal text-zinc-500 ml-1">件</span>
                                </h1>
                            </DashboardCard>
                            <DashboardCard title="平均マッチスコア" icon={faChartBar}>
                                <h1 className="text-4xl font-black text-blue-600">
                                    {stats.avgMatchScore}
                                    <span className="text-base font-normal text-zinc-500 ml-1">点</span>
                                </h1>
                            </DashboardCard>
                        </GridContainer>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white border border-zinc-200 rounded-lg p-6">
                                <h3 className="font-bold text-slate-800 mb-4">人気の職種カテゴリ Top5</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={stats.topJobCategories}
                                        layout="vertical"
                                        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                                    >
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                            width={120}
                                        />
                                        <Tooltip
                                            formatter={(v) => [`${v}名`, "人数"]}
                                        />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                            {stats.topJobCategories.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white border border-zinc-200 rounded-lg p-6">
                                <h3 className="font-bold text-slate-800 mb-4">Dream Action 配布状況</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={dreamActionChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                            labelLine={false}
                                        >
                                            {dreamActionChartData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => [`${v}名`, ""]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-lg p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Dream Action 進捗サマリ</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "配布済み", value: stats.dreamActionStatus.distributed, color: "bg-emerald-500" },
                                    { label: "生成済み（未配布）", value: stats.dreamActionStatus.generated - stats.dreamActionStatus.distributed, color: "bg-blue-500" },
                                    { label: "未生成", value: stats.dreamActionStatus.pending, color: "bg-zinc-200" },
                                ].map(({ label, value, color }) => (
                                    <div key={label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-600">{label}</span>
                                            <span className="font-semibold text-slate-800">{value}名</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-2">
                                            <div
                                                className={`${color} h-2 rounded-full transition-all`}
                                                style={{ width: `${(value / stats.dreamActionStatus.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </VerticalStackContainer>
        </SideBar>
    );
}
