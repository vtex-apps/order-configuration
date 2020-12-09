import React, { createContext, useReducer, useContext, FC } from 'react'
import { FormField } from './typings/FormProps'
import { OrderConfiguration } from './typings/global'

const OrderConfigurationContext = createContext<State | undefined>(undefined)
const OrderConfigurationDispatchContext = createContext<Dispatch | undefined>(
  undefined
)

interface State {
  isLoading: boolean
  modal: {
    isOpen: boolean
  }
  selectedValues: OrderConfiguration
  formFields: FormField[]
}

type Dispatch = (action: Action) => void

interface SetLoadingAction {
  type: 'SET_LOADING'
  args: {
    isLoading: boolean
  }
}

interface SetModalOpenAction {
  type: 'SET_MODAL_OPEN'
  args: {
    isModalOpen: boolean
  }
}

interface SetModalClosedAction {
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

interface Props {
  selectedValues: OrderConfiguration
  formFields: FormField[]
}

export const OrderConfigurationContextProvider: FC<Props> = ({
  selectedValues,
  formFields,
  children,
}) => {
  const initialState = {
    selectedValues,
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
