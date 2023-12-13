import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    Button
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from "firebase";

export default class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: "image_1",
            dropdownHeight: 40,
            light_theme: true
        };
    }

    componentDidMount() {
     this.fetchUser()
    }
    
    async addPost() {
        if (
            this.statecaption
        ) {
            let storyData = {
                preview_image: this.state.previewImage,
                caption: this.state.caption,
                author: firebase.auth().currentUser.displayName,
                created_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                profile_image: this.state.profile_image,
                likes: 0
            }
            await firebase
                .database()
                .ref(
                    "/posts/" + 
                    Math.random()
                    .toString(36)
                    .slice(2)
                )
                .set(storyData)
                .then(function (snapshot) {})
            this.props.setUpdateToTrue();
            this.props.navigation.navigate("Feed")
        } else {
          Alert.alert(
            'Error',
            'All fields are required!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      }


      async fetchUser() {
        let theme, name, image;
        await firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", function (snapshot) {
                theme = snapshot.val().current_theme;
                name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
                image = snapshot.val().profile_picture;
            });
        this.setState({
            light_theme: theme === "light" ? true : false,
            name: name,
            profile_image: image
        });
    }



    render() {
        let preview_images = {
            image_1: require("../assets/image_1.jpg"),
            image_2: require("../assets/image_2.jpg"),
            image_3: require("../assets/image_3.jpg"),
            image_4: require("../assets/image_4.jpg"),
            image_5: require("../assets/image_5.jpg"),
        };
        return (
            <View
                style={
                    this.state.light_theme 
                        ? styles.containerLight 
                        : styles.container
                }
            >
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text
                            style={
                                this.state.light_theme
                                    ? styles.appTitleTextLight
                                    : styles.appTitleText
                            }
                        >
                            New Post
                        </Text>
                    </View>
                </View>
                <View style={styles.fieldsContainer}>
                    <ScrollView>
                        <Image
                            source={preview_images[this.state.previewImage]}
                            style={styles.previewImage}
                        ></Image>
                        <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                            <View style={styles.dropDownPicker}>
                                <DropDownPicker
                                    items={[
                                        { label: "Image 1", value: "image_1" },
                                        { label: "Image 2", value: "image_2" },
                                        { label: "Image 3", value: "image_3" },
                                        { label: "Image 4", value: "image_4" },
                                        { label: "Image 5", value: "image_5" },
                                    ]}
                                    defaultValue={this.state.previewImage}
                                    containerStyle={{
                                        height: 40,
                                        borderRadius: 20,
                                        marginBottom: 10
                                    }}
                                    onOpen={() => {
                                        this.setState({ dropdownHeight: 170 });
                                    }}
                                    onClose={() => {
                                        this.setState({ dropdownHeight: 40 });
                                    }}
                                    style={{ backgroundColor: "white" }}
                                    itemStyle={{
                                        justifyContent: "flex-start"
                                    }}
                                    dropDownStyle={{ backgroundColor: "#2a2a2a" }}
                                    labelStyle={{
                                        color: "white"
                                    }}
                                    arrowStyle={{
                                        color: "white"
                                    }}
                                    onChangeItem={item =>
                                        this.setState({
                                            previewImage: item.value
                                        })
                                    }
                                />
                            </View>
                        </View>

                        <TextInput
                            style={
                                this.state.light_theme
                                    ? styles.inputFontLight
                                    : styles.inputFont
                            }
                            onChangeText={caption => this.setState({ caption })}
                            placeholder={"Caption"}
                            placeholderTextColor={this.state.light_theme ? "black" : "white"}
                        />

                        <View style={styles.submitButton}>
                            <Button
                                onPress={() => this.addPost()}
                                title="Submit"
                                color={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                        <View style={styles.submitButton}>
                            <Button
                                onPress={() => this.addPost()}
                                title="Submit"
                                color={this.state.light_theme ? "black" : "white"}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 0.08 }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },

    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },


    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },

    appTitle: {
        flex: 0.07,
        flexDirection: "row",
    },

    appIcon: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },

    iconImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
      position:'absolute',
      left:320,
      bottom:25
    },

    appTitleTextContainer: {
        flex: 0.7,
        justifyContent: "center"
    },
    
    appTitleText: {
      color: "white",
      fontSize: RFValue(25),
      position:'absolute',
      left:170,
      bottom:15,
    },

    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(25),
        position:'absolute',
        left:170,
        bottom:15,
      },
  

    fieldsContainer: {
        flex: 0.85
    },

    previewImage: {
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(100),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },

    inputFont: {
        borderColor:"white",
        borderWidth:2,
        borderRadius:10,
        height:100,
        color:"white",
    },

    inputFontLight: {
        borderColor:"black",
        borderWidth:2,
        borderRadius:10,
        height:100,
        color:"black",
    },

    dropDownPicker:{
        height:10,
        width:200,
        position:"absolute",
        left:30,
        bottom:520
    },

    submitButton: {
        marginTop: RFValue(20),
        alignItems: "center",
        justifyContent: "center"
      }
});