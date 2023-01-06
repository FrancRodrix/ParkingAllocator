import 'react-native'
import React from 'react'
import Detail from '../Class/Screens/Detail'
import renderer from 'react-test-renderer'
import {render, screen, fireEvent,waitFor} from '@testing-library/react-native'


const navigation = {
    navigation: jest.fn(),
        params:{
            slots:JSON.parse(4)
        },
        registrationView:true,
        modalVisible: false,
        payment:false 

  };

  const onPress = jest.fn();

test('Details snapshot',()=>{
    const snap=renderer.create(
        <Detail route={navigation} />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});

test("ParkButton", () => {
    const tree = renderer.create(<Detail route={navigation} />);
    const button = tree.root.findByProps({ testID: "parkButton" }).props;
    button.onPress();
    expect(navigation.registrationView).toBeTruthy()
  });

 
  beforeEach(()=>{
    render(<Detail  route={navigation}/>)
  })


describe('App',()=>{

    it('renders correctly', () => {
        let {container} = render(<Detail route={navigation} />)
        expect(container).toBeTruthy()
    }),

    it('test list',()=>{
        const {getByTestId}=render(<Detail  route={navigation}/>)
        const list=getByTestId('Slots')
        expect(list).toBeTruthy()
    }),
    it('test button',()=>{
        const {getByTestId}=render(<Detail  route={navigation}/>)
        const name=getByTestId('parkName')
        expect(name).toBeTruthy()
    }),
    it("ParkButton", () => {
        const tree = renderer.create(<Detail route={navigation} />);
        const button = tree.root.findByProps({ testID: "parkinglot" }).props;
        button.onPress();
        expect().toBeInstanceOf(4)
      });

      it('button is pressed', () => {

        const buttonFn = jest.fn()

        render(
      <Detail  route={navigation} modalVisibe={true}/>
        )
        expect(screen.getByTestId('modalView')).toBeVisible()
        // fireEvent.press(screen.getByTestId('modalButton'))
        // expect(buttonFn).toBeCalled()
    })

    

})











 





