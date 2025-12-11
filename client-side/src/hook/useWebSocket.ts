// src/hook/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface WebSocketHookProps {
    onMessage: (message: any) => void;
    topic: string; // e.g., "/topic/admin/bookings" or "/topic/user/4/bookings"
    enabled?: boolean;
}

const useWebSocket = ({ onMessage, topic, enabled = true }: WebSocketHookProps) => {
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Tạo WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (str) => {
                console.log('[STOMP Debug]:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            console.log('✅ WebSocket Connected. Subscribing to:', topic);
            
            // Subscribe to topic
            stompClient.subscribe(topic, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('📩 Received WebSocket message:', data);
                    onMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('❌ STOMP Error:', frame);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        // Cleanup on unmount
        return () => {
            if (stompClientRef.current) {
                console.log('🔌 Disconnecting WebSocket...');
                stompClientRef.current.deactivate();
            }
        };
    }, [topic, enabled, onMessage]);

    return null;
};

export default useWebSocket;