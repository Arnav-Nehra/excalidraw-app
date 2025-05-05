import Konva from "konva";
import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      id?: string;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      id?: string;
    };

export class Game {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private isDrawing: boolean = false;
  private selectedShape: Konva.Shape | null = null;
  socket: WebSocket;

  constructor(stage: Stage, roomId: string, socket: WebSocket) {
    this.stage = stage;
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.stage.off("mousedown", this.mouseDownHandler);
    this.stage.off("mouseup", this.mouseUpHandler);
    this.stage.off("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: "circle" | "rect") {
    this.selectedTool = tool;
  }

  async init() {
    try {
      const shapes = await getExistingShapes(this.roomId);
      
      // Log the raw shapes for debugging
      console.log("Raw shapes from server:", JSON.stringify(shapes));
      
      // Filter out invalid shapes and ensure each has an ID
      this.existingShapes = shapes
      //@ts-ignore
        .filter(shape => {
          if (!shape || typeof shape !== 'object') return false;
          if (!shape.type) return false;
          
          // Validate required properties based on shape type
          if (shape.type === 'rect') {
            return shape.x !== undefined && shape.y !== undefined && 
                   shape.width !== undefined && shape.height !== undefined;
          } else if (shape.type === 'circle') {
            return shape.centerX !== undefined && shape.centerY !== undefined && 
                   shape.radius !== undefined;
          }
          return false;
        })
        //@ts-ignore
        .map(shape => {
          if (!shape.id) {
            shape.id = this.generateId();
          }
          return shape;
        });
      
      console.log(`Loaded ${this.existingShapes.length} valid shapes`);
      this.clearCanvas();
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type == "chat") {
          const parsedData = JSON.parse(message.message);
          
          if (parsedData.shape) {
            // New shape added
            // Check if we already have this shape (by id) to prevent duplicates
            const existingShape = this.existingShapes.find(s => 
              s.id === parsedData.shape.id
            );
            
            if (!existingShape) {
              if (!parsedData.shape.id) {
                parsedData.shape.id = this.generateId();
              }
              this.existingShapes.push(parsedData.shape);
              this.clearCanvas();
            }
          } else if (parsedData.update) {
            // Shape position updated
            const update = parsedData.update;
            const shapeToUpdate = this.existingShapes.find(s => s.id === update.id);
            
            if (shapeToUpdate) {
              if (shapeToUpdate.type === "rect") {
                shapeToUpdate.x = update.x;
                shapeToUpdate.y = update.y;
              } else if (shapeToUpdate.type === "circle") {
                shapeToUpdate.centerX = update.centerX;
                shapeToUpdate.centerY = update.centerY;
              }
              this.clearCanvas();
            }
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    
    // Add a debug handler to verify connection status
    this.socket.onopen = () => {
      console.log("WebSocket connection established");
    };
    
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.strokeWidth(4);
      this.stage.batchDraw();
      this.selectedShape = null;
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15);
  }

  clearCanvas() {
    this.layer.destroyChildren(); // Better than .clear() for removing old shapes

    console.log("Rendering shapes:", JSON.stringify(this.existingShapes));
    
    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        // Ensure we have valid position and dimensions
        const x = typeof shape.x === 'number' ? shape.x : 0;
        const y = typeof shape.y === 'number' ? shape.y : 0;
        const width = typeof shape.width === 'number' && shape.width > 0 ? shape.width : 50;
        const height = typeof shape.height === 'number' && shape.height > 0 ? shape.height : 50;
        
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: "green",
          stroke: "black",
          strokeWidth: 4,
          draggable: true,
          id: shape.id || this.generateId(),
        });

        // Add drag event handlers
        this.addDragHandlers(rect, shape);
        this.addSelectionHandlers(rect);
        
        // Save ID back to our shape data
        shape.id = rect.id();
        this.layer.add(rect);
        console.log(`Added rect at (${x}, ${y}) with size ${width}x${height}`);
      } else if (shape.type === "circle") {
        // Ensure we have valid position and radius
        const centerX = typeof shape.centerX === 'number' ? shape.centerX : 0;
        const centerY = typeof shape.centerY === 'number' ? shape.centerY : 0;
        const radius = typeof shape.radius === 'number' && shape.radius > 0 ? shape.radius : 25;
        
        const circle = new Konva.Circle({
          x: centerX,
          y: centerY,
          radius: radius,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
          draggable: true,
          id: shape.id || this.generateId(),
        });

        // Add drag event handlers
        this.addDragHandlers(circle, shape);
        this.addSelectionHandlers(circle);
        
        // Save ID back to our shape data
        shape.id = circle.id();
        this.layer.add(circle);
        console.log(`Added circle at (${centerX}, ${centerY}) with radius ${radius}`);
      }
    });

    this.stage.batchDraw(); // Forces a redraw
  }

  addDragHandlers(shape: Konva.Shape, shapeData: Shape) {
    shape.on('dragstart', () => {
      // Increase stroke width to show it's being dragged
      shape.strokeWidth(6);
      this.stage.batchDraw();
    });

    shape.on('dragend', () => {
      // Update the shape data with new position
      if (shapeData.type === "rect") {
        shapeData.x = shape.x();
        shapeData.y = shape.y();
      } else if (shapeData.type === "circle") {
        shapeData.centerX = shape.x();
        shapeData.centerY = shape.y();
      }

      // Reset stroke width
      shape.strokeWidth(4);
      
      // Send the update to other clients
      if (this.socket.readyState === WebSocket.OPEN) {
        const updateData = shapeData.type === "rect" 
          ? { id: shape.id(), x: shape.x(), y: shape.y() }
          : { id: shape.id(), centerX: shape.x(), centerY: shape.y() };
        
        this.socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({ update: updateData }),
            roomId: this.roomId,
          })
        );
      }

      this.stage.batchDraw();
    });
  }

  addSelectionHandlers(shape: Konva.Shape) {
    shape.on('click', (e) => {
      // Prevent the mousedown event from triggering shape creation
      e.cancelBubble = true;
      
      // Clear previous selection
      this.clearSelection();
      
      // Highlight the selected shape
      shape.strokeWidth(6);
      this.selectedShape = shape;
      this.stage.batchDraw();
    });
  }

  mouseDownHandler = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if we clicked on the empty canvas or on a shape
    const clickedOnEmpty = e.target === this.stage;
    
    if (clickedOnEmpty) {
      // Clear any selection
      this.clearSelection();
      
      // Start drawing a new shape
      this.isDrawing = true;
      this.clicked = true;
      this.startX = this.stage.getPointerPosition()?.x ?? 0;
      this.startY = this.stage.getPointerPosition()?.y ?? 0;
    }
  };

  mouseUpHandler = () => {
    if (!this.isDrawing) return;
    
    const pos = this.stage.getPointerPosition();
    this.clicked = false;
    this.isDrawing = false;

    const width = (pos?.x ?? 0) - this.startX;
    const height = (pos?.y ?? 0) - this.startY;

    // Only create shape if it has some size
    if (Math.abs(width) < 5 && Math.abs(height) < 5) return;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    const id = this.generateId();

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height: Math.abs(height),
        width: Math.abs(width),
        id,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + (width > 0 ? radius : -radius),
        centerY: this.startY + (height > 0 ? radius : -radius),
        id,
      };
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.clearCanvas();

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId,
        })
      );
    } else {
      console.error(
        "WebSocket is not open. Current state:",
        this.socket.readyState
      );
    }
  };

  mouseMoveHandler = () => {
    const pos = this.stage.getPointerPosition();
    if (!this.clicked || !this.isDrawing || !pos) return;

    const width = pos.x - this.startX;
    const height = pos.y - this.startY;

    this.clearCanvas(); // Redraw base shapes first

    if (this.selectedTool === "rect") {
      const rect = new Konva.Rect({
        x: this.startX,
        y: this.startY,
        width,
        height,
        fill: "green",
        stroke: "black",
        strokeWidth: 4,
      });
      this.layer.add(rect);
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + (width > 0 ? radius : -radius);
      const centerY = this.startY + (height > 0 ? radius : -radius);

      const circle = new Konva.Circle({
        x: centerX,
        y: centerY,
        radius,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
      });
      this.layer.add(circle);
    }

    this.stage.batchDraw(); // Redraw preview shape
  };

  initMouseHandlers() {
    this.stage.on("mousedown", this.mouseDownHandler);
    this.stage.on("mouseup", this.mouseUpHandler);
    this.stage.on("mousemove", this.mouseMoveHandler);
  }
}