import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "../draw/game"
import Konva from "konva";
import { Stage } from "react-konva";
import { StatsFs } from "fs";

export type Tool = "circle" | "rect";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer | null>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (stageRef.current) {
     
            const g = new Game(stageRef.current, roomId, socket);

            setGame(g);
            
            return () => {
                g.destroy();
            }
        }


    }, [stageRef]);
    
    
    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <Stage className="bg-amber-100" ref={stageRef} width={window.innerWidth} height={window.innerHeight}></Stage>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
        </div>
}







