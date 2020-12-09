import { UISchemaType } from 'react-hook-form-jsonschema'
import { FormField } from './FormProps'

export interface BaseInputProps {
  pointer: string
  label?: string
}

export interface FormFieldGroupProps extends Omit<BaseInputProps, 'label'> {
  uiSchema?: UISchemaType
  formFields: FormField[]
  defaultValues: Record<string, string | number>
}

export enum InputTypes {
  input = 'input',
  hidden = 'hidden',
  password = 'password',
}

export interface FormRawInputProps extends BaseInputProps {
  inputType?: InputTypes
}
