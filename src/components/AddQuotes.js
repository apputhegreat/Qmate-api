import React from 'react';
import { Button, Col, Form, Input, Icon, message, Row, Select, Table } from 'antd';
import * as _ from 'lodash'

import firebaseUtil from '../utils/firebaseUtil';
import '../common/styles.css';
import { CustomRebase } from '../common/CustomRebase'

class AddQuotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quotesDataSource : [],
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
  }

  newQuote() {
    var quotesDataSource = this.state.quotesDataSource;
    quotesDataSource.push({
      text: '',
      authorId: '',
      tags: []
    });
    this.setState({
      quotesDataSource,
    });
  }

  quoteChangeHandler(index, event) {
    var quotesDataSource = this.state.quotesDataSource;
    quotesDataSource[index].text = event.target.value;
    this.setState({
      quotesDataSource,
    });
  }

  authorChangeHandler(index, value) {
    var quotesDataSource = this.state.quotesDataSource;
    quotesDataSource[index].authorId = value;
    this.setState({
      quotesDataSource,
    });
  }

  tagsChangeHandler(index, values) {
    var quotesDataSource = this.state.quotesDataSource;
    quotesDataSource[index].tags = values;
    this.setState({
      quotesDataSource,
    });
  }

  deleteQuote(index) {
    var data = this.state.quotesDataSource;
    data.splice(index, 1);
    this.setState({ quotesDataSource: data });
    this.props.form.resetFields();
  }

  resetQuotes() {
    this.setState({
      quotesDataSource: []
    })
  }

  submitQuotes() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        var newTags = []
        var quotes = _.map(this.state.quotesDataSource, (quote) => {
          delete quote.index;
          var authorObj = _.find(this.state.authors, { 'id': quote.authorId })
          var tags = _.difference(quote.tags, this.state.tags)
          newTags.push(...tags);
          return {
            text : quote.text,
            authorId: quote.authorId,
            author: authorObj['name'],
            tags: quote.tags
          };
        })
        firebaseUtil.writeQuotes(quotes, (err) => {
          if (!err) {
            var allTags = _.union(this.state.tags, newTags)
            firebaseUtil.setTags(allTags, (err) => {
              if (!err) {
                this.success('Save Successful');
                this.resetQuotes();
              }
            })
          }
        })
      }
    });
  }

  success(content) {
    message.success(content);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item
    const Option = Select.Option
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
    var quotesDataSource = this.state.quotesDataSource.map((quote, index) => {
      quote['index'] = index;
      return quote;
    });
    var addQuotesColumns = [{
      title: 'Quote',
      dataIndex: 'text',
      width: '55%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('text_'+index, {
              rules: [{ required: true, message: 'Please provide Quote' }],
              initialValue: val,
          })(
              <Input type="textarea" autosize
                onChange={(event) => this.quoteChangeHandler(index, event)}/>
          )}
          </FormItem>
        );
      },
    }, {
      title: 'Author',
      dataIndex: 'authorId',
      width: '15%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('author_'+index, {
              rules: [{ required: true, message: 'Provide Author' }],
              initialValue: val,
          })(
            <Select onSelect={(value) => this.authorChangeHandler(index, value)}
              placeholder="Select a author">
              {authorsComponent}
            </Select>
          )}
          </FormItem>
        )
      },
    }, {
      title: 'Tags',
      dataIndex: 'tags',
      width: '30%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('tags_'+index, {
              rules: [{ required: true, message: 'Provide Tags' }],
              initialValue: val,
          })(
            <Select onChange={(values) => this.tagsChangeHandler(index, values)}
              mode="tags"
              placeholder="Select a option">
              {tagsComponent}
            </Select>
          )}
          </FormItem>
        )
      },
    }, {
      title: '',
      dataIndex: 'index',
      width: '10%',
      render: (val, record, index) => {
        return (
          <FormItem>
          { getFieldDecorator('delete_'+index,
          )(
              <Button onClick={() => this.deleteQuote(index)}><Icon type="delete"/></Button>
          )}
          </FormItem>
        );
      },
    }];

    return (
      <div>
        <div className="addquotes-container">
          <Form>
            <Table dataSource={quotesDataSource} columns={addQuotesColumns}
                pagination={false} bordered rowKey='index'/>
            <Button key="okay" type="default" size="large"
              onClick={() => this.newQuote()}
              style={{marginTop: '10px', float: 'left'}} icon="plus-circle">
              Add Row
            </Button>
          </Form>
        </div>
        <Row>
          <Col span={4} offset={6}>
            <Button key="okay" type="primary" size="large"
              onClick={() => this.resetQuotes()}
              style={{width: '100%'}}>
              Reset
            </Button>
          </Col>
          <Col span={4} offset={4}>
            <Button key="okay" type="primary" size="large"
              onClick={() => this.submitQuotes()}
              style={{width: '100%'}}>
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

AddQuotes = Form.create({})(AddQuotes);
export default AddQuotes;
