import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const mockOnClickComplete = jest.fn()
  const mockOnClickDelete = jest.fn() 
  const todo = {
    text: 'Component testing is done with react-testing-library',
    done: true
  }


  render(
    <Todo
      todo={todo}
      onClickDelete={mockOnClickDelete}
      onClickComplete={mockOnClickComplete}
    />
  )

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})