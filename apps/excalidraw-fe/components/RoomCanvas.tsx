"use client"

import { useEffect, useRef, useState } from "react"
import Konva from "konva"
import { WS_URL } from "../config"
import { Canvas } from "./Canvas";

export default function RoomCanvas({roomId}:{roomId:string}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // const [token, settoken] = useState("")

  // useEffect(() => {
  //   let value
  //   // Get the value from local storage if it exists
  //   value = localStorage.getItem("token") || ""
  //   settoken(value)
  // }, [])

  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiJjZDc5ZmFmYy0wYzUwLTQ4OWYtOGIzMy05YmIyOTUxZmE0OTAiLCJpYXQiOjE3NDYwMDMwNDB9.kkwQe5sIi8oy-zkwcYb2PGGpUTSAylwJUZftRv8QP9M`)
  
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