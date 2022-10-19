import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "hooks";
import { useEffect, useState } from "react";
import socket from "socket";



export default function useSocketHandler<I = any>({
  action,
  event
}: {
  action: ActionCreatorWithPayload<I>
  event: string
}) {
  const [data, setData] = useState<I | null>(null)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handler = (data: I) => {
      setData(data)
      dispatch(action(data))
    }
    socket.on(event, handler)
    return () => {
      socket.removeListener(event, handler)
    }
  }, [dispatch, action, event])
  return data
}