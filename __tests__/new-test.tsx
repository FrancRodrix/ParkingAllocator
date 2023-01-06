import '@testing-library/jest-native/extend-expect';

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import Detail from '../Park';

const navigation = {
  navigation: jest.fn(),
  params: {
    slots: JSON.parse(4),
  },
  registrationView: true,

  props: {
    modalVisible: false,
    payment: false,
  },
};

describe('Parking', () => {
  it('renders correctly', () => {
    let {container} = render(<Detail route={navigation} />);
    expect(container).toBeTruthy();
  });
  it('button is pressed', () => {
    const buttonFn = jest.fn();

    render(<Detail handleAddToParking={() => buttonFn()} route={navigation} />);
    fireEvent.press(screen.getByTestId('ParkButton'));
  }),
    it('check Flatlisst', () => {
      render(<Detail route={navigation} />);
      expect(screen.getByTestId('list')).toBeVisible();
    }),
    it('check Flatlisst', () => {
      render(<Detail route={navigation} />);
      expect(screen.getByTestId('list')).toHaveProp('data');
    }),

    it('button is pressed', () => {
      const buttonFn = jest.fn();

      const {getAllByTestId} = render(
        <Detail onPress={() => buttonFn()} route={navigation} />,
      );
      const showMore = getAllByTestId('ParkingSlot')[0];
      fireEvent.press(showMore);
      expect(getAllByTestId('ParkingSlot')).toBeTruthy();
    }),

    // it('check Flatlisst', () => {
    //   const { getAllByA11yState} = render(
    //     <Detail route={navigation} />,
    //   );
    //   const modalButton = getAllByA11yState('modalVisible');
    //   expect(getAllByA11yState('modalVisible')).toBeTruthy();
    // }),

    it('check button', () => {
        const { getAllByA11yState ,getByTestId} = render(
          <Detail route={navigation} />,
        );
        const modalButton = getByTestId('modal');
        const button=screen.getByTestId('Close');

      
      })
  



















    it('check Flatlisst', () => {
      const {getByText, getByTestId, getByPlaceholderText} = render(
        <Detail route={navigation} />,
      );
      const clickButton = getByText('PARK');
      fireEvent.press(clickButton);
      fireEvent.press(getByTestId('RegModal'));
      const textInput = getByPlaceholderText('Vehicle no');
      fireEvent.changeText(textInput);
      expect(textInput).toBeTruthy();
    });


    it('check Flatlisst', () => {
        const {getByText, getByTestId, getByPlaceholderText} = render(
          <Detail route={navigation} />,
        );
        const clickButton = getByText('PARK');
        fireEvent.press(clickButton);
        fireEvent.press(getByTestId('RegModal'));
        const button=getByTestId('allocate')
        handleAddToParking = jest.fn();
        generateNumberPlate=jest.fn()
        render(<Detail  handleAddToParking={() => generateNumberPlate()} route={navigation} />);
        fireEvent.press(button);      
        expect(button).toBeTruthy();
      });




});
