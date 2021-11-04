import React from 'react';
import './main.css';
import { withRouter, Router,Link } from 'react-router-dom';
import axios from 'axios';
import MediaQuery from 'react-responsive';
import { Form, Icon, Input, Button, Typography, Layout, message } from 'antd';
import { Row, Col } from 'react-flexbox-grid';
import aa from '../aa.png';
import aa1 from '../mob.png';
const { Content } = Layout;
const { Title, Text } = Typography;

class Home extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            mobdisable:true,
            loading: false,
            Validate: "",
            help: "",
            homeUser: ""
        }
    }
    componentDidMount() {
        if (localStorage.getItem("aqs") !== null) {
            this.props.history.push('/main')
        }
    }
    enter = () => {
        if (this.state.homeUser === "") {
            message.warning('Please enter your Display Name!', 3);
            return;
        }
        else if (this.state.Validate === "error") {
            message.warning(' Specified Username already taken!', 3);
            return;
        }
        this.setState({ loading: true });
        var time = new Date();
        var creationtime = time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
        axios({
            method: "post",
            url: "https://markx5.herokuapp.com/setUniUser",
            data: {
                user: this.state.homeUser,
                time: creationtime
            }
        }).then((res) => {
            if (res.data) {
                localStorage.setItem("aqs", this.state.homeUser);
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push('/main');
                })
            }
            else {
                this.setState({
                    loading: false
                }, () => {
                    message.info('Too much Traffic.Try Again!', 3);
                })
            }
        });

    }

    serachRoom = (val) => {
        this.setState({ Validate: "validating", mobdisable:true });
        let valu = val.target.value;
        this.setState({ homeUser: valu }, async () => {
            this.props.getHomeUser(valu);
            axios.get('https://markx5.herokuapp.com/searchUser?q=' + this.state.homeUser)
                .then((response) => {
                    if (!response.data) {
                        this.setState({ Validate: "success", help: "", mobdisable:false, });
                    } else {
                        this.setState({ Validate: "error", help: "Display Name currently in use!", 
                        mobdisable:false });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    render() {
        return (
            <MediaQuery minDeviceWidth={800} >
                {(matches) =>
                    matches
                        ? <Layout className="" style={{ height: "100vh" }}>
                            <Content style={{ backgroundImage: "url(" + aa + ")", backgroundSize: "cover", backgroundPosition: "center" }}>
                                <span className="f3 pt4 shadow-1 pa3 br-pill pl3 gray fw6" style={{ fontSize: "3vh" }}>Chat on go!</span>
                                <Row center="xs" className="cen">
                                    <Col xs={4} >
                                    </Col>
                                    <Col xs={2} className="tr">
                                        <div className="dib v-mid tc pt5 pr4" >
                                            <Icon type="fire" style={{ fontSize: "18vh" }} className="logo" theme="filled" />
                                            <Title level={2} style={{ fontSize: "3vh" }} className="pa2 white" type="secondary">
                                                <span className="gray">fireflow</span>
                                            </Title>
                                        </div>
                                    </Col>
                                    <Col xs={2} className="tl pl4 pt4" style={{ width: "50vw" }} >
                                        <Title level={2}>Enter Display Name for Chat.</Title>
                                        <Text className=" f6 gray">Your Info Will be Erased as soon as you logout.</Text>
                                        <Form className="dib tl  v-mid login-form " style={{ width: "20vw", fontSize: "3vh" }}  >
                                            <Form.Item hasFeedback help={this.state.help} validateStatus={this.state.Validate}>
                                                <Input
                                                    spellCheck={false}
                                                    prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="Set Username"
                                                    onChange={this.serachRoom}
                                                    maxLength={20}
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button loading={this.state.loading} disabled={this.state.mobdisable} type="primary"
                                                    onClick={this.enter} className="w-30">
                                                    Enter
                                    </Button>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                    <Col xs={4} />
                                </Row>
                                <span className="f5 pb-1 pr-2 text-right text-dark  fixed-bottom">
                                    <Link to="/about" className="d-inline text-dark p-1">About </Link>
                                    <span className="p-1 gray">&bull;</span>
                                    <Link className="d-inline text-dark p-1">Policy</Link>
                                    <span className="p-1 pr-2 gray">&bull;</span>
                                    Copyright @2020 fireflow <span className="p-1 gray">&bull;</span> <span style={{ fontWeight: "600" }}>SRx</span>.</span>
                            </Content>
                        </Layout> : 
                        <Layout className=" tc " style={{ height: "100vh" }}>
                            <Content style={{ backgroundImage: "url(" + aa1 + ")", 
                            backgroundSize: "cover"  ,backgroundPosition:"center"}}>
                                <div className="gray" >
                                    <h6 style={{ fontSize: "100%",borderRadius:"0px 0px 30px 30px" }} 
                                    className=" bg-primary white shadow-5 mr-5 ml-5 p-2">Enjoy Anonymous and Secret Chatting.</h6>
                                </div>
                                <div className="pt4" >
                                    <Icon type="fire" style={{ fontSize: "18vh" }} className="logo" theme="filled" />
                                    <Title level={2}  className="pa2 dark" >
                                        fireflow
                                    </Title>
                                </div>
                                <Title level={4} type="secondary">Enter Display Name.</Title>
                                <Text className=" f6 gray">Your Info Will be Erased as soon as you logout.</Text>
                                <Form className=" tc" style={{  fontSize: "3vh" }}  >
                                            <Form.Item hasFeedback help={this.state.help} validateStatus={this.state.Validate}>
                                                <Input
                                                className="w-75"
                                                    spellCheck={false}
                                                    prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="Set Username"
                                                    maxLength={20}
                                                    onChange={this.serachRoom}
                                                />
                                            </Form.Item>
                                                <Button loading={this.state.loading} disabled={this.state.mobdisable}  type="primary"
                                                    onClick={this.enter} className="btn-primary">
                                                    Enter
                                                </Button>
                                    <div style={{ fontWeight: "600",fontSize:"2vh" }} 
                                    class="d-flex pt-3 justify-content-center">
                                        <Link to="/about" className="d-inline p-1">About </Link>
                                        <span className="p-1 gray">&bull;</span>
                                        <Link className="d-inline p-1">Policy</Link>
                                    </div>
                                        </Form>
                                <div style={{fontWeight:"600",fontSize:"2vh"}} class=" pb-2 text-left w-100 pl-2 fixed-bottom">
                                    <span className="d-inline white text-left p-1"> Copyright @2020 SRx</span>
                                </div>
                            </Content>
                        </Layout>
                }
            </MediaQuery>
        );
    }
}

export default withRouter(Home);