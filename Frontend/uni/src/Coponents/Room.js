import React from 'react';
import { Layout, Menu, Icon, Divider,Row,Col, List, Avatar  , Input, Form, Button, Modal, message } from 'antd';
import './main.css';
import { css } from 'glamor';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';
import { Comment, Tooltip,} from 'antd';

const { Header, Sider, Content, Footer} = Layout;
const { TextArea } = Input;
const join = "!@#$%^&*(WERTY";
const leave = "&^%#@WDRT%$##WE";
const del ="!Q@S#D$F%G^H&J*K";
const typing="!QAS@EDCV#^YHG";
const profile ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHpPpXPopmgc9ACPVwSieiz8ZtmieRkCNAPuz8L5h4LvOEkNFnFQ";
const ROOT_CSS = css({
    height: "80vh",
    width: "100%",
});

class Room extends React.Component {
    constructor(props) {
        super(props);
        const temp=this.props.roomInfo;
        this.state = {
            val:"",
            admin: temp.admin,
            roomName: temp.roomName,
            rcode: temp.rcode,
            time: temp.time,
            rid: temp.rid,
            asAdmin: temp.asAdmin,
            user:temp.homeUser,
            users: [],
            disable:false,
            msg:[]
            
        }
    }
    componentWillMount()
    {
        axios({
            method: "post",
            url: "https://markx5.herokuapp.com/setUser"+this.state.rid,
            data: {
                user:this.state.user
            }
        }).then((res)=>{
            axios({
                method: "get",
                url: "https://markx5.herokuapp.com/iniusers" + this.state.rid
            }).then((res) => {
                this.setState({users:res.data});
            });
        });
    }
    async componentDidMount() {
        try {
             setInterval(async () => {
                     axios
                         .get("https://markx5.herokuapp.com/getmsg" + this.state.rid, {
                             params: {
                                 user: this.state.user
                             }
                         })
                         .then(res => {
                             if (res.data[0]!==undefined && res.data[0].msg ===join)
                             {
                                 var temp=this.state.users;
                                 temp.push({user:res.data[0].user});
                                 var msgTemp=this.state.msg;
                                 msgTemp.push({
                                     msg: "Joined the Room.",
                                     user: res.data[0].user,
                                     time: res.data[0].time,
                                     d: 2})
                                 this.setState({users:temp,msg:msgTemp});
                                 
                             }
                             else if (res.data[0] !== undefined && res.data[0].msg === leave)
                             {
                                 var temp = this.state.users;
                                 let leaver=res.data[0].user;
                                 let t=[]
                                 for(let i=0;i<temp.length;i++)
                                 {
                                    if(temp[i].user!==leaver)
                                    {
                                        t.push(temp[i]);
                                    }
                                 }
                                 var msgTemp = this.state.msg;
                                 msgTemp.push({
                                     msg: "Left the Room.",
                                     user: res.data[0].user,
                                     time: res.data[0].time,
                                     d: 3
                                 })
                                 this.setState({ users: t ,msg:msgTemp});
                             }
                             else if (res.data[0] !== undefined && res.data[0].msg === del) {
                                 var msgTemp = this.state.msg;
                                 msgTemp.push({
                                     msg: "Admin Deleted this Room.",
                                     user: res.data[0].user,
                                     time: res.data[0].time,
                                     d: 4
                                 })
                                 this.setState({ msg: msgTemp },()=>{
                                     this.setState({disable:true});
                                     if(this.state.asAdmin)
                                     {
                                         this.props.toMain();
                                     }
                                 });
                             }
                             else if (res.data[0] !== undefined && res.data[0].msg === typing)
                             {
                             }
                             else{
                                 if (res.data[0] !== undefined )
                                 {
                                     var msgTemp = this.state.msg;
                                     msgTemp.push({
                                         msg: res.data[0].msg,
                                         user: res.data[0].user,
                                         time: res.data[0].time,
                                         d: 0
                                     })
                                     this.setState({ msg: msgTemp }); 
                                 }
                             }
                         });
             }, 1000);
         } catch (e) {
             console.log(e+"Unexpected Error Vala Unexpected Error ");
         }
    }
    
    sendmsg=(val)=>{
        if (val.target.value.replace(/(\r\n|\n|\r)/gm, "")==="")
        {
            this.setState({val:""});
            return;
        }
        this.setState({val:val.target.value},()=>{
            var temp=this.state.msg;
            var mani=this.state.val.split("\n");
            var s="";
            let l=mani.length;
            if (mani[0] === "")
            {
                for (let i = 1; i < l; i++) {
                    if(i===l-1)
                    {
                        s = s + mani[i]
                    }
                    else{
                        s = s + mani[i] + "\n"
                    }
                }
                
            }else{
                s=this.state.val;
            }
            var lola=new Date();
            var time=lola.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            })
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/sendmsg"+this.state.rid,
                data: {
                    user:this.state.user,
                    msg:s,
                    time:time,
                }
            })
            temp.push({ msg: s, user:"You", time: time, d: 1 });
            this.setState({ msg: temp })
            this.setState({ val: "" })

        })
    }

    render() {
        return (
            <div>
                <Layout style={{ height: "100vh" }} className="msg full">
                    <Row>
                        <Col span={20}>
                            <Content
                                style={{
                                    margin: '16px 16px',
                                    background: '#fff',
                                    height: "80vh",
                                    borderRadius: "10px"
                                }}
                            >
                                <List
                                    itemLayout="horizontal"
                                    className="listo"
                                    dataSource={this.state.msg}
                                    style={{ height: "80vh", overflowY: "hidden", overflowX: "hidden" }}
                                    renderItem={item => <ScrollToBottom className={ROOT_CSS + " listo a"}>
                                        {this.state.msg.map((item, index) =>
                                            item.d === 0 ?
                                                <List.Item className=" gbox" >
                                                    <List.Item.Meta
                                                        avatar={<Avatar size="large" src={profile} />}
                                                        title={<div className="f5 fw6  white" style={{ whiteSpace: "pre-line" }}>
                                                            <p className="myblue br-pill f4 fl  pa2 pl3 pr3 bg-white">{item.user}</p>
                                                            <p className="msgpad tl black">{item.msg}</p>
                                                        </div>}
                                                        description={<span className="fw4 gray">{item.time}</span>}

                                                    />
                                                </List.Item>
                                                : item.d === 2 ?
                                                    <List.Item className="  jbox" >
                                                        <List.Item.Meta
                                                            avatar={<Avatar size="large" src={profile} />}
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span>{" " + item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> : item.d === 3 ? <List.Item className="  lbox" >
                                                        <List.Item.Meta
                                                            avatar={<Avatar size="large" src={profile} />}
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span><br></br>{" " + item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> : item.d === 4 ? <List.Item className=" lbox" >
                                                        <List.Item.Meta
                                                            avatar={<Avatar size="large" src={profile} />}
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span><br></br> {item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> :
                                                            <List.Item className=" mbox" >
                                                                <List.Item.Meta
                                                                    avatar={<Avatar size="large" src={profile} />}
                                                                    title={<div className="f5 fw6  white" style={{ whiteSpace: "pre-line" }}>
                                                                        <p className="myblue br-pill f4 fl  pa2 pl3 pr3 bg-white">You</p>
                                                                        <p className="msgpad tl ">{item.msg}</p>
                                                                    </div>}
                                                                    description={<span className="fw4 light-gray">{item.time}</span>}
                                                                />
                                                            </List.Item>
                                        )
                                        }
                                    </ScrollToBottom>
                                    } />
                            </Content>
                        </Col>
                        <Col span={3} className="ml-3">
                            <Content
                                style={{
                                    marginTop: "16px",
                                    marginRight: "16px",
                                    marginBottom: "16px",
                                    marginLeft: "-16px",
                                    background: '#fff',
                                    height: "80vh",
                                    borderRadius: "10px"
                                }}
                            >
                                <div className="listo" style={{ overflowX: "hidden", overflowY: "auto", height: "80vh" }}>
                                    <List
                                        header={<span className="f3  fw4 pl3 black-60"><Icon type="team" className="f3 myblue" /> Members
                                        <span className=" f5 fr fw4 b--mid-gray pt2 pr3 fr">
                                                <span className="fw6 f4 pb1 gray">{this.state.users.length}</span></span>
                                        </span>}
                                        itemLayout="horizontal"
                                        dataSource={this.state.users}
                                        renderItem={item => (
                                            <List.Item className="pl3 ">
                                                <List.Item.Meta
                                                    avatar={<Icon style={{ fontSize: "3vh" }} type="user" />}
                                                    title={<span className="f5">{item.user}<Icon className="fr pr3 green" style={{ fontSize: "3vh" }} type="wifi" /></span>}
                                                    description={""/*<Loader
                                                    type="ThreeDots"
                                                    color="#00BFFF"
                                                    height={30}
                                                    width={30}
                                                    visible={item.typing}
                                                />*/}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </Content>
                        </Col>
                    </Row>
                    <Footer className="foot" style={{ padding: "13px", paddingTop: "24px", height: "10vh", background: '#fff' }}>
                        <TextArea
                            className="black listo msg"
                            disabled={this.state.disable}
                            placeholder="Typer here..."
                            spellCheck={false}
                            onChange={(val) => {
                                this.setState({ val: val.target.value });
                            }}
                            value={this.state.val}
                            onPressEnter={this.sendmsg}
                            style={{ fontSize: "2.6vh", resize: "none", border: "none", width: "100%", borderRadius: "18px" }}
                            rows={1}

                        />
                    </Footer>

                </Layout>
                <Layout style={{ height: "80vh",overflow:"hidden" }} className="msg mob">
                    <Content
                                style={{
                                    background: '#fff',
                                }}
                            >
                                <List
                                    itemLayout="horizontal"
                                    className="listo"
                                    dataSource={this.state.msg}
                                    style={{ height: "80vh", overflowY: "hidden", overflowX: "hidden" }}
                                    renderItem={item => <ScrollToBottom className={ROOT_CSS + " listo a"}>
                                        {this.state.msg.map((item, index) =>
                                            item.d === 0 ?
                                                <List.Item className=" gbox" >
                                                    <List.Item.Meta
                                                        title={<div className="f5 fw6  white" style={{ whiteSpace: "pre-line" }}>
                                                            <p className="myblue br-pill f4 fl  pa2 pl3 pr3 bg-white">{item.user}</p>
                                                            <p className="msgpad tl black">{item.time}</p>
                                                        </div>}
                                                        description={<span className="fw4 gray">{item.msg}</span>}

                                                    />
                                                </List.Item>
                                                : item.d === 2 ?
                                                    <List.Item className="  jbox" >
                                                        <List.Item.Meta
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span>{" " + item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> : item.d === 3 ? <List.Item className="  lbox" >
                                                        <List.Item.Meta
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span><br></br>{" " + item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> : item.d === 4 ? <List.Item className=" lbox" >
                                                        <List.Item.Meta
                                                            title={<span className="f5 fw6  black" style={{ whiteSpace: "pre-line" }}><span className="myblue f4 ">{item.user}</span><br></br> {item.msg}</span>}
                                                            description={item.time}
                                                        />
                                                    </List.Item> :
                                                            <List.Item className=" mbox" >
                                                                <List.Item.Meta
                                                                    title={<div className="f5 fw6  white" style={{ whiteSpace: "pre-line" }}>
                                                                        <p className="myblue br-pill f4 fl  pa2 pl3 pr3 bg-white">You</p>
                                                                        <p className="msgpad tl ">{item.msg}</p>
                                                                    </div>}
                                                                    description={<span className="fw4 light-gray">{item.time}</span>}
                                                                />
                                                            </List.Item>
                                        )
                                        }
                                    </ScrollToBottom>
                                    } />
                            </Content>

                        <TextArea
                        className="fixed-bottom"
                            disabled={this.state.disable}
                            placeholder="Typer here..."
                            spellCheck={false}
                            onChange={(val) => {
                                this.setState({ val: val.target.value });
                            }}
                            value={this.state.val}
                            onPressEnter={this.sendmsg}
                            style={{ fontSize: "2.6vh", resize: "none", border: "none", width: "100%", borderRadius: "18px" }}
                            rows={1}

                        />

                </Layout>

            </div>
       );
    }
}

export default Room;