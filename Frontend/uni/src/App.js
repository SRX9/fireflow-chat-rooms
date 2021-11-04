import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import MainPage from './Coponents/MainPage';
import 'tachyons';
import '@ionic/react/css/core.css';
import MediaQuery from 'react-responsive';
import { Route} from 'react-router-dom';
import Home from './Coponents/Home';
import mobile from ".././src/bb.png";
import About from './Coponents/About';
class App extends React.Component
{

  state={
    homeUser:""
  }

  setHomeUser=(val)=>{
    this.setState({homeUser:val});
  }

  render()
  {
    return(

            <div className="" style={{overflowX:"hidden"}}>
              <Route path="/main" render={()=>{
                return <MainPage  homeUser={this.state.homeUser} />
              }}>
              </Route>
              <Route exact path="/" render={() => {
                return <Home getHomeUser={this.setHomeUser}/>
              }}>
              </Route>
              <Route exact path="/about" render={() => {
                return <About/>
              }}>
              </Route>
            </div>
    );
  }

}
  
export default App;
