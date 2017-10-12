import { Button, Col, Form, Input, message, Row } from 'antd';
import React from 'react';
import async from 'async';
import { sprintf } from 'sprintf-js';

import firebaseUtil from '../utils/firebaseUtil';
import { CustomRebase } from '../common/CustomRebase';

class  EditAuthor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authorId: this.props.match.params.authorId,
      author: ''
    }
  }

  componentWillMount() {
    firebaseUtil.fetchAuthor(this.state.authorId, (err, data) => {
      if (!err) {
        if (data.image) {
          var imageRef = CustomRebase.initializedApp.storage().refFromURL(data.image);
          imageRef.getDownloadURL().then((url) => {
            document.getElementById("current_image").src = url;
          }).catch((err) => {
            console.log(err);
          });
        }
        this.setState({
          author: data
        });
        this.props.form.setFieldsValue({
                  name: data.name,
        });
      } else {
        console.log(err);
      }
    })
  }

  handleSave() {
    function validateForm(callback) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        callback(err, values)
      })
    }

    function deleteOldImage(values, callback) {
      if (this.state.author.image) {
        var imageRef = CustomRebase.initializedApp.storage().refFromURL(this.state.author.image);
        imageRef.delete().then(() => {
          callback(null)
        }).catch((err) => {
          callback(err);
        });
      } else {
        callback(null);
      }
    }

    function uploadNewImage(callback) {
      var newImage = document.getElementById('new_image').files[0];
      var storageRef = CustomRebase.initializedApp.storage()
      var newImageRef = storageRef.ref().child('authors/' + newImage.name)
      var storageLink = sprintf('gs://%s/%s',newImageRef.location.bucket, newImageRef.location.path_)
      newImageRef.put(newImage).then((snapshot) => {
        callback(null, storageLink);
      });
    }

    function updateAuthor(storageLink, values, callback) {
      var author = {
        id: this.state.authorId,
        name: this.props.form.getFieldValue('name'),
        image: storageLink
      }
      firebaseUtil.updateAuthor(author, (err) => {
        if (!err) {
          this.success('Save successful')
          this.props.history.goBack();
        }
      })
    }

    async.waterfall([
      validateForm.bind(this),
      deleteOldImage.bind(this),
      uploadNewImage.bind(this),
      updateAuthor.bind(this)
    ], (err) => {
      if (err) {
        console.log(err);
      }
    })
  }

  success(content) {
    message.success(content);
  }

  handleCancel() {
    this.props.history.goBack();
  }

  handleDelete() {
    var imageRef = CustomRebase.initializedApp.storage().refFromURL(this.state.author.image);
    imageRef.delete().then(() => {
      firebaseUtil.removeAuthor(this.state.authorId, (err) => {
        if (!err) {
          this.props.history.goBack();
        } else {
          console.log(err);
        }
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Row>
          <Col span={16} offset={4} style={{backgroundColor: '#DCE7EB', marginTop: 20}}>
          <Form>
            <Row>
              <Col span={20} offset={2}>
                <FormItem
                  label='author'>
                  { getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Author is mandatory field' }]
                    }) (
                      <Input type="text" />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
                <img id="current_image" alt="" height="50" width="50" />
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
                <FormItem
                  label='New Image'>
                  { getFieldDecorator('new_image', {
                      rules: [{ required: true, message: 'Image is mandatory field' }]
                    }) (
                      <Input type="file" id="new_image" />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <FormItem>
                  <Button type="primary" size="large" onClick={() => this.handleCancel()}>Cancel</Button>
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem>
                  <Button type="primary" size="large" onClick={() => this.handleDelete()}>Delete</Button>
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <FormItem>
                  <Button type="primary" size="large" onClick={() => this.handleSave()}>Save</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

EditAuthor = Form.create({})(EditAuthor);
export default EditAuthor;
