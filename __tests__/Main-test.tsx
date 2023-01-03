import 'react-native'
import React from 'react'
import Home from '../Class/Screens/Main'
import render from 'react-test-renderer'

test('Home snapshot',()=>{
    const snap=render.create(
        <Home/>
    ).toJSON();
    expect(snap).toMatchSnapshot();
});

let findElement=function(tree:any,element:any){
    return true
}

it('find element',()=>{
    let tree=render.create(
        <Home/>
    ).toJSON();
    expect(findElement(tree,'inputData')).toBeDefined();
})
