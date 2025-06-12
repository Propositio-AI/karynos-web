"use client"

import { FaBook } from "react-icons/fa6";
import { IoTime, IoChatbox } from "react-icons/io5";

import { PageContainer, VerticalStackContainer, HorizontalStackContainer, GridContainer } from "@/components/ui/molecules/Container"
import { IconButton } from "@/components/ui/atoms/Button"
import { DashboardCard, TextBookCard } from "@/components/ui/molecules/Card";
import { StudyActivity } from "@/components/ui/templates/Dashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import { PieChart, Pie, Cell } from "recharts"

const sampleTextBookData = [
    {
        "title": "二次関数の基礎",
        "date": "2025/06/03",
        "description": "二次関数の基礎とグラフの書き方について学びます",
        "percent": 20,
        "favorite": false
    },
    {
        "title": "平方完成の応用",
        "date": "2025/06/05",
        "description": "平方完成を使ったグラフの頂点の求め方や変化の様子を理解します",
        "percent": 40,
        "favorite": false
    },
    {
        "title": "二次関数と判別式",
        "date": "2025/06/07",
        "description": "判別式を使ってグラフの交点や解の個数を考察します",
        "percent": 30,
        "favorite": false
    },
    {
        "title": "最大・最小の応用問題",
        "date": "2025/06/09",
        "description": "文章題の中で最大・最小を扱う問題にチャレンジします",
        "percent": 10,
        "favorite": false
    },
    {
        "title": "グラフの平行移動と変形",
        "date": "2025/06/11",
        "description": "グラフを左右・上下に移動させる操作や変形の仕組みを学習します",
        "percent": 60,
        "favorite": true
    },
    {
        "title": "実力チェックテスト",
        "date": "2025/06/13",
        "description": "これまでの二次関数の内容を総合的に確認する実力テストです",
        "percent": 0,
        "favorite": false
    }
]

const data = [
  {
    month: '1月',
    time: 20,
  },
  {
    month: '2月',
    time: 21,
  },
  {
    month: '3月',
    time: 24,
  },
  {
    month: '4月',
    time: 24,
  },
  {
    month: '5月',
    time: 25,
  },
  {
    month: '6月',
    time: 25,
  },
  {
    month: '7月',
    time: 24,
  },
  {
    month: '8月',
    time: 22,
  },
  {
    month: '9月',
    time: 23,
  },
  {
    month: '10月',
    time: 24,
  },
  {
    month: '11月',
    time: 26,
  },
  {
    month: '12月',
    time: 25,
  },
];

const activity = [
    [0.2, 0.7, 0.4, 0.9, 0.1, 0.3, 0.6],
    [0.5, 0.3, 0.8, 0.2, 0.6, 0.4, 0.7],
    [0.9, 0.1, 0.5, 0.6, 0.2, 0.8, 0.3],
    [0.4, 0.7, 0.2, 0.5, 0.9, 0.6, 0.1],
];

const samplePieData =[
    { name: "数学", value: 25, key: "math", color: "#60a5fa"},
    { name: "英語", value: 20, key: "english", color: "#52cf80" },
    { name: "理科", value: 15, key: "science", color: "#a855f7" },
    { name: "社会", value: 10, key: "social", color: "#f97316" },
    { name: "国語", value: 8, key: "japanese", color: "#ef4444" },
    { name: "プログラミング", value: 22, key: "programming", color: "#6b7280" },
]

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-medium text-sm"
        >
        {`${(percent * 100).toFixed(1)}%`}
        </text>
    )
}


// 円グラフの合計値を計算
const total = samplePieData.reduce((sum, entry) => sum + entry.value, 0)

const Dashboard = () => {
    return(
        <div className="mx-32">
            <PageContainer className="p-16 text-start bg-gray-900 text-white rounded-lg">
                <HorizontalStackContainer space="1">
                    <VerticalStackContainer className="w-full" space="8">
                        <h2>こんにちは、小林さん</h2>
                        <h3>今日も学習を続けましょう。今週のストロークは7日間です。</h3>
                    </VerticalStackContainer>
                    <IconButton color="white" icon={<FaBook />}>
                        <h4>教科書を生成する</h4>
                    </IconButton>
                </HorizontalStackContainer>
            </PageContainer>    
            
            <GridContainer minWidth={200}>
                <DashboardCard title="総学習時間" value="12時間30分" icon={<IoTime size={"100%"}/>} timeChange="+２時間15分"/>
                <DashboardCard title="教科書数" value="12冊" icon={<FaBook size={"100%"}/>} timeChange="+3冊"/>
                <DashboardCard title="質問回数" value="42回" icon={<IoChatbox size={"100%"}/>} timeChange="+10回"/>
            </GridContainer>

            <GridContainer minWidth={500}>
                <VerticalStackContainer space="8" className="p-8 shadow-xl rounded-xl h-128 w-full">
                    <h3>学習時間の推移</h3>
                    <ResponsiveContainer height={"90%"}>
                        <AreaChart
                            data={data}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={['auto', 'auto']}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="time" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </VerticalStackContainer>
                <VerticalStackContainer space="8" className="w-full p-8 shadow-xl rounded-xl h-128">
                    <h3>学習時間</h3>
                    <GridContainer minWidth={200} className="w-full h-3/4 items-center">
                        <ResponsiveContainer>
                            <PieChart>
                                <Tooltip
                                    formatter={(value, name) => [`${value} 時間`, name]}
                                />
                                <Pie
                                    data={samplePieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={"70%"}
                                    outerRadius={"100%"}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    labelLine={false}
                                >
                                {samplePieData.map((subject, index) => (
                                    <Cell key={index} fill={subject.color} />
                                ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <GridContainer minWidth={60} className="h-20">
                        {
                            samplePieData.map((subject, index) => (
                                    <HorizontalStackContainer space="2">
                                        <div className="w-4 h-2" style={{backgroundColor: subject.color}}></div>
                                        <h4>{subject.name}</h4>
                                    </HorizontalStackContainer>
                                ))
                            }
                        </GridContainer>
                    </GridContainer>
                </VerticalStackContainer>

                <div className="p-8 shadow-xl rounded-xl">
                    <VerticalStackContainer space="4">
                        <div>
                            <h3>学習アクティビティ</h3>
                            <small className="text-gray-400">過去30日間の学習アクティビティ</small>
                        </div>
                        <StudyActivity activity={activity}/>
                    </VerticalStackContainer>
                </div>
                <div className="p-8 shadow-xl rounded-xl">
                    <h3>達成したバッジ</h3>
                    <small className="text-gray-400">過去30日間の学習アクティビティ</small>
                </div>
            </GridContainer>

            <PageContainer className="text-start">
                <h3>最近の教科書</h3>
                <GridContainer minWidth={350}>
                    {sampleTextBookData.map((item, index) => (
                        <TextBookCard 
                            key={index}
                            title={item.title}
                            description={item.description}
                            date={item.date}
                            percent={item.percent}
                            favorite={item.favorite}
                        />
                    ))}
                </GridContainer>
            </PageContainer>
        </div>
    )   
}

export default Dashboard