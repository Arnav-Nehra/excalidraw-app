"use client"
import { useEffect, useRef, useState } from "react"
import { initDraw } from "../../../draw"
import Konva from "konva"




export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState("rectangle"); // Track selected shape
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  useEffect(() => {
    if (canvasRef.current && !stageRef.current && !layerRef.current) {
      const canvas = canvasRef.current;
      const stage = new Konva.Stage({
        container: canvas.parentElement as HTMLDivElement, // Ensure the parent is a div
        width: canvas.width,
        height: canvas.height,
      });
      const layer = new Konva.Layer();
      stage.add(layer);

      stageRef.current = stage;
      layerRef.current = layer;

      // Initialize drawing logic with default shape
      initDraw(canvas, stage, layer, selectedShape);
    }
  }, []); // Only run once to initialize stage and layer

  useEffect(() => {
    if (stageRef.current && layerRef.current) {
      // Update drawing logic when shape changes
      initDraw(canvasRef.current!, stageRef.current, layerRef.current, selectedShape);
    }
  }, [selectedShape]); // Re-run only when selectedShape changes

  return (
    <div className="relative">
      <div className="flex bg-gray-800 text-white p-4 fixed top-0 left-0 w-full z-10">
          <button
            className={`px-4 py-2 rounded ${selectedShape === "rectangle" ? "bg-blue-500" : "bg-gray-500"}`}
            onClick={() => setSelectedShape("rectangle")}
          >
            Rectangle
          </button>
          <button
            className={`px-4 py-2 rounded ${selectedShape === "circle" ? "bg-blue-500" : "bg-gray-500"}`}
            onClick={() => setSelectedShape("circle")}
          >
            Circle
          </button>
        </div>
      <div className="mt-16"> {/* Add margin to avoid overlap with navbar */}
        <canvas ref={canvasRef} width={1000} height={1000} className="bg-white"></canvas>
      </div>
    </div>
  );
}