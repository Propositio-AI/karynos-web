import { HorizontalStackContainer } from "@/components/ui/molecules/Container"
import { PageTitle, SectionTitle } from "@/components/ui/atoms/Text"
import { BaseColumnCard } from "@/components/ui/molecules/Card"
import React from "react"
import { InlineMath } from 'react-katex';

import { Bold, Underline, Highlight, RedText, BlueText, YellowText, RedMarker, BlueMarker, YellowMarker} from "@/components/ui/atoms/Text"

type Token = 
    | {type: "TAG_OPEN"; name: string}
    | {type: "TAG_CLOSE"; name: string}
    | {type: "TEXT"; value: string};

type Node = 
    | {type: "Element", name: string, children: Node[]}
    | {type: "Text", value: string};

const tokenize = (input: string): Token[] => {
    const regex = /<\/?[a-z_]+>|[^<>]+/gi;
    const tokens: Token[] = [];
    
    for(const match of input.matchAll(regex)){
        const token = match[0];
        const trimmed = token.replace(/^[ \t\r]+|[ \t\r]+$/g, '');

        if (!trimmed) continue;

        
        if (trimmed.startsWith("</")) {
        tokens.push({ type: "TAG_CLOSE", name: trimmed.slice(2, -1) });
        } else if (trimmed.startsWith("<")) {
        tokens.push({ type: "TAG_OPEN", name: trimmed.slice(1, -1) });
        } else {
        tokens.push({ type: "TEXT", value: token }); // 空白も含めてそのまま
        }
    }

    return tokens;
}

const parse = (tokens: Token[]):Node => {
    const root: Node = { type: "Element", name: "root", children: [] };
    const stack: Node[] = [root];

    for (const token of tokens) {
        const current = stack[stack.length - 1];

        if (token.type === "TAG_OPEN") {
            const node: Node = { type: "Element", name: token.name, children: [] };
            (current as any).children.push(node);
            stack.push(node);
        } else if (token.type === "TAG_CLOSE") {
            stack.pop();
        } else if (token.type === "TEXT") {
            const node: Node = { type: "Text", value: token.value };
            (current as any).children.push(node);
        }
    }

    return root
}

const renderTextBook = (contents: string, key: number = 0) => {
    const tokens = tokenize(contents)
    const node = parse(tokens)

    console.log(node)

    return renderAst(node, key)
}

const nodeSelector = (node_name: string): any => {
    switch (node_name){
        case "root":
            return React.Fragment

        case "math":
            return InlineMath;

        case "bold":
            return Bold;

        case "underline":
            return Underline;

        case "highlight":
            return Highlight;
        
        case "text_red":
            return RedText;
        
        case "text_blue":
            return BlueText;
        
        case "text_yellow":
            return YellowText;

        case "marker_red":
            return RedMarker;

        case "marker_blue":
            return BlueMarker;

        case "marker_yellow":
            return YellowMarker;

        default:
            return React.Fragment
    }
}

const renderAst = (node: Node, key: number = 0): React.ReactNode => {
    if (node.type === "Text") {
        const paragraphs = node.value.split("\n");

        console.log(paragraphs)

        return paragraphs.flatMap((paragraph, i) => {
            if(i == paragraphs.length - 1){
                return [paragraph]
            }else{
                return [paragraph, <br key={`br-${i}`} />]
            }
        });
    }

    const Element = nodeSelector(node.name)
    
    if (node.name === "math") {
        // mathノードは子にTextノード一つだけを想定し、そのvalueをmathプロップで渡す
        const latex = node.children.length === 1 && node.children[0]?.type === "Text"
        ? node.children[0].value
        : "";

        return React.createElement(Element, { key, math: latex });
    }

    // それ以外は子ノードを再帰的に描画
    return React.createElement(
        Element,
        { key },
        node.children.map((child, i) => renderAst(child, i))
    );
};


const TextBookPage = () => {
    const textbook_data = {
        "page_title": "積分基礎",
        "sections":[
            {
                "section_title": "導入",
                "parts":[
                    {
                        "category": "Normal",
                        "data":{
                            "text": "<bold>積分：変化を積み重ねて全体像を捉える</bold>\n\n数学の世界には、物事の変化の瞬間を捉える「微分」という強力なツールがあります。それに対し、<text_blue>「積分」</text_blue>は、その細かな変化を一つ一つ丁寧に積み重ねて、全体の量を求める学問です。微分と積分は互いに逆の操作であり、これらは合わせて「微積分学」という大きな学問体系を形成しています。",
                            "vision_url":[]
                            }
                    },
                    {
                        "category":"Definition",
                        "data":{
                            "title":"積分の定義",
                            "text":"積分には大きく分けて<text_blue>「不定積分」</text_blue>と<text_blue>「定積分」</text_blue>の2種類があります。\n\n<bold>不定積分</bold>\n不定積分は、<text_blue>微分の逆の計算</text_blue>です。ある関数 <math>f(x)</math> に対して、微分すると <math>f(x)</math> になるような関数 <math>F(x)</math> を求める操作を指します。この <math>F(x)</math> を<text_blue>原始関数</text_blue>と呼びます。例えば、<math>x^2</math>を微分すると<math>2x</math>になるので、<math>2x</math>の原始関数の一つは<math>x^2</math>です。しかし、<math>x^2+1</math>や<math>x^2-5</math>など、定数を加えても微分すると<math>2x</math>になります。このため、不定積分では<marker_red>積分定数<math>C</math>を必ずつける</marker_red>必要があります。\n<math>F'(x) = f(x)</math> のとき、<math>\\int f(x) dx = F(x) + C</math>\n\n<bold>定積分</bold>\n定積分は、関数のグラフとx軸、そして特定の区間で囲まれた部分の<text_blue>面積</text_blue>を求める計算です。これは、非常に細い長方形の面積を無数に足し合わせるという考え方（リーマン和）に基づいています。定積分は具体的な数値を求める計算であり、<marker_blue>積分区間</marker_blue>（<math>[a, b]</math>）を指定して計算します。\n<highlight>関数<math>f(x)</math>のグラフとx軸、<math>x=a</math>、<math>x=b</math>で囲まれた面積<math>S</math>は <math>S = \\int_{a}^{b} f(x) dx</math> で表されます。</highlight>",
                            "vision_url":["https://example.com/integration_definition.png"]
                        }
                    },
                    {
                        "category":"Normal",
                        "data":{
                            "text":"積分を学ぶことで、曲線で囲まれた図形の面積や、複雑な形状の物体の体積、さらには物理現象における移動距離や仕事量など、様々な量を正確に計算できるようになります。一見すると難しそうですが、基本的な考え方を理解すれば、世界をより深く知るための強力な武器となります。",
                            "vision_url":[]
                        }
                    }
                ]
            },
            {
                "section_title":"積分の基本",
                "parts":[
                    {
                        "category":"Formula",
                        "data":{
                            "title":"積分の基本公式",
                            "text":"微分公式を逆にたどることで、様々な関数の積分公式が導かれます。まずは最も基本的な公式を覚えましょう。（<math>C</math>は積分定数）\n\n<bold>べき関数の積分</bold>\n<highlight><math>\\int x^n dx = \\frac{1}{n+1}x^{n+1} + C</math></highlight>\n<marker_red><text_red>ただし、<math>n \\neq -1</math> の場合に限ります。</text_red></marker_red>\n<math>n=-1</math>の場合は次のようになります。\n<math>\\int \\frac{1}{x} dx = \\ln|x| + C</math>\n\n<bold>定数の積分</bold>\n<math>\\int k dx = kx + C</math>\n\n<bold>三角関数の積分</bold>\n<math>\\int \\sin x dx = -\\cos x + C</math>\n<math>\\int \\cos x dx = \\sin x + C</math>\n\n<bold>指数関数の積分</bold>\n<math>\\int e^x dx = e^x + C</math>",
                            "vision_url":[]
                        }
                    },
                    {
                        "category":"Normal",
                        "data":{
                            "text":"<bold>積分の線形性</bold>\n積分には、計算を簡単にするための便利な性質があります。関数 <math>f(x)</math>, <math>g(x)</math> と定数 <math>k</math> について、次の関係が成り立ちます。\n\n1. <marker_blue>和・差の積分は、積分の和・差に分解できる</marker_blue>\n<math>\\int \\{f(x) \\pm g(x)\\} dx = \\int f(x) dx \\pm \\int g(x) dx</math>\n\n2. <marker_blue>定数倍は積分の外に出せる</marker_blue>\n<math>\\int k f(x) dx = k \\int f(x) dx</math>\n\nこれらの性質により、複雑な関数でも項ごとに分けて積分することができます。",
                            "vision_url":[]
                        }
                    },
                    {
                        "category":"Theorem",
                        "data":{
                            "title":"偶関数と奇関数の積分",
                            "text":"<math>[-a, a]</math> のように、原点に対して対称な区間での定積分を計算する場合、関数の対称性を利用すると計算を大幅に簡略化できます。\n\n<bold>偶関数</bold>\n<text_blue>偶関数</text_blue>とは、<math>f(-x) = f(x)</math> を満たす、<marker_blue>y軸に対して対称なグラフ</marker_blue>を持つ関数です（例：<math>x^2</math>, <math>\\cos x</math>）。\n偶関数の場合、<math>[-a, 0]</math> の面積と <math>[0, a]</math> の面積は等しくなります。\n<highlight><math>\\int_{-a}^{a} f(x) dx = 2 \\int_{0}^{a} f(x) dx</math></highlight>\n\n<bold>奇関数</bold>\n<text_blue>奇関数</text_blue>とは、<math>g(-x) = -g(x)</math> を満たす、<marker_blue>原点に対して対称なグラフ</marker_blue>を持つ関数です（例：<math>x</math>, <math>x^3</math>, <math>\\sin x</math>）。\n奇関数の場合、<math>[-a, 0]</math> の面積と <math>[0, a]</math> の面積は絶対値が等しく符号が逆になるため、互いに打ち消し合います。\n<highlight><math>\\int_{-a}^{a} g(x) dx = 0</math></highlight>\n<marker_red>この性質を知っているだけで、複雑な計算をせずに答えが<math>0</math>だと即座にわかる場合があります。</marker_red>",
                            "vision_url":["https://example.com/even_odd_integrals.png",
                                        "https://example.com/symmetry_integrals.png"]
                        }
                    }
                ]
            },
            {
                "section_title":"積分の利用",
                "parts":[
                    {
                        "category":"Column",
                        "data":{
                            "title":"日常生活での積分の応用",
                            "text":"積分は机上の空論ではなく、私たちの生活の様々な場面で活用されています。\n\n<bold>・自動車の走行距離</bold>\n自動車のスピードメーターは刻一刻と速度<math>v(t)</math>を示しますが、ある時間（例えば30分間）にどれだけの距離を進んだかを知るには、この速度を時間で積分する必要があります。走行距離は<math>\\int_{0}^{30} v(t) dt</math>で計算できます。\n\n<bold>・医療技術（CTスキャン）</bold>\nCTスキャンは、人体の断面画像を何枚も撮影し、それらをコンピュータ上で統合して3Dの立体像を構築します。この「断面を重ね合わせて全体（立体）を復元する」というプロセスは、まさに積分の考えそのものです。\n\n<bold>・天気予報</bold>\n気象予報では、風速や気温、気圧などの膨大な観測データを基に、未来の気象状況を予測します。このとき、微小な大気の状態変化を時間的に積み重ねて（積分して）数時間後や数日後の天気をシミュレーションしています。",
                            "vision_url":[]
                        }
                    },
                    {
                        "category":"ExampleQuestion",
                        "data":{
                            "title":"不定積分の計算",
                            "question":"次の不定積分を計算しなさい。\n<math>\\int (3x^2 + 4x - 5) dx</math>",
                            "explanation":"この問題は、積分の線形性を利用して、式を項ごとに分解して考えます。\n\n<bold>Step 1: 各項に分解する</bold>\nまず、和と差の形になっている積分を3つの積分に分けます。\n<math>\\int (3x^2 + 4x - 5) dx = \\int 3x^2 dx + \\int 4x dx - \\int 5 dx</math>\n\n<bold>Step 2: 定数を外に出す</bold>\n次に、各項の係数（定数）を積分の外に出します。\n<math> = 3\\int x^2 dx + 4\\int x^1 dx - 5\\int x^0 dx</math>\n\n<bold>Step 3: 基本公式を適用する</bold>\nここで、べき関数の積分公式 <math>\\int x^n dx = \\frac{1}{n+1}x^{n+1} + C</math> を使って、それぞれの項を積分します。\n<math>\\int x^2 dx = \\frac{1}{2+1}x^{2+1} = \\frac{1}{3}x^3</math>\n<math>\\int x^1 dx = \\frac{1}{1+1}x^{1+1} = \\frac{1}{2}x^2</math>\n<math>\\int x^0 dx = \\frac{1}{0+1}x^{0+1} = x</math>\n\n<bold>Step 4: 結果をまとめる</bold>\n最後に、Step 2で外に出した係数を掛けて、結果をまとめます。複数の積分定数が出てきますが、それらはすべてまとめて一つの積分定数 <math>C</math> として表します。\n<math>3(\\frac{1}{3}x^3) + 4(\\frac{1}{2}x^2) - 5(x) + C</math>\n<math>= x^3 + 2x^2 - 5x + C</math>\n\n<marker_red><text_red>不定積分では、最後に積分定数 <math>C</math> を書き忘れないように注意しましょう。</text_red></marker_red>",
                            "answer":"<math>x^3 + 2x^2 - 5x + C</math> （<math>C</math>は積分定数）",
                            "vision_url":[]
                        }
                    }
                ]
            },
            {
                "section_title":"まとめ",
                "parts":[
                    {
                        "Summary":{
                            "text":"<bold>まとめ：積分で広がる数学の世界</bold>\n\nこの単元では、積分の基本的な概念と計算方法について学びました。\n\n・積分は<text_blue>微分の逆演算</text_blue>であり、<text_blue>不定積分</text_blue>と<text_blue>定積分</text_blue>がある。\n・不定積分は<text_blue>原始関数</text_blue>を求める計算で、<text_red>積分定数<math>C</math></text_red>が必要。\n・定積分は<text_blue>面積</text_blue>などを求める計算で、具体的な数値が求まる。\n・偶関数・奇関数の性質を使うと、<marker_blue>定積分の計算が楽になる</marker_blue>ことがある。\n\n積分は、単なる計算技術にとどまらず、物理学、工学、経済学など、様々な分野で現象を記述し、未来を予測するための普遍的な言語です。\n<highlight>まずは基本公式をしっかりとマスターし、様々な問題に挑戦してみましょう。</highlight>",
                            "vision_url":[]
                        }
                    }
                ]
            }
        ],
        "resource":[],
        "query":"積分についての教科書を作成してください．"
    }

    return(
        <div className="m-3 overflow-y-hidden">
            <PageTitle number={1} title={textbook_data["page_title"]} className="h-[3vh]"/>
            <HorizontalStackContainer space="4" className="!items-start overflow-x-scroll h-[90vh]">
                {textbook_data["sections"].map((section_data, sectionIdx) => (
                    <div key={sectionIdx} className="h-full text-md py-5">
                        <div className="h-full w-screen">
                            <SectionTitle number={String.fromCharCode(65 + sectionIdx)} title={section_data["section_title"]}/>
                            {section_data.parts && section_data.parts.map((part, partIdx) => {
                                if (typeof part === "object" && part !== null) {
                                    if ("category" in part && "data" in part) {
                                        switch (part.category) {
                                            case "Normal":
                                                return renderTextBook(part.data.text ?? "")
                                            case "Definition":
                                                return (
                                                    <BaseColumnCard key={partIdx} type="definition" title={part.data.title}>
                                                        {renderTextBook(part.data.text ?? "")}
                                                    </BaseColumnCard>
                                                )
                                            case "Formula":
                                                return (
                                                    <BaseColumnCard key={partIdx} type="formula" title={part.data.title}>
                                                        {renderTextBook(part.data.text ?? "")}
                                                    </BaseColumnCard>
                                                )
                                            case "Theorem":
                                                return (
                                                    <BaseColumnCard key={partIdx} type="theorem" title={part.data.title}>
                                                        {renderTextBook(part.data.text ?? "")}
                                                    </BaseColumnCard>
                                                )
                                            case "Column":
                                                return (
                                                    <BaseColumnCard key={partIdx} type="column" title={part.data.title}>
                                                        {renderTextBook(part.data.text ?? "")}
                                                    </BaseColumnCard>
                                                )
                                            case "ExampleQuestion": {
                                                const q = (part.data as any).question ?? "";
                                                const e = (part.data as any).explanation ?? "";
                                                const a = (part.data as any).answer ?? "";
                                                return (
                                                    <BaseColumnCard key={partIdx} type="example" title={part.data.title}>
                                                        {q && renderTextBook(q)}<br/>
                                                        {e && renderTextBook(e)}<br/>
                                                        {a && renderTextBook(a)}
                                                    </BaseColumnCard>
                                                )
                                            }
                                            default:
                                                return null
                                        }
                                    } else if ("Summary" in part && part.Summary) {
                                        return (
                                            <BaseColumnCard key={partIdx} type="column" title="まとめ">
                                                {renderTextBook(part.Summary.text ?? "")}
                                            </BaseColumnCard>
                                        )
                                    }
                                }
                                return null
                            })}
                        </div>
                    </div>
                ))}
            </HorizontalStackContainer>
        </div>
    )
}

export default TextBookPage