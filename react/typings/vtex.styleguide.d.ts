declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  interface IconEditProps {
    solid?: boolean
  }

  export const Alert: ComponentType<InputProps>
  export const Input: ComponentType<InputProps>
  export const Button: ComponentType<InputProps>
  export const ButtonPlain: ComponentType<InputProps>
  export const ButtonWithIcon: ComponentType<InputProps>
  export const Checkbox: ComponentType<InputProps>
  export const Dropdown: ComponentType<InputProps>
  export const IconEdit: ComponentType<IconEditProps>
  export const Modal: ComponentType<InputProps>
  export const RadioGroup: ComponentType<InputProps>
  export const Textarea: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
