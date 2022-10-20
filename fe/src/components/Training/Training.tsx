import { ScrollBackground, Button } from 'components'
import { DOMAIN } from 'const'
import { useAppDispatch, useAppSelector } from 'hooks'
import { FC, useCallback, useState, useMemo, ChangeEvent } from 'react'
import { selectResource } from 'store/selectors'
import { unitAction } from 'store/slices'
import { secondToTime } from 'utils'

const Training: FC = () => {
  const [total, setTotal] = useState('0')

  const resource = useAppSelector(selectResource)
  const dispatch = useAppDispatch()
  const onClose = useCallback(() => {
    dispatch(unitAction.training(undefined))
  }, [dispatch])



  return <>

  </>
}

export default Training