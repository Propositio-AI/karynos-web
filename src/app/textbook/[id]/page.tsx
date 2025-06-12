import { GridContainer, VerticalStackContainer } from "@/components/ui/molecules/Container"
import { PageTitle, SectionTitle, TextContents} from "@/components/ui/atoms/Text"
import { BaseColumnCard } from "@/components/ui/molecules/Card"

const TextBookPage = () => {
    return(
        <GridContainer minWidth={400}>
            <VerticalStackContainer space="2">
                <PageTitle number={1} title="微分入門"/>
                <SectionTitle number="A" title="はじめに"/>
                <TextContents text="
                    私たちが日常で目にするさまざまな現象――例えば気温の変化、車のスピード、株価の上下など――は、時間とともに「変化する量」として表されます。これらの変化を正確に捉え、予測したり分析したりするためには、「どれくらい変わっているのか」ということを数量的に表現する必要があります。そのための強力な数学的道具こそが「微分」です。
                    この章では、微分の定義から始まり、それがどのような考え方に基づいているのかを確認します。そして、定理や例題を通じて実際に使いこなす方法を学び、さらに歴史的な背景にも触れることで、微分という考え方がどのように生まれ、発展してきたのかを理解していきます。
                "/>
                <SectionTitle number="B" title="微分とは"/>
                <BaseColumnCard type="definition" title="微分">
                    <TextContents text="
                        微分とは、関数の各点における変化の割合（傾き）を求める演算です。関数 f(x) の x に関する微分は f'(x) または df/dx と表記します。
                    "/>
                </BaseColumnCard>
                <TextContents text="
                    微分の意味を図で考える。例えば、関数のグラフを想像してみてください。曲線のある一点における傾きを考えるとき、その点の周囲でどのように値が変化しているかを調べることが必要です。これを数式で表したものが「導関数（微分係数）」です。微分は単に数値を計算するだけでなく、関数の動きを読み解くための「言語」とも言えるのです。
                "/>
            </VerticalStackContainer>
            <VerticalStackContainer space="2">
                <SectionTitle number="C" title="平均値の定理"/>
                <BaseColumnCard type="theorem" title="平均値の定理">
                    <TextContents text="
                        区間[a,b]で連続、(a,b)で微分可能な関数f(x)について

                        f(b)−f(a)b−a=f′(c)

                        なるcが、aとbの間に存在する。

                        f(x) の x に関する微分は f'(x) または df/dx と表記します。
                    "/>
                </BaseColumnCard>
                <TextContents text="
                    微分の記号は、単なる記述のための道具ではありません。たとえばライプニッツの dx/dy という記号は、関数の変化を分数のように扱えるという直感的な理解を促し、のちの数学の発展に大きく貢献しました。このように、数学の記号体系そのものが私たちの思考の枠組みに影響を与えているのです。
                "/>
                <TextContents text="
                    この定理は、「ある瞬間の変化」が「全体の平均的な変化」と一致する瞬間が必ず存在する、ということを保証しています。これは単なる数学の理論にとどまらず、物理や経済学、統計などさまざまな分野で応用されている基本原理のひとつです。平均値の定理を理解することは、関数のふるまいを予測する第一歩となります。
                "/>
                <BaseColumnCard type="column" title="数学の歴史">
                    <TextContents text="
                        微積分学は17世紀にニュートンとライプニッツによって独立に発見されました。両者の発見の優先権をめぐる論争は数学史上有名です。ニュートンは「流率法」、ライプニッツは現在も使われている微分記号 dx/dy を考案しました。
                    "/>
                </BaseColumnCard>
                <SectionTitle number="D" title="例題"/>
                <BaseColumnCard type="example" title="微分する">
                    <TextContents text="
                        次の関数を xxx について微分せよ。f(x)=3x2+2x−5f
                    "/>
                    <TextContents text="
                        解答：f′(x)=dxd​(3x2)+dxd​(2x)+dxd​(−5)=6x+2
                    "/>
                </BaseColumnCard>
            </VerticalStackContainer>
        </GridContainer>
    )
}

export default TextBookPage