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
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
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
    this.existingShapes = await getExistingShapes(this.roomId);

    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.layer.destroyChildren(); // Better than .clear() for removing old shapes

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        const rect = new Konva.Rect({
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          fill: "green",
          stroke: "black",
          strokeWidth: 4,
        });
        this.layer.add(rect);
      } else if (shape.type === "circle") {
        const circle = new Konva.Circle({
          x: shape.centerX,
          y: shape.centerY,
          radius: shape.radius,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
        });
        this.layer.add(circle);
      }
    });

    this.stage.batchDraw(); // Forces a redraw
  }

  mouseDownHandler = () => {
    this.clicked = true;
    this.startX = this.stage.getPointerPosition()?.x ?? 0;
    this.startY = this.stage.getPointerPosition()?.y ?? 0;
  };

  mouseUpHandler = () => {
    const pos = this.stage.getPointerPosition();
    this.clicked = false;

    const width = (pos?.x ?? 0) - this.startX;
    const height = (pos?.y ?? 0) - this.startY;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
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
    if (!this.clicked || !pos) return;

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
      const radius = Math.max(width, height) / 2;
      const centerX = this.startX + radius;
      const centerY = this.startY + radius;

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
