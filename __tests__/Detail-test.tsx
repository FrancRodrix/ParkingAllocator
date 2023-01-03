import 'react-native'
import React from 'react'
import Detail from '../Class/Screens/Detail'
import render from 'react-test-renderer'

test('Home snapshot',()=>{
    const snap=render.create(
        <Detail/>
    ).toJSON();
    expect(snap).toMatchSnapshot();
});

