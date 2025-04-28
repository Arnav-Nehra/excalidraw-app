import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

export function initDraw(canvas: HTMLCanvasElement,stage :Stage,layer:Layer,shape:string) {

    stage.off('mousedown');
    stage.off('mousemove');
    stage.off('mouseup');

    let rect: Konva.Rect | null = null;
    let circ: Konva.Circle | null = null;

    let isDrawing = false;

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
        rect = null;
        circ = null;
    });
}

