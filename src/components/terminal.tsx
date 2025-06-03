import { useEffect, useRef, useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Terminal() {
//     const [terminalText, setTerminalText] = useState<string>("");
    const [terminalTextList, setTerminalTextList] = useState<string[]>([]);
    const termEnd = useRef<HTMLDivElement>(null);
    const [ws, setWs] = useState<WebSocket>();

    useEffect(() => {
        if(ws != undefined) {return}
        const websocket = new WebSocket(`${API_BASE_URL}/api/projects/terminal/startsession`)
        websocket.onopen = () => {
            console.log("Websocket Connected")
        }
        websocket.onmessage = (event: any) => {
            const message = (event.data);
            console.log(message);

            setTerminalTextList((prevText) => [...prevText, message]);
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'auto'
            })
        }
        websocket.onclose = () => {
            console.log("Console Closed")
        }
        websocket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
        setWs(websocket);

        return () => {
            websocket.close();
        }

    }, [])

    const scrollToBottom = () => {
        termEnd.current?.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(() => {
        scrollToBottom()
    }, [terminalTextList]);

    return (
        <div>
            {terminalTextList && (terminalTextList.map((text: string) =>
                <div>{text}</div>
            ))}
            <div ref={termEnd}/>
        </div>
    )

}
