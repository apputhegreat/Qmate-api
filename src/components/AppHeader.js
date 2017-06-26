import React from 'react';
import { Menu } from 'antd';
import { CustomRebase } from '../common/CustomRebase';

class AppHeader extends React.Component {
  handleSignout() {
    CustomRebase.initializedApp.auth().signOut();
    this.props.history.push('/login');
  }

  handleQuoteList() {
    this.props.history.push('/quotelist');
  }

  render() {
    return (
      <Menu theme="dark" mode="horizontal"
         defaultSelectedKeys={['1','2','3']} style={{lineHeight: '64px', backgroundColor: '#05A4DE'}}>
        <Menu.Item key="1" style={{ width: '40%' }}>
          <a href="/" style={{ color: 'white', fontSize: '26px' }}>Qmate</a>
        </Menu.Item>
        <Menu style={{ float: 'right' , marginTop: 10, fontSize: '26px', backgroundColor: '#05A4DE', borderColor : '#05A4DE'}} theme="dark" mode="horizontal">
          <Menu.Item key="2">
            <a href="/quotelist">
            <button type='button' className='btn btn-primary'
              style={{backgroundColor: '#05A4DE', borderColor: '#05A4DE', borderWidth: 0}}
              >Quote List</button></a>
          </Menu.Item>
          <Menu.Item key="3">
            <button type='button' className='btn btn-primary'
              style={{backgroundColor: '#05A4DE', borderColor: '#05A4DE', borderWidth: 0}}
              onClick={() => this.handleSignout()}>Logout</button>
          </Menu.Item>
        </Menu>
      </Menu>
    )
  }
}

export default AppHeader;
