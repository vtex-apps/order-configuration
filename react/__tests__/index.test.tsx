import React from 'react'
import { render } from '@vtex/test-tools/react'
import OrderConfigurationSelector from '../OrderConfigurationSelector'

describe('CustomPriceSelector Component', () => {
  it('should render the custom price selector', () => {
    const { getByText } = render(<OrderConfigurationSelector />)

    expect(getByText(/Order Configuration/)).toBeDefined()
  })

  it('should render title passed as props', () => {
    const { getByText } = render(<OrderConfigurationSelector title="foo" />)

    expect(getByText(/foo/)).toBeDefined()
  })
})
