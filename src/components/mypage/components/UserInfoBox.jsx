import React, { useEffect, useState, useCallback } from 'react';
import { Text, ScrollView, View, TouchableOpacity, Alert,StyleSheet,SafeAreaView, localStorage,Image, ImageBackground } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNickname, removeNickname, removeAccessToken, getEmail } from '../../../common/storage';
import { onChange } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import PhotoOptions from '../../../common/PhotoOptions';
import ChangeForm from './ChangeForm';
import { Request } from '../../../common/requests';


const request = new Request();

  //export default ViewStyleProps;   

export default function UserInfoBox({ navigation }) {

    const [nickname, setNickname] = useState('')
    const [photo, setPhoto] = useState('');
    const [email,setEmail] = useState('');
    const [birthdate,setBirthdate] = useState('');
 
    const logout = () => {
        removeNickname()
        removeAccessToken()
        setNickname('')
        setEmail('')
    }

    
    const getUserinfo = async () => {
      const response = await request.get(`/users/me/`,{},{});
      console.log("응답 : ",response);
      console.log("이메일 : ",response.data.data.email);
      console.log("생년월일 : ", response.data.data.birthdate);
      console.log("프로필 이미지 : ", response.data.data.profile_image)
      setEmail(response.data.data.email);
      setBirthdate(response.data.data.birthdate);
      setPhoto(response.data.data.profile_image);
    }

  /*
    useFocusEffect(useCallback(()=>{
      async function _getEmail()
      {
        setEmail(await getEmail());
      }
      _getEmail();
    },[email]))*/

    //화면에 포커스 잡힘 -> 실행됨 
    useFocusEffect(
      useCallback(() => {
          // Do someth2ing when the screen is focused
          async function _getNickname() {
              setNickname(await getNickname());
          }
          _getNickname();
          getUserinfo();
          // return () => {
          //     // Do something when the screen is unfocused
          //     // Useful for cleanup functions
          // };
      }, [nickname]))

   


      // React.js와 RN에서 화면 네비게이션 동작이 다르므로 useEffect 대신 useFocusEffect를 사용

  


  return (
      <View>
          {nickname ? (
              <View>
                  
                  
                <ScrollView>

                  <View >
                      <ImageBackground source={{uri: photo}} style = {styles.circle}/>
                    </View >    

                        <Text>{nickname}님</Text>
                        <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>이메일</Text></View>                        
                        <View style={styles.rectangle}><Text style={{fontSize:7}}>{email}</Text></View>
                      </SafeAreaView>

                      <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>닉네임</Text></View>
                        <View style={styles.rectangle}><Text>{nickname}</Text></View>
                      </SafeAreaView>

                      <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>생년월일</Text></View>
                        <View style={styles.rectangle}><Text style={{fontSize:7}}>{birthdate}</Text></View>
                        </SafeAreaView>

                        <SafeAreaView style={{padding:'5%', flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>navigation.navigate('change')}>
                        <View style={styles.oval0}><Text style={styles.text} >프로필 편집</Text></View>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate('changepw')}>
                        <View style={styles.oval0}>
                          <Text style={styles.text} >비밀번호 변경</Text>
                          </View>
                        </TouchableOpacity>             
                        <TouchableOpacity style={{ }} onPress={() => navigation.navigate('feedback')}>
                        <View style={styles.oval0}><Text style={styles.text} >의견 보내기</Text></View>
                        </TouchableOpacity></SafeAreaView>

                    </ScrollView>

                  <TouchableOpacity style={{ position: 'absolute', right: 8 }} onPress={() => logout()}>
                      <View style={{ backgroundColor: 'gray', padding: 4 }}>
                          <Text style={{ color: 'white' }}>로그아웃</Text>
                      </View>
                  </TouchableOpacity>
              </View>
          ) : (

              <View>
                  <TouchableOpacity onPress={() => navigation.navigate('login')}>
                      <Text>로그인이 필요합니다.</Text>
                  </TouchableOpacity>
              </View>
          )}

      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginTop:65,
  },
  circle: {
      
      width: 150,
      height: 150,
      borderRadius: (150/2),
      backgroundColor: "white",
      margin : '5%',
    },
    oval: {
      width: 40,
      height: 20,
      borderRadius: 100,
      backgroundColor: "#AAEFC2",
      transform: [{ scaleX: 2 }],
      margin : '8%',
      flexDirection : 'row',
  },
  oval0: {
      width: 50,
      height: 20,
      borderRadius: 100,
      backgroundColor: "pink",
      transform: [{ scaleX: 2 }],
      margin : '10%',
      flexDirection : 'row',
  },
  rectangle: { 
      width: 20 * 2,
      height: 20,
      backgroundColor: "#d3d3d3",
      transform: [{ scaleX: 2 }],
      margin : '8%',
      flexDirection : 'row',
    },
    text:{
      fontSize :8,
      fontWeight : "bold"

    }

});
