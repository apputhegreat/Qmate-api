import { Button, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import * as _ from 'lodash';

import firebaseUtil from '../utils/firebaseUtil';
import { CustomRebase } from '../common/CustomRebase';


class  EditQuote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quoteId: this.props.match.params.quoteId,
      quote: '',
      tags: [],
      authors: []
    }
  }

  componentWillMount() {
    firebaseUtil.fetchTags((err, tags) => {
      if (!err) {
        this.setState({ tags });
      }
    });

    this.authorsRef = CustomRebase.listenTo('authors', {
      context: this,
      asArray: true,
      then(authors) {
        this.setState({ authors })
      },
      onFailure(err) {
        console.log(err);
      }
    });

    firebaseUtil.fetchQuote(this.state.quoteId, (err, quote) => {
      this.props.form.setFieldsValue({
                text: quote.text,
                tags: quote.tags,
                authorId: quote.authorId
      });
    })
  }

  handleSave() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        var author = _.find(this.state.authors, (author) => {
          return author.id === values.authorId;
        });
        var quote = {
          id: this.state.quoteId,
          text: values.text,
          authorId: values.authorId,
          tags: values.tags
        }
        if (author) {
          quote['author'] = author.name;
        }
       firebaseUtil.updateQuote(quote, (err) => {
         if (!err) {
           var allTags = _.union(this.state.tags, quote.tags)
           firebaseUtil.setTags(allTags, (err) => {
             if (!err) {
               this.props.history.goBack();
             }
           })
         }
       })
      }
    });
  }

  handleCancel() {
    this.props.history.goBack();
  }

  handleDelete() {
    firebaseUtil.removeQuote(this.state.quoteId, (err) => {
      if (!err) {
        this.props.history.goBack();
      } else {
        console.log(err);
      }
    })
  }

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const tagsComponent = this.state.tags.map((tag, index) => {
      return (
        <Option key={tag} value={tag}>{tag}</Option>
      );
    })

    const authorsComponent = this.state.authors.map((author, index) => {
      return (
        <Option key={author.id} value={author.id}>{author.name}</Option>
      );
    })
    return (
      <div>
        <Row>
          <Col span={16} offset={4} style={{backgroundColor: '#DCE7EB', marginTop: 20}}>
          <Form>
            <Row>
              <Col span={20} offset={2}>
                <FormItem
                  label='Quote'>
                  { getFieldDecorator('text', {
                      rules: [{ required: true, message: 'Quote is mandatory field' }]
                    }) (
                      <Input type="textarea" />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
                <FormItem
                  label='Author'>
                  { getFieldDecorator('authorId', {
                    }) (
                      <Select
                        placeholder="Select a author">
                        {authorsComponent}
                      </Select>
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
                      {tagsComponent}
                    </Select>
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

EditQuote = Form.create({})(EditQuote);
export default EditQuote;
