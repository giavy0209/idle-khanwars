import { FC, FormEvent, useCallback, useRef } from "react";

const Signup : FC = () => {
  const form = useRef<HTMLFormElement>(null)
  const handleSubmit = useCallback((e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
  },[])
  return (
    <> 
    <div className="signup">
      <form ref={form} onSubmit={handleSubmit} action="">
        <input type="text" placeholder="username" />
        <input type="text" placeholder="password" />
        <button>Login</button>
      </form>
    </div>
    </>
  )
}

export default Signup