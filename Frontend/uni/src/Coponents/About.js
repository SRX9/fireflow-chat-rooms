import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Text, Icon, Typography } from 'antd';
import aa from '../aa.png';
const { Content } = Layout;
const { Title,} = Typography;

function About(){
    return(
        <Layout className=" tc " style={{ height: "100vh" }}>
            <Content style={{ backgroundImage: "url(" + aa + ")", backgroundSize: "cover" }}>
                <h5 className="p-2 text-left">
                    <Link to="/" className="d-inline p-1"> {"<"} fireflow</Link>
                </h5>
                <div className="m-3">
                    <div className="pt4" >
                        <Icon type="fire" style={{ fontSize: "18vh" }} className="logo" theme="filled" />
                        <Title level={2} style={{ fontSize: "3vh" }} className="pa2 white" type="secondary">
                            <h2>About</h2>
                        </Title>
                    </div>
                    <section style={{fontWeight:"600"}}>
                        An Online Free, Quick and Instant Group Messaging Platform, Fully Anonymous and Secure.
                        Your Data is stored until you are on platform. Once you logout your data is erased
                        Permanately.
                    </section>
                    <Title level={4}  className="pa2 pt-4 " type="secondary">
                        Enjoy Private Talks and Discussion!
                    </Title>
                    
                </div>
                <div style={{ fontWeight: "600", fontSize: "2vh" }} class=" pb-2 text-left w-100 pl-2 fixed-bottom">
                    <span className="d-inline white text-left p-1"> Copyright @2020 SRx</span>
                </div>
            </Content>
        </Layout>

    )
}

export default About;