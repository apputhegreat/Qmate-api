import { Button, Form, Input } from 'antd';
import React from 'react';

import '../common/styles.css';
import * as AuthUtil from '../utils/AuthUtil';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      isLoginFailed: false,
      errMessage: '',
    };
  }

  handleEmailSignin() {
    this.props.form.validateFieldsAndScroll((err, userObj) => {
      if (!err) {
        AuthUtil.authenticatePassword(userObj.username, userObj.password, (err) => {
          if (err) {
            var errMessage;
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
              errMessage = 'User not found, please check the Email Address and try again.';
            } else if (err.code === 'auth/wrong-password') {
              errMessage = 'The password is incorrect, please check the Password and try again.';
            } else {
              errMessage = 'Please check the Email Address and Password';
            }
            this.setState({
              errMessage,
              isLoginFailed: true,
            });
            return;
        }
        this.props.history.push('/');
        })
      }
    })
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    var err = null;
    if (this.state.isLoginFailed) {
      err = <label style={{color: 'red'}}>{this.state.errMessage}</label>
    }

    return (
      <div className="login-container">
        {err}
        <Form>
          <FormItem>
          { getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please enter Email Address' } ]
          })(
            <div>
              <Input placeholder="Username"/>
            </div>
          )}
          </FormItem>
          <FormItem>
          { getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please enter Password' } ]
          })(
            <div>
              <Input type="password" placeholder="Password" onPressEnter={() => this.handleEmailSignin()}/>
            </div>
          )}
          </FormItem>
        </Form>
        <Button type='primary' style={{width: '100%'}}
          onClick={() => this.handleEmailSignin()}>Login</Button>
      </div>
    );
  }
}

Login = Form.create({})(Login);
export default (Login);
