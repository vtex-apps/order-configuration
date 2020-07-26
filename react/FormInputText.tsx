import React from 'react'

import { RawInput, HiddenInput, PasswordInput } from './components/Input'
import { FormRawInputProps, InputTypes } from './typings/InputProps'

export default function FormInput(props: FormRawInputProps) {
  const { inputType = InputTypes.input, ...rest } = props

  // eslint-disable-next-line default-case
  switch (inputType) {
    case InputTypes.input:
      return <RawInput {...rest} pointer={props.pointer} />
    case InputTypes.hidden:
      return <HiddenInput {...rest} pointer={props.pointer} />
    case InputTypes.password:
      return <PasswordInput {...rest} pointer={props.pointer} />
  }
}
