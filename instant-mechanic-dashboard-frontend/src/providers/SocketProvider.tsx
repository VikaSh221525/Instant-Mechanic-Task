"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { getSocket, SOCKET_EVENTS } from "@/lib/socket";
import type { BookingUpdatedPayload } from "@/types/booking";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  recentEvents: BookingUpdatedPayload[];
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  recentEvents: [],
});

const MAX_RECENT_EVENTS = 20;

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [recentEvents, setRecentEvents] = useState<BookingUpdatedPayload[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const addEvent = useCallback((event: BookingUpdatedPayload) => {
    setRecentEvents((prev) => [event, ...prev].slice(0, MAX_RECENT_EVENTS));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onBookingUpdated(payload: BookingUpdatedPayload) {
      addEvent(payload);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }

    function onBookingCreated() {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }

    function onStatsChanged() {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SOCKET_EVENTS.BOOKING_UPDATED, onBookingUpdated);
    socket.on(SOCKET_EVENTS.BOOKING_CREATED, onBookingCreated);
    socket.on(SOCKET_EVENTS.DASHBOARD_STATS_CHANGED, onStatsChanged);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SOCKET_EVENTS.BOOKING_UPDATED, onBookingUpdated);
      socket.off(SOCKET_EVENTS.BOOKING_CREATED, onBookingCreated);
      socket.off(SOCKET_EVENTS.DASHBOARD_STATS_CHANGED, onStatsChanged);
    };
  }, [queryClient, addEvent]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, recentEvents }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
