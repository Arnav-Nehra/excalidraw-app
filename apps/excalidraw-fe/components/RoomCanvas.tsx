"use client"

import { useEffect, useRef, useState } from "react"
import Konva from "konva"
import { WS_URL } from "../config"
import { Canvas } from "./Canvas";

export default function RoomCanvas({roomId}:{roomId:string}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);


  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in local storage.");
        return;
    }
    const ws = new WebSocket(`${WS_URL}?token=${token}`)

    ws.onopen = ()=>{
      setSocket(ws)
      const data = JSON.stringify({
        type : "join_room",
        roomId
      })
      ws.send(data)
    }
  },[])
  if(!socket){
    return<div className="text-white bg-green-700">
      connecting to server....
      </div>
  }
  return <div>
    <Canvas socket={socket} roomId={roomId}></Canvas>
  </div>
}