"use client"
import { useEffect, useRef } from "react"

export default function canvas (){

    const canvasref = useRef<HTMLCanvasElement>(null)
    
    useEffect(()=>{
        
        if(canvasref.current){
        const canvas = canvasref.current
        const ctx = canvas.getContext("2d")
        if(!ctx){
            return
        }
       
        let clicked = false
        let startX = 0;
        let startY = 0;
        canvas.addEventListener("mousedown",(e)=>{
            clicked = true;
            startX = e.clientX
            startY = e.clientY
            console.log(e.clientX)
            console.log(e.clientY)
        })
        canvas.addEventListener("mouseup",(e)=>{
            clicked = false
            console.log([e.clientX,e.clientY])
        })
        canvas.addEventListener("mousemove",(e)=>{
            if(clicked){
                const width = e.clientX - startX
                const height = e.clientY - startY
                console.log([e.clientX,e.clientY])
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.strokeRect(startX,startY,width,height)
            }
        })
    }
    },[canvasref])
    
    
    return <div>
        <canvas ref={canvasref} width={1000} height={1000} className="bg-white"/>
    </div>
}