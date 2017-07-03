import React from 'react';
import { Menu, message } from 'antd';

import { CustomRebase } from '../common/CustomRebase';
import AddAuthors from './AddAuthors';

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorsModelVisible: false
    }
  }
  handleSignout() {
    CustomRebase.initializedApp.auth().signOut();
    this.props.history.push('/login');
  }

  handleQuoteList() {
    this.props.history.push('/quotelist');
  }

  onCloseAuthorsModel() {
    this.setState({
      authorsModelVisible: false
    })
  }

  onClickAddAuthors() {
    this.setState({
      authorsModelVisible: true
    })
  }

  success(content) {
    message.success(content);
  }

  render() {
    var authorsModel = null;
    if (this.state.authorsModelVisible) {
      authorsModel = (
        <AddAuthors onCancel={() => this.onCloseAuthorsModel()}
          feedback={(content) => this.success(content)}/>
      )
    }

    return (
      <Menu theme="dark" mode="horizontal"
         defaultSelectedKeys={['1','2','3','4','5']} style={{lineHeight: '64px', backgroundColor: '#05A4DE'}}>
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
              onClick={() => this.onClickAddAuthors()}>Add Authors</button>
          </Menu.Item>
          <Menu.Item key="4">
            <a href="/authorslist">
            <button type='button' className='btn btn-primary'
              style={{backgroundColor: '#05A4DE', borderColor: '#05A4DE', borderWidth: 0}}
              >Authors List</button></a>
          </Menu.Item>
          <Menu.Item key="5">
            <button type='button' className='btn btn-primary'
              style={{backgroundColor: '#05A4DE', borderColor: '#05A4DE', borderWidth: 0}}
              onClick={() => this.handleSignout()}>Logout</button>
          </Menu.Item>
        </Menu>
        {authorsModel}
      </Menu>
    )
  }
}

export default AppHeader;
