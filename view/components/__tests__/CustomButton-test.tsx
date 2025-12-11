import { fireEvent, render } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('Button Component', () => {
    test('Render Custom Component With Props', () => {
        const { getByText } = render(<CustomButton title='test' handlePress={() => {}}/>)
        getByText('test')
    });

    test('Render Custom Component With Props', () => {
        const { getByText } = render(<CustomButton title='testinggg' handlePress={() => {}}/>)
        getByText('testinggg')
    });

    test('Make sure text inside button is correct', () => {
        const { getByText } = render(<CustomButton title='testinggg' handlePress={() => {}}/>)
        const element = getByText('testinggg')
        expect(element.children[0]).toBe('testinggg')
    });

    test('Make sure onPress gets triggered by button press', () => {
        const onPressMock = jest.fn()

        const { getByText } = render(<CustomButton title='testinggg' handlePress={onPressMock}/>)
        fireEvent.press(getByText('testinggg'))

        expect(onPressMock).toHaveBeenCalled()
        expect(onPressMock).toHaveBeenCalledTimes(1)
    })
})

