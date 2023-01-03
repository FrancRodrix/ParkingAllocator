import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import RNFetchBlob from 'react-native-blob-util';
import * as Progress from 'react-native-progress';

const createdDir = `${
  Platform.OS === 'ios'
    ? RNFetchBlob.fs.dirs.DocumentDir
    : `/storage/emulated/0/Android/data/ai.builder.careerhunt/files/Picture `
}`;

export default function DownloadFile() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const[loader,setLoader]=useState(false)

  const IMAGE_PATH =
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg';

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadImage()
    }else{
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'App needs permision',
            message: 'App need permission to acess the storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          console.log('granted');
          downloadImage();
        } else {
          console.log('Alert permission not granted');
        }
      } catch (error) {
        console.log(error);
      } 
    }
  };
  const downloadImage = async () => {
    setLoader(true)
    const check = await RNFetchBlob.fs.exists(createdDir);
    if (!check) {
      await RNFetchBlob.fs.mkdir(createdDir);
    }
    const date = new Date();
    const Image_URl = IMAGE_PATH;
    const ext = getExtension(Image_URl);

    const {config, fs} = RNFetchBlob;
    let PictureDir = createdDir;
    console.log(PictureDir, 'Path');

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/imgae_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };

    config(options)
      .fetch('POST', Image_URl)
      .progress((received, total) => {
        console.log('progress', received / total);
        setDownloadProgress(1);
      })
      .then(res => {
      
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(res.path());
        } else {
          RNFetchBlob.android.actionViewIntent(res.path(), 'application/pdf');
        }
      })
      .catch((errorMessage, statusCode) => {
        console.log('error with downloading file', errorMessage);
      });
  };


  const getExtension = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  

  return (
    <View>
      <TouchableOpacity style={styles.downloadButton} onPress={checkPermission}>
        <Text style={styles.buttonText}>Download File</Text>
      </TouchableOpacity>
{
  loader?(
    <View style={{alignSelf: 'center'}}>
    <Progress.Bar
      progress={downloadProgress}
      width={300}
      height={20}
      animated={true}
    />
  </View>   
  ):(
    null
  )
}   
      {downloadProgress === 1 ? (
        <Text style={styles.success}>Succussfull Downloaded</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  downloadButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'orange',
    width: '40%',
    marginBottom: 40,
    marginTop: 200,
  },
  success: {
    fontSize: 20,
    color: 'green',
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});
