import React from 'react';
import MediaQuery from 'react-responsive';
import { Layout, Menu, Icon, Divider, Input, Form, Button, Modal, message } from 'antd';
import './main.css';
import Main from '../main.png';
const { Header, Sider, Content } = Layout;

class Channel extends React.Component
{
    constructor(props)
    {
        super(props);
            this.state={

        }
    }

    render()
    {
        return(
            <Layout style={{ height: "100vh" }}>
                    <Content
                        style={{
                        height: "500px",
                        backgroundImage:"url("+Main+")",
                            padding: 24,    
                            backgroundSize:"cover",

                        }}
                    >
                </Content>
            </Layout>
        );
    }
}

export default Channel;