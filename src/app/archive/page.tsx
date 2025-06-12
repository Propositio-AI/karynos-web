import { GridContainer, VerticalStackContainer, HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { TextBookCard } from "@/components/ui/molecules/Card"
import { SearchInputText } from "@/components/ui/atoms/Input"

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

const Archive = () => {
    return(
        <VerticalStackContainer space="2" className="mx-16 my-8">
            <HorizontalStackContainer space="2" className="mx-auto w-1/2">
                <SearchInputText className="mx-auto w-1/2" placeholder="教科書を検索"/>
            </HorizontalStackContainer>
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
        </VerticalStackContainer>
    )
}

export default Archive