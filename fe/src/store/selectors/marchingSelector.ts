import { RootState } from "store";

export const selectMarching = (state: RootState) => state.marchingState.marchings
export const selectMarchingsByCoordinates = (
  {
    start: { x: fromX, y: fromY },
    end: { x: toX, y: toY },
  }: {
    start: { x: number, y: number }
    end: { x: number, y: number }
  }
) => {
  return (state: RootState) => {
    const marchings = [...state.marchingState.marchings]
    return marchings.filter(({
      from,
      coordinates
    }) => {
      return (
        from.coordinate.x >= fromX &&
        from.coordinate.y >= fromY &&
        from.coordinate.x <= toX &&
        from.coordinate.y <= toY
      ) ||
        (
          coordinates.x >= fromX &&
          coordinates.y >= fromY &&
          coordinates.x <= toX &&
          coordinates.y <= toY
        )
    })
  }

}
export const selectMarchingDetail = (state: RootState) => state.marchingState.detail
