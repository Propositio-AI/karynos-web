import { Bold, Underline, Highlight, RedText, BlueText, YellowText, RedMarker, BlueMarker, YellowMarker} from "@/components/ui/atoms/Text"
import { InlineMath } from 'react-katex';
import React from "react"

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
        const latex = node.children.length === 1 && node.children[0]?.type === "Text"
        ? node.children[0].value
        : "";

        return React.createElement(Element, { key, math: latex });
    }

    return React.createElement(
        Element,
        { key },
        node.children.map((child, i) => renderAst(child, i))
    );
};

const renderTextBook = (contents: string, key: number = 0) => {
    const tokens = tokenize(contents)
    const node = parse(tokens)

    return renderAst(node, key)
}


export default renderTextBook;