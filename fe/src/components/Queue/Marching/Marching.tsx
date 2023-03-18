import { IMarching } from 'interfaces'
import { FC } from 'react'
const Marching: FC<{ marching: IMarching }> = ({ marching }) => {
  return (
    <div className="marching">
      <table>
        <thead>
          <th>Start At</th>
          <th>From</th>
          <th>To</th>
          <th>Arrive At</th>
        </thead>
      </table>
    </div>
  )
}

export default Marching