import { Button, FAQ } from "components";
import { ROUTERS } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { FC, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectToken, selectWorlds } from "store/selectors";
import { login, LoginPayload, signup } from "store/slices/userSlice";
import { fetchWorlds } from "store/slices/worldSlice";

const Signup: FC = () => {
  const form = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const worlds = useAppSelector(selectWorlds)
  const token = useAppSelector(selectToken)

  useEffect(() => {
    if (token) {
      // navigate((globalState.memoLocation && globalState.memoLocation !== `/${ROUTERS.LOGIN}`) ? globalState.memoLocation : ROUTERS.HOME + '/')
    }
    dispatch(fetchWorlds())
  }, [dispatch, token, navigate])
  const handleSubmit = useCallback(() => {
    const patten = /^[A-Za-z0-9]{6,}$/
    const formData = new FormData(form.current as HTMLFormElement)
    const submitData: { [k: string]: string } = {}
    let isError = false
    for (let field of formData) {
      if (!patten.test(field[1] as string)) {
        toast('Username or password accept only a-z 0-9 and min 6 charactor')
        isError = true
        break
      }
      submitData[field[0]] = field[1] as string
    }
    if (isError) return null
    return submitData
  }, [])

  const handleSignup = useCallback(async (type: 'LOGIN' | 'SIGNUP') => {
    const submitData = handleSubmit() as unknown as LoginPayload
    if (!submitData) return
    type === 'LOGIN' ? dispatch(login(submitData)) : dispatch(signup(submitData))
  }, [handleSubmit, dispatch])
  return (
    <>
      <div className="signup">
        <form ref={form}>
          <input name="username" type="text" placeholder="username" />
          <input name="password" type="text" placeholder="password" />
          <select name="world" >
            {
              worlds.map(o => <option value={o._id} key={o._id}>{o.name} - Speed x{o.speed}</option>)
            }
          </select>
          <div className="group-button">
            <Button type="button" onClick={() => handleSignup('LOGIN')}>
              Login
            </Button>
            <Button type="button" onClick={() => handleSignup('SIGNUP')}>
              Signup
            </Button>
          </div>
          <FAQ>
            <h2>How can I signup</h2>
            <p>Just input your username and password, if your username is not existed, we will auto create new account with that username and password</p>
            <p>You can use a-z 0-9 for username and password, min 6 character</p>
            <h2>What is worlds?</h2>
            <p>We have several worlds</p>
            <p>Each of the worlds have it's own speed</p>
            <p>Currently, we have only world x1 speed and world test x100 speed</p>
            <h2>What is speed?</h2>
            <p>Your resource generate, upgrade time, training time and moving time base on their own speed and world speed</p>
            <p>Example your resource's building level 0 generate 100 per hour and world speed is 10, you will get 1000 per hour</p>
            <p>Example you need to wait 900 seconds to training 1 Catapult, world speed is 10 so you only have to wait 90 seconds</p>
            <h2>Which world should I choose?</h2>
            <p>Yah If you read this line, I think you are new player on this game. You should spend a few minute on test world to see what we have</p>
            <p>After understand this game, if you have time to manage your castle, feel free to choose x1 world</p>
            <p>Thanks for reading</p>
          </FAQ>
        </form>
      </div>
    </>
  )
}

export default Signup