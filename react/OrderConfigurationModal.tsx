import React, { useCallback } from 'react'
import { pathOr } from 'ramda'

import { ButtonWithIcon, IconEdit, Modal } from 'vtex.styleguide'
import {
  useOrderConfigurationDispatch,
  useOrderConfiguration,
} from './OrderConfigurationContext'

const OrderConfigurationModal = (props: { title: string; children: any }) => {
  const dispatch = useOrderConfigurationDispatch()
  const {
    modal: { isOpen },
  } = useOrderConfiguration()
  const onModalOpen = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', args: { isModalOpen: true } })
  }, [dispatch])
  const onModalClose = useCallback(() => {
    dispatch({ type: 'SET_MODAL_CLOSED', args: { isModalOpen: false } })
  }, [dispatch])

  return (
    <div className="tc">
      <div className="h-100">
        <div className="h-100 flex items-center">
          <ButtonWithIcon
            icon={<IconEdit />}
            iconPosition="right"
            variation="secondary"
            onClick={onModalOpen}
          />
        </div>

        <Modal
          centered
          isOpen={isOpen}
          onClose={onModalClose}
          title={pathOr('Order Configuration', ['title'], props)}
        >
          {props.children}
        </Modal>
      </div>
    </div>
  )
}

export default OrderConfigurationModal
