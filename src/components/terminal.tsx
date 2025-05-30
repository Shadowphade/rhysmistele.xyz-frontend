import { useEffect, useRef, useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Terminal() {
    const [terminalText, setTerminalText] = useState<string>("");
    const serverTextEvent = useRef<EventSource>(null)

    useEffect(() => {
            serverTextEvent.current = new EventSource(`${API_BASE_URL}/api/projects/terminal/startsession`)

            serverTextEvent.current.onmessage = function(event: any) {
                console.log(event.data);
                setTerminalText(event.data);
            }
    })

    return (
        <>
            {terminalText}
        </>
    )

}
