import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  TextInput
} from 'react-native';
import moment from 'moment';

import React, {useState, useEffect} from 'react';

interface Props {
  navigation: any;
  route: any;
  disabled:boolean
  modalVisible:boolean;
  rows:any;
  payment:boolean;
  loader:boolean
}

export default function Park(props: Props) {
  const [disabled, setDisabled] = useState(false);
  const slotCount = JSON.parse(props.route.params.slots);
  const [rows, setRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [carNum, setCarNum] = useState();
  const [carDetails, setCarDetails] = useState([]);
  const [payment, setPayment] = useState(false);
  const [loader, setLoader] = useState(false);
  const [randomArray, setRandomArray] = useState([]);
  const[ registrationView,setRegistrationView]=useState(false);
  const[regNumber,setRegnumber]=useState('')

  useEffect(() => {
    createSlots(slotCount);
  }, []);

  const handleAddToParking = (carId: any) => {
    if (isFull()) {
      ToastAndroid.showWithGravity(
        'Parking is Full',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    park(carId);
  };

  const generateNumberPlate = () => {
    // const r: any = (x: any) => ~~(Math.random() * x) + '';
    // const l: any = (x: any) => [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'][r(26)];
    // return r(10) + r(10) + r(10) + '-' + l() + l() + l();
    return regNumber
  };

  function createSlots(input: any) {
    let v: any = [];
    for (let i = 1; i <= input; i++) {
      v.push(false);
    }
    setRows(v);
    console.log(v);
    return v;
  }

  function calculateCharges(arr:any, id:any) {
    let rate = 0;
    console.log(carDetails, 'THTHRTJ');

    arr.map((c: any, d: any) => {
      if (c.car === id) {
        let hoursDiff = c.end.diff(c.start, 'seconds');
        if (hoursDiff < 2) {
          rate = 10;
        } else {
          rate = hoursDiff * 10;
        }
        arr[arr.indexOf(c)] = {...c, rate: rate};
      }
    });
    setRows([...rows]);
  }

  function getRandomNumber(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
  }

  function createArrayOfNumbers(start, end) {
    let myArray = [];
    for (let i = start; i <= end; i++) {
      myArray.push(i);
    }
    setRandomArray([...myArray]);
    return myArray;
  }

  function park(carId: any) {
    console.log(`Parking car: ${carId}`);
    setRegistrationView(false)

    let start = moment();

    if (rows.every((slot: any) => slot !== false)) {
      setDisabled(false);
    }
    var randomItem = Math.floor(Math.random() * (rows.length - 0 + 0) + 0);
    if (rows[randomItem] === false) {
      rows[randomItem] = {
        car: carId,
        busy: true,
        // rate: calculateCharges(),
        start: start,
      };
    }
    setRows([...rows]);
    setRegnumber('')
    console.log(rows, 'WITH RATE');
  }

  function remove(arr: any, carId: any) {
    console.log(`Leaving car: ${carId}`);
    let end = moment();

    if (rows.every((slot: any) => slot !== carId)) {
      setDisabled(false);
    }
    arr.map((a: any, b: any) => {
      if (a.car == carId) {
        (a.car = false), (rows[rows.indexOf(a)] = false);
      }
    });
    setRows([...arr]);
    console.log(rows, 'remove');
    setModalVisible(false);
  }

  function getAvailable() {
    const availableSlots = rows.filter((s: any) => s === false).length;
    console.log(`Available parking slots: ${availableSlots}`);
    return availableSlots;
  }

  function isFull() {
    return getAvailable() === 0;
  }

  const asyncPostCall = async () => {
    console.log('FETCHING');
    setLoader(true);
    try {
      const response = await fetch('https://httpstat.us/200', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //  body: JSON.stringify({
        //  car_registration: carDetails.car,
        //  charge: carDetails.rate
        //  })
      });
      //  const data = await response.json();
      setLoader(false);
      setPayment(true);
    } catch (error) {
      setPayment(false);
      console.log(error);
    }
  };



  function addEndtime(arr:any, id:any) {
    let end = moment();
    arr.map((a:any, b:any) => {
      if (a.car === id) {
        arr[arr.indexOf(a)] = {...a, end: end};
      }
    });

    setRows([...arr]);

    calculateCharges(rows, id);

    rows.map((f, d) => {
      if (f.rate) {
        setCarDetails(f);
      }
    });
    console.log(rows, 'FINAL');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}>
        <Text style={{color: '#fff'}}>Back</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
      testID='ParkButton'
        disabled={disabled}
        style={styles.parkButton}
        onPress={() => {
          setRegistrationView(true)
        }}>
        <Text style={styles.parkingText}>PARK</Text>
      </TouchableOpacity>
      <FlatList
      testID='list'
        numColumns={2}
        data={rows}
        extraData={this.state}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
            testID='ParkingSlot'
              onPress={() => {
                if (item.busy == true) {
                  setModalVisible(true);
                  addEndtime(rows, item.car);
                }
                setCarNum(item.car);
                // setCarDetails(item);
              }}
              style={[
                styles.parkingSpace,
                {backgroundColor: item.busy ? 'red' : '#708090'},
              ]}>
              {item.busy ? (
                <Text style={styles.number}>{item.car}</Text>
              ) : (
                <Text style={styles.number}>{index + 1}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
        <Modal testID='modal' animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {payment ? null : (
                <TouchableOpacity
                testID='Close'
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text style={styles.close}>close</Text>
                </TouchableOpacity>
             )}
         

              <Text testID='name' style={styles.NumPlate}>
                <Text style={{fontSize: 20, color: '#000'}}>Vehicle No:</Text>
                {carDetails.car}
              </Text>
              <View style={styles.time}>
                <Text style={styles.NumPlate}>
                  <Text style={{fontSize: 20, color: '#000'}}>Start:</Text>
                  {moment(carDetails.start).format("HH:mm:ss")}
                </Text>
                <Text style={styles.NumPlate}>
                  <Text style={{fontSize: 20, color: '#000'}}>  End:</Text>
                  {moment(carDetails.end).format("HH:mm:ss")}
                </Text>
                </View>
               
              {loader ? (
                <ActivityIndicator
                  size="small"
                  color="#0000ff"
                  style={{marginTop: 80}}
                />
              ) : payment ? (
                <Text style={styles.success}>PAYMENT SUCCESSFULL!!</Text>
              ) : (
                <Text style={styles.fees}>${carDetails.rate}</Text>
              )}
             

              {payment ? null : (
                <TouchableOpacity
                testID='payButton'
                  onPress={() => {
                    asyncPostCall();
                  }}
                  style={styles.payment}>
                  <Text style={styles.payText}>Please make the Payment</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
              testID='del'
                disabled={!payment}
                onPress={() => {
                  remove(rows, carNum);
                  setPayment(false);
                }}
                style={[styles.deAllocate, {opacity: payment ? 1 : 0.5}]}>
                <Text style={styles.payText}>Deallocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

       <Modal
         testID='RegModal'
            animationType="slide"
            transparent={true}
            visible={registrationView}>
            <View style={styles.regBackView}>
              <View style={styles.regView}>

                <Text testID='textReg' style={styles.regHeading}>Enter Registration Number</Text>
                <TextInput
                placeholder='Vehicle no'
                style={styles.textInput}
                testID={'inputData'}
                onChangeText={(text: any) => {
                  setRegnumber(text)
                  // this.setState({regNumber:text})
                }}
             
                value={regNumber}
                />
                <TouchableOpacity
                testID='allocate'
                style={styles.confirmButton}
                 onPress={() => {
                  handleAddToParking(generateNumberPlate());
                }}               
                >
                  <Text style={styles.cnfimText}>CONFIRM</Text>
                </TouchableOpacity>
                
                </View>
                </View>
                </Modal> 

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#708090',
  },
  parkingSpace: {
    height: 80,
    width: '40%',
    borderWidth: 10,
    // backgroundColor: 'grey',
    borderColor: 'white',
    margin: 10,
  },
  number: {
    textAlign: 'center',
    marginTop: 20,
    color: 'yellow',
    fontWeight: '700',
  },
  parkButton: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#000',
    width: 200,
    height: 40,
    borderRadius: 10,
    marginVertical: 10,
  },
  parkingText: {
    color: 'white',
    textAlign: 'center',
    letterSpacing: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
    marginTop: -50,
  },
  modalView: {
      flex: 0.5,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
   
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    // textAlign: "center"
  },
  payment: {
    alignSelf: 'center',
    width: 250,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'green',
    borderRadius: 6,
    marginTop: 40,
  },
  deAllocate: {
    alignSelf: 'center',
    width: 250,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 20,
    borderRadius: 6,
  },
  payText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  close: {
    // position:'absolute',
    top: 10,
    right: -280,
  },
  fees: {
    alignSelf: 'center',
    color: '#000',
    fontWeight: '800',
    fontSize: 45,
    marginTop: 60,
  },
  NumPlate: {
    color: 'orange',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },
  success: {
    textAlign: 'center',
    color: '#483248	',
    fontSize: 30,
    fontWeight: '00',
    marginTop: 70,
  },
  textInput: {
    alignSelf:"center",
    // borderWidth:1,
    borderColor: '#000',
    borderRadius: 10,
    width: '70%',
    textAlign: 'center',
    letterSpacing: 5,
    backgroundColor: '#fff',
    borderWidth:1
  },
  regHeading:{
    alignSelf:'center',
    fontSize:15,
    color:'#000',
    fontWeight:'bold',
    paddingBottom:10
  },
  confirmButton:{
    alignSelf:'center',
   borderRadius:10,
   padding:10,
   backgroundColor:'green',
   width:'40%',
   marginVertical:20
  },
  cnfimText:{
textAlign:'center',
color:'#fff',
fontWeight:"800",
letterSpacing:1.5
  },
  regBackView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
    marginTop: -50,
  },
  regView:{ 
      flex: 0.3,
      width: '90%',
      height: '35%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
  },
  time:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start'
  }
});
