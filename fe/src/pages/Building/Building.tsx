import { Sub } from "layers";
import { FC } from "react";
import { useParams } from "react-router-dom";

const Building: FC = () => {
  const { buildingType } = useParams()
  
  return (
    <>
    <Sub>
      
    </Sub>
    </>
  )
}

export default Building