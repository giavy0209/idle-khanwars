import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface IButton {
  onClick?(): any
  children: ReactNode,
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const Button: FC<IButton> = ({ onClick, type, children }) => {
  return (
    <>
      <button type={type || 'submit'} className="button" onClick={onClick}>
        {children}
      </button>
    </>
  )
}

export default Button