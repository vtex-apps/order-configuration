declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Alert: ComponentType<InputProps>
  export const Input: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>
  export const Checkbox: ComponentType<InputProps>
  export const Dropdown: ComponentType<InputProps>
  export const Modal: ComponentType<InputProps>
  export const RadioGroup: ComponentType<InputProps>
  export const Textarea: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
