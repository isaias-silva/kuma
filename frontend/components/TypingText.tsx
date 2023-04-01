import { useEffect, useState } from "react";

export default function TypingText({ text, typingDelay }: { text: string, typingDelay: number }) {

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

    return <p>{displayText}</p>;
};
