import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

import firebaseUtil from '../utils/firebaseUtil'

class  EditQuote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: '',
      tags: [],
      authorName: '',
      authorImage: ''
    }
  }

  handleSubmit() {
    var isFormValid = false
    this.props.form.validateFieldsAndScroll(['quote', 'tags'],(err, formObj) => {
      if(err){
        isFormValid = false;
        return
      }
      var authorName = this.props.form.getFieldValue('existingAuthor');
      if ( authorName == undefined || authorName === 'select') {
        this.props.form.validateFieldsAndScroll(['newAuthor'], (err, values) => {
          if (!err) {
            authorName = values.newAuthor
          }
        })
      }
      var quotes = [{
        text: formObj.quote,
        author: authorName,
        likes: 0,
        shares: 0,
        moodCodes: [1,2]
      }]
      firebaseUtil.writeQuotes(quotes, function(err) {
        console.log('err', err);
      })
    })
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    return (
      <div>
        <Row>
          <Col span={16} offset={4} style={{backgroundColor: '#DCE7EB', marginTop: 20}}>
          <Form>
            <Row>
              <Col span={20} offset={2}>
                <FormItem
                  label='Quote'>
                  { getFieldDecorator('quote', {
                      rules: [{ required: true, message: 'Quote is mandatory field' }]
                    }) (
                      <Input type="textarea" />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={9} offset={2}>
                <FormItem
                  label='Author'>
                  { getFieldDecorator('existingAuthor', {
                    }) (
                      <Select
                        placeholder="Select a author">
                        <Option value="select">Select Options</Option>
                        <Option value="Mahatma Gandhi">Mahatma Gandhi</Option>
                        <Option value="Oscar Wilde">Oscar Wilde</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={9} offset={2}>
                <FormItem
                  label='Author'>
                  { getFieldDecorator('newAuthor', {
                      rules: [{ required: true, message: 'Author is mandatory field' }]
                    }) (
                      <Input/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
              <FormItem
                label='Tags'>
                { getFieldDecorator('tags', {
                    rules: [{ required: true, message: 'Tags is mandatory field' }]
                  }) (
                    <Select
                      mode="tags"
                      placeholder="Select a option and change input text above">
                      <Option value="Inspirational">Inspirational</Option>
                      <Option value="Motivational">Motivational</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem>
                <Button type="primary" size="large" onClick={() => this.handleSubmit()}>Submit</Button>
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

EditQuote = Form.create({})(EditQuote);
export default EditQuote;
