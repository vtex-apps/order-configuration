declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>
  export const ModalDialog: ComponentType<InputProps>
  export const RadioGroup: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
