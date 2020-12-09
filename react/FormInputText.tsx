import React from 'react'

import { RawInput, HiddenInput, PasswordInput } from './components/Input'
import { FormRawInputProps, InputTypes } from './typings/InputProps'

export default function FormInput(props: FormRawInputProps) {
  const { inputType = InputTypes.input, ...rest } = props

  const INPUT_TYPES = {
    [InputTypes.input]: <RawInput {...rest} pointer={props.pointer} />,
    [InputTypes.hidden]: <HiddenInput {...rest} pointer={props.pointer} />,
    [InputTypes.password]: <PasswordInput {...rest} pointer={props.pointer} />,
  }

  return INPUT_TYPES[inputType]
}
