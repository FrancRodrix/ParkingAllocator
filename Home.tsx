import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';


interface Props {
  navigation: any;
  route: any;
}

export default function Home(props:Props) {
  const [slots, setSlots] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.head}> Parking Allocator</Text>
      <TextInput
        // onChangeText={(text: any) => {
        //   setSlots(text);
        // }}
     
        value={slots}
        style={styles.textInput}
        placeholder="SLOTS TO BOOK"
        placeholderTextColor={'grey'}
        keyboardType={'numeric'}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          if(slots){
            setSlots('')
            props.navigation.navigate('ParkScreen', {
               slots: slots,
             })
          }       
          
        }}>
        <Text style={styles.submitText}>SUBMIT</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e130',
  },
  head: {
    fontSize: 80,
    fontWeight: '100',
    alignSelf: 'center',
    // position: 'absolute',
    color: 'white',
    marginTop: -200,
    // top: 80,
  },
  textInput: {
    // borderWidth:1,
    borderColor: '#000',
    borderRadius: 10,
    width: '70%',
    textAlign: 'center',
    letterSpacing: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    width: '70%',
    backgroundColor: '#DE3163',
    borderRadius: 10,
    marginTop: 15,
    padding: 15,
  },
  submitText: {
    color: '#fff',
    letterSpacing: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
