"use client"
import { useEffect, useRef } from "react"
import { initDraw } from "../../../draw"

export default function canvas (){

    const canvasref = useRef<HTMLCanvasElement>(null)
    
    useEffect(()=>{
        
        if(canvasref.current){
        const canvas = canvasref.current
        initDraw(canvas)
    }
    },[canvasref])
    
    
    return <div>
        <canvas ref={canvasref} width={1500} height={800} className="bg-white"/>
    </div>
}