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
  Platform,
  TextInput
} from 'react-native';
import moment from 'moment';

import React from 'react';

interface Props {
  navigation: any;
  route: any;
}

interface SS {
  disabled: boolean;
  row: any;
  modalVisible: boolean;
  carNum: any;
  carDetails: any;
  payment: boolean;
  loader: boolean;
  randomArray: any;
  registrationView:boolean
  regNumber:any;
}

export default class Detail extends React.Component<Props, SS> {

  constructor(props: Props) {
    super(props);
    this.state = {
      slotCount: JSON.parse(props.route.params.slots),
      disabled: false,
      rows: [],
      modalVisible: false,
      carNum: '',
      carDetails: [],
      payment: false,
      loader: false,
      randomArray: [],
      registrationView:false,
      regNumber:''
    };
  }

  componentDidMount() {
    this.createSlots(this.state.slotCount);
  }

  handleAddToParking = (carId: any) => {
    if (this.isFull()) {
      ToastAndroid.showWithGravity(
        'Parking is Full',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    this.park(carId);
  };

  generateNumberPlate = () => {
    // const r: any = (x: any) => ~~(Math.random() * x) + '';
    // const l: any = (x: any) => [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'][r(26)];
    // return r(10) + r(10) + r(10) + '-' + l() + l() + l();
    return this.state.regNumber
  };

  createSlots(input: any) {
    let v: any = [];
    for (let i = 1; i <= input; i++) {
      v.push(false);
    }
    // setRows(v);
    this.setState({
      rows: v,
    });
    console.log(v);
    return v;
  }

  calculateCharges(arr: any, id: any) {
    let rate = 0;

    arr.map((c: any, d: any) => {
      if (c.car === id) {
        let hoursDiff = c.end.diff(c.start, 'seconds');
        if (hoursDiff < 2) {
          rate = 10;
        } else {
          rate = hoursDiff * 10;
        }
        arr[arr.indexOf(c)] = {...c, rate:rate};
        arr[arr.indexOf(c)] = {...c, startTime:c.start};
        arr[arr.indexOf(c)] = {...c, endTime:c.end};
      }
    });
    this.setState({
      rows: [...this.state.rows],
    });
  }

  // function getRandomNumber(min, max) {
  //   let step1 = max - min + 1;
  //   let step2 = Math.random() * step1;
  //   let result = Math.floor(step2) + min;
  //   return result;
  // }

  // function createArrayOfNumbers(start, end) {
  //   let myArray = [];
  //   for (let i = start; i <= end; i++) {
  //     myArray.push(i);
  //   }
  //   setRandomArray([...myArray]);
  //   return myArray;
  // }

  park(carId: any) {
    this.setState({registrationView:false})
    console.log(`Parking car: ${carId}`);
    let start = moment();

    if (this.state.rows.every((slot: any) => slot !== false)) {
      this.setState({
        disabled: false,
      });
    }
    var randomItem = Math.floor(
      Math.random() * (this.state.rows.length - 0 + 0) + 0,
    );
    if (this.state.rows[randomItem] === false) {
      this.state.rows[randomItem] = {
        car: carId,
        busy: true,
        start: start,
      };
    }
    this.setState({
      rows: [...this.state.rows],
      regNumber:''
    });
  }

  remove(arr: any, carId: any) {
    console.log(`Leaving car: ${carId}`);
    let end = moment();

    if (this.state.rows.every((slot: any) => slot !== carId)) {
      this.setState({
        disabled: false,
      });
    }
    arr.map((a: any, b: any) => {
      if (a.car == carId) {
        (a.car = false), (this.state.rows[this.state.rows.indexOf(a)] = false);
      }
    });
    this.setState({
      rows: [...arr],
    });
    this.setState({modalVisible: false});
  }



  getAvailable() {
    const availableSlots = this.state.rows.filter(
      (s: any) => s === false,
    ).length;
    console.log(`Available parking slots: ${availableSlots}`);
    return availableSlots;
  }


  isFull() {
    return this.getAvailable() === 0;
  }


  asyncPostCall = async () => {
    console.log('FETCHING');
    this.setState({
      loader: true,
    });
    try {
      const response = await fetch('https://httpstat.us/200', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.setState({
        loader: false,
        payment: true,
      });
    } catch (error) {
      this.setState({
        payment: false,
      });

      console.log(error);
    }
  };



  addEndtime(arr: any, id: any) {
    let end = moment();
    arr.map((a: any, b: any) => {
      if (a.car === id) {
        arr[arr.indexOf(a)] = {...a, end: end};
      }
    });
    this.setState({
      rows: [...arr],
    });

    this.calculateCharges(this.state.rows, id);
    this.state.rows.map((f: any, d: any) => {
      if (f) {
        this.setState({
          carDetails: f,
        });
       
      }
    });
  
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* <TouchableOpacity
        testID='backButton'
          onPress={() => {
            // this.props.navigation.goBack();
          }}>
          <Text style={{color: '#fff'}}>Back</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
        testID='parkButton'
          disabled={this.state.disabled}
          style={styles.parkButton}
          onPress={() => {
            // this.handleAddToParking(this.generateNumberPlate());
            this.setState({registrationView:true})
          }}>
          <Text testID='parkName' style={styles.parkingText}>PARK</Text>
        </TouchableOpacity>

        <FlatList
        testID='Slots'
          numColumns={2}
          data={this.state.rows}
          extraData={this.state}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
              testID='parkinglot'
                onPress={() => {
                  if (item.busy == true) {
                    this.setState({
                      modalVisible: true,
                    });
                    this.addEndtime(this.state.rows, item.car);
                  }
                  this.setState({
                    carNum: item.car,
                  });
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
        {this.state.modalVisible ? (
          <Modal
          testID='modalView'
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              {this.state.payment ? null : ( 
                  <TouchableOpacity
                  testID='modalButton'
                    onPress={() => {
                      this.setState({
                        modalVisible:false,
                      });
                    }}>
                    <Text style={styles.close}>close</Text>
                  </TouchableOpacity>
                 )
                } 

                <Text style={styles.NumPlate}>
                  <Text style={{fontSize: 20, color: '#000'}}>Vehicle No:</Text>
                  {this.state.carDetails.car}
                </Text>
                <View style={styles.time}>
                <Text style={styles.NumPlate}>
                  <Text style={{fontSize: 20, color: '#000'}}>Start:</Text>
                  {moment(this.state.carDetails.start).format("HH:mm:ss")}
                </Text>
                <Text style={styles.NumPlate}>
                  <Text style={{fontSize: 20, color: '#000'}}>  End:</Text>
                  {moment(this.state.carDetails.end).format("HH:mm:ss")}
                </Text>
                </View>
               
                {this.state.loader ? (
                  <ActivityIndicator
                    size="small"
                    color="#0000ff"
                    style={{marginTop: 80}}
                  />
                ) : this.state.payment ? (
                  <Text style={styles.success}>PAYMENT SUCCESSFULL!!</Text>
                ) : (
                  <Text style={styles.fees}>${this.state.carDetails.rate}</Text>
                )}

                {this.state.payment ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      this.asyncPostCall();
                    }}
                    style={styles.payment}>
                    <Text style={styles.payText}>Please make the Payment</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                testID='deAllocate'
                  disabled={!this.state.payment}
                  onPress={() => {
                    this.remove(this.state.rows, this.state.carNum);
                    this.setState({
                      payment: false,
                    });
                  }}
                  style={[
                    styles.deAllocate,
                    {opacity: this.state.payment ? 1 : 0.5},
                  ]}>
                  <Text style={styles.payText}>Deallocate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
         ) : null} 

<Modal
testID='RegModal'
            animationType="slide"
            transparent={true}
            visible={this.state.registrationView}>
            <View style={styles.regBackView}>
              <View style={styles.regView}>

                <Text style={styles.regHeading}>Enter Registration Number</Text>
                <TextInput
                placeholder='Vehicle no'
                style={styles.textInput}
                testID={'inputData'}
                onChangeText={(text: any) => {
                  this.setState({regNumber:text})
                }}
             
                value={this.state.regNumber}
                />
                <TouchableOpacity
                testID='allocate'
                style={styles.confirmButton}
                 onPress={() => {
                  this.handleAddToParking(this.generateNumberPlate());
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
