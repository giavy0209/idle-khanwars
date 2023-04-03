import { ResourceData } from 'interfaces'
import { FC, memo } from 'react'


const Resources: FC<{ resources?: ResourceData }> = function ({
  resources
}) {
  console.log(resources);
  return <>

  </>
}

export default memo(Resources)