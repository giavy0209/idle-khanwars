import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { EVENT_SOCKET } from "const";
import { useAppDispatch } from "hooks";
import { useEffect } from "react";
import socket from "socket";

export default function useSocketHandler<I = any>({
  action,
  event,
  callback
}: {
  action: ActionCreatorWithPayload<I>[]
  event: string
  callback?: (data: I) => any
}) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handler = (data: I) => {
      action.forEach(o => {
        dispatch(o(data))
      })
      callback?.(data)
    }
    socket.on(event, handler)
    return () => {
      socket.removeListener(event, handler)
    }
  }, [dispatch, action, event, callback])
}