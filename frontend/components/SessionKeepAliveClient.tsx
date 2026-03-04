"use client";
import { useSessionKeepAlive } from "../hooks/useSessionKeepAlive";

export function SessionKeepAliveClient() {
  useSessionKeepAlive();
  return null;
}
