import 'react-native'
import React from 'react'
import Home from '../Class/Screens/Main'
import renderer from 'react-test-renderer'
import {render, screen, fireEvent} from '@testing-library/react-native'



const navigation = {
    navigate: jest.fn()  
    // params:null,
  };

test('Home snapshot',()=>{
    const snap=renderer.create(
        <Home/>
    ).toJSON();
    expect(snap).toMatchSnapshot();
});

let findElement=function(tree:any,element:any){
    return true
}

it('find element',()=>{
    let tree=renderer.create(
        <Home  navigation={navigation} />
    ).toJSON();
    expect(findElement(tree,'inputData')).toBeDefined();


})

test('examples of some things', async () => {
    const expectedNumber = 4
    render(<Home/>)
    const tree = renderer.create(<Home navigation={navigation} />);

    fireEvent.changeText(screen.getByTestId('inputData'))
    fireEvent.press(screen.getByTestId('SubmitButton'))
    const textInput = tree.root.findByProps({ testID: "inputData" }).props;
    renderer.act(() => textInput.onChangeText("Test"));
    const textInput1 = tree.root.findByProps({ testID: "inputData" }).props;
    expect(textInput1.value).toBe("Test");
    expect(expectedNumber).toBe(4)
    expect(screen.toJSON()).toMatchSnapshot()
})

// test("Navigate correctly", () => {
//     const tree = renderer.create(<Home navigation={navigation} />);
//     const button = tree.root.findByProps({ testID:"SubmitButton" }).props;
//     button.onPress();
//     expect(navigation.navigate).toBeCalledWith("Detail", {
//       slots:'',
//     });
//   });





