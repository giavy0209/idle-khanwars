import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "hooks";
import { useEffect, useState } from "react";
import socket from "socket";



export default function useSocketHandler<I = any>({
  action,
  event
}: {
  action: ActionCreatorWithPayload<I>[]
  event: string
}) {
  const [data, setData] = useState<I | null>(null)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handler = (data: I) => {
      console.log(data);

      setData(data)
      action.forEach(o => {
        dispatch(o(data))
      })
    }
    socket.on(event, handler)
    return () => {
      socket.removeListener(event, handler)
    }
  }, [dispatch, action, event])
  return data
}