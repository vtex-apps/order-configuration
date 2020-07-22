export type FormProps = {
  // schema: string
}

export type CustomPriceSelectorProps = {
  formTitle: string
  formFields: FormField[]
  session: Session
}

export interface Session {
  loading: boolean
  refetch: () => void
  getSession: {
    public?: {
      [key: string]: {
        value: string
      }
    }
  }
}

export type FormField =
  | InputField
  | SelectField
  | CheckboxField
  | RadioGroupField

export type InputField = {
  name: string
  type?: 'string' | 'number'
  fieldType?: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox'
  label?: string
  defaultValue?: string
  required?: boolean
  format?: string
}

export type SelectField = FormField & {
  options: {
    label: string
    value: string
  }[]
}

export type RadioGroupField = SelectField

export type CheckboxField = RadioGroupField & {
  defaultValues?: string[]
}
