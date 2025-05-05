import { HTTP_BACKEND } from "../config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        const messages = res.data.messages || [];
        
        console.log(`Received ${messages.length} messages from server for room ${roomId}`);

        // Filter out messages that don't contain shape data
        const shapes = messages
            .map((x: {message: string}) => {
                try {
                    const messageData = JSON.parse(x.message);
                    
                    // Check for either new shape creation or position update
                    if (messageData.shape) {
                        console.log("Found shape data:", messageData.shape);
                        return messageData.shape;
                    } else if (messageData.update) {
                        // Handle updates as a separate case for debugging
                        console.log("Found shape update:", messageData.update);
                        return null; // We'll handle updates separately
                    }
                    return null;
                } catch (e) {
                    console.error("Failed to parse message:", e);
                    return null;
                }
            })
            //@ts-ignore
            .filter(shape => shape !== null);

        console.log(`Extracted ${shapes.length} shapes from messages`);
        
        // Apply any position updates
        const updates = messages
            .map((x: {message: string}) => {
                try {
                    const messageData = JSON.parse(x.message);
                    return messageData.update || null;
                } catch (e) {
                    return null;
                }
            })
            //@ts-ignore
            .filter(update => update !== null);
            
        // Apply updates to the shapes (latest updates overwrite earlier ones)
        //@ts-ignore
        updates.forEach(update => {
            //@ts-ignore
            const shapeToUpdate = shapes.find(s => s.id === update.id);
            if (shapeToUpdate) {
                if (shapeToUpdate.type === "rect") {
                    shapeToUpdate.x = update.x;
                    shapeToUpdate.y = update.y;
                } else if (shapeToUpdate.type === "circle") {
                    shapeToUpdate.centerX = update.centerX;
                    shapeToUpdate.centerY = update.centerY;
                }
                console.log(`Updated shape ${update.id} position`);
            }
        });

        return shapes;
    } catch (error) {
        console.error("Error fetching existing shapes:", error);
        return [];
    }
}