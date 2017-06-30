import React from 'react';
import { Button, Icon, Input, Form, Modal, message, Table } from 'antd';

import firebaseUtil from '../utils/firebaseUtil';

class AddAuthors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authorsDataSource: []
    }
  }

  onSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        firebaseUtil.writeAuthorWithImages(this.state.authorsDataSource, (err) => {
          if (!err) {
            this.props.onCancel()
            this.props.feedback('Authors Save Successful');
          }
        });
      }
    })
  }

  success(content) {
    message.success(content);
  }

  newAuthor() {
    var authorsDataSource = this.state.authorsDataSource;
    authorsDataSource.push({
      name: '',
    });
    this.setState({
      authorsDataSource,
    });
  }

  authorChangeHandler(index, event) {
    var authorsDataSource = this.state.authorsDataSource;
    authorsDataSource[index].name = event.target.value;
    this.setState({
      authorsDataSource,
    });
  }

  deleteAuthor(index) {
    var data = this.state.authorsDataSource;
    data.splice(index, 1);
    this.setState({ authorsDataSource: data });
    this.props.form.resetFields();
  }

  imageChangeHandler(index, event) {
    var authorsDataSource = this.state.authorsDataSource;
    authorsDataSource[index].image = document.getElementById('image_'+index).files[0];
    this.setState({
      authorsDataSource,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item
    var authorsDataSource = this.state.authorsDataSource.map((author, index) => {
      author['index'] = index;
      return author;
    });

    var addAuthorsColumns = [{
      title: 'Author',
      dataIndex: 'name',
      width: '55%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('name_'+index, {
              rules: [{ required: true, message: 'Please provide Author' }],
              initialValue: val,
          })(
              <Input type="text" id={"image_"+index}
                onChange={(event) => this.authorChangeHandler(index, event)}/>
          )}
          </FormItem>
        );
      },
    }, {
      title: 'Picture',
      dataIndex: 'image',
      width: '55%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('image_'+index, {
              rules: [{ required: true, message: 'Please provide Author' }],
              initialValue: val,
          })(
            <Input type="file" id='"image_"+index'
              onChange={(event) => this.imageChangeHandler(index, event)} />
          )}
          </FormItem>
        );
      },
    },{
      title: '',
      dataIndex: 'index',
      width: '10%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('delete_'+index,
          )(
              <Button onClick={() => this.deleteAuthor(index)}><Icon type="delete"/></Button>
          )}
          </FormItem>
        );
      },
    }];
    return (
      <Form>
        <Modal
          width={600}
          visible={true}
          maskClosable={false}
          title='Add Authors'
          footer={[
            <Button key="cancel" type="ghost" size="large"
              onClick={() => this.props.onCancel()}>
              Cancel
            </Button>,
            <Button key="okay" type="primary" size="large"
              onClick={() => this.onSubmit()}>
              Submit
            </Button>,
          ]}
          onCancel={() => this.props.onCancel()}
          >
          <Table dataSource={authorsDataSource} columns={addAuthorsColumns}
            pagination={false} bordered rowKey='index'/>
          <Button key="okay" type="primary" size="large"
            onClick={() => this.newAuthor()}
            style={{marginTop: '10px'}} >
            Add Row
          </Button>
        </Modal>
      </Form>
    )
  }
}

AddAuthors = Form.create({})(AddAuthors);
export default AddAuthors;
