import Link from "next/link";
import { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';

export default function TypingText({ text, typingDelay, link }: { text: string, typingDelay: number, link?: string | null }) {

    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        const animateTyping = () => {
            setDisplayText(text.substring(0, displayText.length + 1));

            if (displayText.length < text.length) {
                timer = setTimeout(animateTyping, typingDelay);
            }
        };

        timer = setTimeout(animateTyping, typingDelay);

        return () => clearTimeout(timer);
    }, [displayText, text, typingDelay]);


    return link == null ? <p> {displayText}</p> : <p>{displayText} <Link href={link}>click here </Link></p>
};
