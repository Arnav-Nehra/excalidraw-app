import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { HTTP_BACKEND } from '../config';
import axios from 'axios';
import { Shape } from 'konva/lib/Shape';


export async function initDraw(canvas: HTMLCanvasElement,stage :Stage,layer:Layer,shape:string,socket:WebSocket,roomId:string) {
    
    let existingShapes : Shape[] = await getExistingShapes(roomId)
    
    stage.off('mousedown');
    stage.off('mousemove');
    stage.off('mouseup');

    let rect: Konva.Rect | null = null;
    let circ: Konva.Circle | null = null;

    let isDrawing = false;

    socket.onmessage = (event)=>{
        const message = JSON.parse(event.data);

        if(message.type == "chat"){
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            layer.clear()
        }
    }
    layer.clear();

    stage.on('mousedown', (e) => {

        isDrawing = true;
        const pos = stage.getPointerPosition();

        if (pos && shape === "rectangle") {
            rect = new Konva.Rect({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                stroke: 'white',
                strokeWidth: 2,
                fill: 'rgba(0, 0, 0, 0.5)',
                draggable: true
            });
            layer.add(rect);
        } else if (pos && shape === "circle") {
            circ = new Konva.Circle({
                x: pos.x,
                y: pos.y,
                radius: 0,
                stroke: 'white',
                strokeWidth: 2,
                fill: 'rgba(0, 0, 0, 0.5)',
                draggable: true
            });
            layer.add(circ);
        }
    });

    stage.on('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = stage.getPointerPosition();
        if (pos && shape === "rectangle" && rect) {
            const newWidth = pos.x - rect.x();
            const newHeight = pos.y - rect.y();
            rect.width(newWidth);
            rect.height(newHeight);
            layer.batchDraw();
        } else if (pos && shape === "circle" && circ) {
            const dx = pos.x - circ.x();
            const dy = pos.y - circ.y();
            const radius = Math.sqrt(dx * dx + dy * dy);
            circ.radius(radius);
            layer.batchDraw();
        }
    });

    stage.on('mouseup', () => {
        isDrawing = false;
        let diagram: Shape | null = null;

        if (shape === "rectangle" && rect) {
            diagram = rect;
        } else if (shape === "circle" && circ) {
            diagram = circ;
        } else {
            return;
        }

        existingShapes.push(diagram)

        socket.send(JSON.stringify({
            type : "chat",
            message : JSON.stringify({
                diagram
            })
        }))
        rect = null;
        circ = null;
    });
    
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}
