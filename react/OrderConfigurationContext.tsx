import React, { createContext, useReducer, useContext } from 'react'
import { FormField } from './typings/FormProps'
import { CustomSessionData } from './typings/global'

const OrderConfigurationContext = createContext<State | undefined>(undefined)
const OrderConfigurationDispatchContext = createContext<Dispatch | undefined>(
  undefined
)

type State = {
  isLoading: boolean
  modal: {
    isOpen: boolean
  }
  selectedValues: CustomSessionData
  profileData: ProfileData
  formFields: FormField[]
}

type Dispatch = (action: Action) => void

type SetLoadingAction = {
  type: 'SET_LOADING'
  args: {
    isLoading: boolean
  }
}

type SetModalOpenAction = {
  type: 'SET_MODAL_OPEN'
  args: {
    isModalOpen: boolean
  }
}

type SetModalClosedAction = {
  type: 'SET_MODAL_CLOSED'
  args: {
    isModalOpen: boolean
  }
}

type Action = SetLoadingAction | SetModalOpenAction | SetModalClosedAction

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.args.isLoading,
      }
    }
    case 'SET_MODAL_OPEN': {
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: action.args.isModalOpen,
        },
      }
    }
    case 'SET_MODAL_CLOSED': {
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: action.args.isModalOpen,
        },
      }
    }
    default:
      return state
  }
}

type Props = {
  selectedValues: CustomSessionData
  profileData: ProfileData
  children: any
  formFields: FormField[]
}

type ProfileData = {
  profile: {
    email: string
  }
}

export const OrderConfigurationContextProvider = ({
  selectedValues,
  profileData,
  formFields,
  children,
}: Props) => {
  const initialState = {
    selectedValues,
    profileData,
    formFields,
    isLoading: true,
    modal: {
      isOpen: false,
    },
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <OrderConfigurationContext.Provider value={state}>
      <OrderConfigurationDispatchContext.Provider value={dispatch}>
        {children}
      </OrderConfigurationDispatchContext.Provider>
    </OrderConfigurationContext.Provider>
  )
}

export function useOrderConfigurationDispatch() {
  const context = useContext(OrderConfigurationDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useOrderConfigurationDispatch must be used within a OrderConfigurationContextProvider'
    )
  }

  return context
}

export function useOrderConfiguration() {
  const context = useContext(OrderConfigurationContext)

  if (context === undefined) {
    throw new Error(
      'useOrderConfiguration must be used within a OrderConfigurationContextProvider'
    )
  }

  return context
}
