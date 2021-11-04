import React from 'react';
import { Layout, Menu, Icon, Input, Form, Button, Modal, message,Row,Col, AutoComplete } from 'antd';
import './main.css';     
import axios from 'axios';
import '@ionic/react/css/core.css';
import Room from './Room';
import { withRouter} from 'react-router-dom';
import Channel from './Channel';
import { IonActionSheet,IonIcon, IonContent, IonButton } from '@ionic/react';
import aa from '../aa.png';

const { Sider} = Layout;
const {SubMenu} = Menu;
var randomize = require('randomatic');

class MainPage extends React.Component {
    
    state = {
        showActionSheet:false,
        //main controller
        collapsed: false,
        channels:[],
        type:"channel",

        //channel
        selChannelId:"",

        //Final Message Conatiner
        currentRoom:{},
        enteredRoom:false,

        //CurrentTracker
        homeUser: this.props.homeUser||localStorage.getItem("aqs"),

        //create room
        rname:'',
        rcode:'',
        currentRid:'',
        openCreate:false,
        validateSatus:"",
        help:"", 

        //join Room
        data:[],
        searchQuery: "",
        jrcode:"",
        joinValidate: "",
        openJoin:false,
        joinCodeHelp:"",

        //leaveRoom
        levOpen:false,
        leaving:false,

        //delete Room
        delOpen:false,
    };

    componentWillMount() {
        if(this.state.homeUser===null && localStorage.getItem("aqs")===null)
        {
            this.props.history.push('/');
        }
    }
    componentDidMount()
    {/*
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = "If You Leave";

            (e || window.event).returnValue = confirmationMessage; 

        });*/
    }

    //Leave Room
    leaveRoom=()=>{
        this.setState({ leaving:true }, () => {
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/leaveRoom"+this.state.currentRoom.rid,
                data: {
                    user:this.state.homeUser
                }
            }).then((res) => {
                if (res.data) {
                    this.setState({
                        leaving:false,
                        enteredRoom:false,
                        currentRoom:{},
                        type:"channel"
                    })
                }
            });
        });
    }

    //delete Room
    delRoom=()=>{
        this.setState({ leaving: true }, () => {
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/delRoom" + this.state.currentRoom.rid,
                data: {
                    user: this.state.homeUser
                }
            }).then((res) => {
                if (res.data) {
                    this.setState({
                        leaving: false,
                        enteredRoom: false,
                        currentRoom: {},
                        type: "channel"
                    })
                }
            });
        });
    }

    //Room Join
    searchRoom = (val) => {
        this.setState({joinCodeHelp:"",searchQuery: val }, async () => {
            axios.get('https://markx5.herokuapp.com/searchRoom?q=' + this.state.searchQuery)
                .then((response) => {
                    if(response.data===[])
                    {
                        this.setState({joinhelp:"there's no room live with this name!"})
                    }
                    else{
                        this.setState({ data: response.data });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }
    joinRoom=()=>{
        if(this.state.searchQuery==="" || this.state.jrcode==="") 
        {
            message.warning('Please enter all information!', 3);
            return;
        }
        this.setState({joining:true},()=>{
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/searchRid",
                data: {
                    rname: this.state.searchQuery
                }
            }).then((res)=>{
                if(res.data)
                {
                    axios({
                        method: "post",
                        url: "https://markx5.herokuapp.com/checkRcode",
                        data: {
                            rcode: this.state.jrcode,
                            rname: this.state.searchQuery,
                            homeUser:this.state.homeUser
                        }
                    }).then((res) => {
                        if (res.data.yes) {
                            let roomInfo = res.data.current;
                            if(roomInfo.homeUser===roomInfo.admin)
                            {
                                roomInfo.asAdmin=true;
                            }
                            else{
                                roomInfo.asAdmin=false;
                            }
                            this.setState({
                                joining: false,
                                enteredRoom: true,
                                joinCodeHelp: "",
                                joinValidate: "",
                                currentRoom: roomInfo,
                                openJoin:false,
                                
                            }, () => { this.setState({ type: "room"})})
                        }
                        else {
                            this.setState({ joinValidate: "error", joinCodeHelp: "incorrect room code!" })
                        }
                    });
                }
                else{
                    this.setState({joinCodeHelp:"no room with entered name exits!"})
                }

            });
        })
    }
    
    //Room Creation
    createRoom = () => {
        if (this.state.validateSatus === "success" && this.state.rname !== "" && this.state.rcode !== '')
        {

            this.setState({currentRid: randomize('A0', 10)},()=>{
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/createRoom",
                data: {
                    rid: this.state.currentRid,
                    admin: this.state.homeUser,
                    rname: this.state.rname,
                    rcode: this.state.rcode,
                }
            }).then((res) => {
                if (res) {
                    this.setState({
                     rname: "",
                     rcode: "",
                     validateSatus:"",
                     currentRoom:{
                         admin: res.data.admin,
                         roomName: res.data.roomName,
                         rcode: res.data.rcode,
                         time: res.data.time,
                         rid: res.data.roomId,
                         asAdmin: true,
                         homeUser:this.state.homeUser
                     },
                     enteredRoom:true,
                    type: "room",
                    openCreate:false
                });
                }else{
                    message.warning('Please enter all information!',3);
                }
            })
        });
        }
    }
    getRoomName=(value)=>{
        this.setState({validateSatus:"validating"});
        let val=value.target.value;
        this.setState({rname:val},async ()=>{
            axios.get('https://markx5.herokuapp.com/searchAvRname?q=' + this.state.rname)
                .then((response)=> {
                    if (!response.data) {
                        this.setState({ validateSatus: "success", help: ""});
                    } else {
                        this.setState({ validateSatus: "error", help: "room with this name already exits!" });
                    }
                })
                .catch(function (error) {
                    console.log(error);
            });
        });
    }

    //exit
    logout=()=>{
        this.setState({leaving:true});
        axios({
            method: "post",
            url: "https://markx5.herokuapp.com/exit",
            data: {
                user:this.state.homeUser
            }
        }).then((res)=>{
            if(res.data)
            {
                this.setState({homeUser:""});
                localStorage.clear();
                this.props.history.push('/');
            }
        }) 
    }

    render() {
        return (
            <div>
                <Layout style={{ height: "100vh" }} className="full">
                    <div className="p-4 pt-2 shadow-1 bg-white">
                                <Icon type="fire" className="myblue pr-1" style={{ fontSize: "220%" }} theme="filled" />
                                {this.state.enteredRoom ?
                                    <h5 className="pl-1 d-inline-block">{this.state.currentRoom.roomName}</h5>
                                    : <h5 className="pl-1 d-inline-block"> fireflow</h5>}

                                <Icon style={{ fontSize: "190%" }}
                                    onClick={() => this.setState({ showActionSheet: true })}
                                    className="float-right p-1 pr-2 d-inline-block" type="menu" />
                    </div>
                    {this.state.type !== "room" ? <Room toMain={() => this.setState({ type: "channel", currentRoom: {} })} roomInfo={this.state.currentRoom} />
                        : this.state.type === "channel" ? <Channel channelId={this.state.selChannelId} /> : <h1>Home</h1>}
                </Layout> 
                <Layout style={{ height: "100vh" }} 
                    
                className="mob ">
                    <div className="p-1 pt-2 shadow-1 bg-white">
                        <Row align="middle">
                            <Col span={2}>
                                <Icon type="fire" className="myblue pr-1" style={{ fontSize: "220%" }} theme="filled" />
                            </Col>
                            <Col span={22} className="pt-1">
                                {this.state.enteredRoom ?
                                    <h5 className="pl-1 d-inline-block">{this.state.currentRoom.roomName}</h5>
                                : <h5 className="pl-1 d-inline-block"> fireflow</h5>}
                                
                                <Icon style={{fontSize:"160%"}} 
                                onClick={()=>this.setState({showActionSheet:true})}
                                className="float-right p-1 pr-2 d-inline-block" type="menu" />
                            </Col>
                        </Row>
                    </div>
                    
                    {this.state.type !== "room" ? 
                        <div style={{ backgroundImage: "url(" + aa + ")", backgroundSize: "cover", backgroundPosition: "center" }}>
                            <Room toMain={() => this.setState({ type: "channel", currentRoom: {} })} roomInfo={this.state.currentRoom} />
                        </div>
                        : this.state.type === "channel" ? <Channel channelId={this.state.selChannelId} /> : <h1>Home</h1>}
                </Layout> 
                <Modal
                    title="Create Room"
                    centered
                    visible={this.state.openCreate}
                    footer={false}
                    onCancel={() => this.setState({ validateSatus: "", openCreate: false, rname: "", rcode: "" })}
                >
                    <Form.Item help={this.state.help} hasFeedback validateStatus={this.state.validateSatus}>
                        <Input value={this.state.rname} placeholder="Room Name" onChange={this.getRoomName} />
                    </Form.Item>
                    <Form.Item help=" will be used to enter room by others">
                        <Input value={this.state.rcode} placeholder="Room Code" id="warning2"
                            onChange={(value) => this.setState({ rcode: value.target.value })} />
                    </Form.Item>
                    <div className="pt3 tc">
                        <Button onClick={this.createRoom} type="primary" size="large">
                            Create
                            </Button>
                    </div>
                </Modal>
                <Modal
                    title="Join Room"
                    centered
                    visible={this.state.openJoin}
                    footer={false}
                    onCancel={() => this.setState({ joinCodeHelp: "", joinValidate: "", openJoin: false, searchQuery: "", jrcode: "" })}
                >
                    <AutoComplete
                        value={this.state.searchQuery}
                        style={{ width: "100%" }}
                        dataSource={this.state.data}
                        placeholder="Enter Room Name To Join"
                        filterOption={(inputValue, option) =>
                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onChange={this.searchRoom}
                        onSelect={(val) => this.setState({ searchQuery: val })}
                    />
                    <Form.Item validateStatus={this.state.joinValidate} help={this.state.joinCodeHelp} className="pt3">
                        <Input value={this.state.jrcode} placeholder="Room Code"
                            onChange={(value) => this.setState({ jrcode: value.target.value })} />
                    </Form.Item>
                    <div className=" tc">
                        <Button onClick={this.joinRoom} type="primary" size="large">
                            Join
                            </Button>
                    </div>
                </Modal>
                <Modal
                    title="Do you really want to leave this room?"
                    centered
                    visible={this.state.levOpen}
                    footer={false}
                    onCancel={() => this.setState({ levOpen: false })}
                >
                    <div className="f3 tc">
                        <Icon type="number" className="dib pr1" />
                        <span className="pl1 f3 pb3 fw6 dib black pr2">{this.state.currentRoom.roomName} </span>
                        <br></br>
                        <Button

                            onClick={() => this.setState({ levOpen: false })}
                            type="primary" shape="round" className=" ma1  mr2 " block>No</Button>
                        <br></br>
                        <Button type="danger" shape="round" loading={this.state.leaving}
                            onClick={() => {
                                this.leaveRoom();
                                this.setState({ levOpen: false });
                            }} className="  ma1 mr2" block>Yes</Button>

                    </div>
                </Modal>
                <Modal
                    title="Do you really want to Delete this room?"
                    centered
                    visible={this.state.delOpen}
                    footer={false}
                    onCancel={() => this.setState({ delOpen: false })}
                >
                    <div className="f3 tc">
                        <Icon type="number" className="dib pr1" />
                        <span className="pl1 f3 pb3 fw6 dib black pr2">{this.state.currentRoom.roomName} </span>
                        <br></br>
                        <Button
                            onClick={() => this.setState({ delOpen: false })}
                            type="primary" shape="round" className=" ma1  mr2 " block>No</Button>
                        <br></br>
                        <Button type="danger" shape="round" loading={this.state.leaving}
                            onClick={() => {
                                this.delRoom();
                                this.setState({ delOpen: false });
                            }} className="  ma1 mr2" block>Yes</Button>

                    </div>
                </Modal>
                <IonActionSheet
                    mode="ios"
                    isOpen={this.state.showActionSheet}
                    onDidDismiss={() => this.setState({showActionSheet:false})}
                    buttons={
                        this.state.enteredRoom ?
                            this.state.currentRoom.asAdmin ? 
                                [{
                                    text: 'Delete Room',
                                    handler: () => {
                                        console.log("asdasd")
                                        this.setState({ delOpen: true })
                                    }
                                }]:[{
                                    text: 'Leave Room',
                                    handler: () => {
                                        this.setState({ levOpen: true })
                                    }
                                }]
                                : [{
                                    text: 'Create Room',
                                    handler: () => {
                                        this.setState({ openCreate: true })
                                    }
                                },
                                {
                                text: 'Join Room',
                                handler: () => {
                                    this.setState({ openJoin: true })
                                
                                }
                            }
                            , {
                                    text: 'Logout',
                                    
                                    handler: () => {
                                        this.logout()
                                }
                            }] 
                    }
                >     
                </IonActionSheet>
            </div>   
        );
    }

}

export default withRouter(MainPage);
