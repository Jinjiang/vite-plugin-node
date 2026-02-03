import { render, screen } from '@testing-library/react'
import { mount } from '@vue/test-utils'
import { FooReact, FooVue } from '../src'

describe('Foo Component', () => {
  describe('React Version', () => {
    it('renders message prop', () => {
      render(<FooReact message="Hello React" />)
      expect(screen.getByText('Hello React')).toBeInTheDocument()
    })

    it('renders with default empty message', () => {
      const { container } = render(<FooReact />)
      expect(container.querySelector('h1')).toBeInTheDocument()
    })

    it('updates when message prop changes', () => {
      const { rerender } = render(<FooReact message="Initial" />)
      expect(screen.getByText('Initial')).toBeInTheDocument()
      
      rerender(<FooReact message="Updated" />)
      expect(screen.getByText('Updated')).toBeInTheDocument()
    })
  })

  describe('Vue Version', () => {
    it('renders message prop', () => {
      const wrapper = mount(FooVue, {
        props: {
          message: 'Hello Vue'
        }
      })
      expect(wrapper.text()).toBe('Hello Vue')
    })

    it('renders with default empty message', () => {
      const wrapper = mount(FooVue)
      expect(wrapper.find('h1').exists()).toBe(true)
    })

    it('updates when message prop changes', async () => {
      const wrapper = mount(FooVue, {
        props: {
          message: 'Initial'
        }
      })
      expect(wrapper.text()).toBe('Initial')
      
      await wrapper.setProps({ message: 'Updated' })
      expect(wrapper.text()).toBe('Updated')
    })
  })
})
