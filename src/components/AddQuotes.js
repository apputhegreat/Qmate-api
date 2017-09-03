import React from 'react';
import { Button, Col, Form, Input, Icon, message, Row, Select, Table } from 'antd';
import * as _ from 'lodash'

import firebaseUtil from '../utils/firebaseUtil';
import '../common/styles.css';
import { CustomRebase } from '../common/CustomRebase'
import Trends from './Trends';

class AddQuotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quotesDataSource : [],
      tags: [],
      authors: [],
      trendingAuthors: [],
      trendingTags: [],
      showTrendsModal: false,
      quoteOfTheDay: {}
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

  componentDidMount() {
    this.trendsRef = CustomRebase.listenTo('trending', {
      context: this,
      then(trends) {
        var trendingAuthors = []
        _.map(trends.authors, (authorValue, index) => {
          var matchAuthor = _.find(this.state.authors, { id: authorValue})
          if (matchAuthor) {
            trendingAuthors.push({
              index,
              id: matchAuthor.id,
              name: matchAuthor.name
            })
          }
        })
        var trendingTags = _.map(trends.tags, (value, index) => {
          return {
            tag: value,
            index
          }
        })
        this.setState({
          trendingAuthors,
          trendingTags
        })
      },
      onFailure(err) {
        console.log(err);
      }
    });

    this.trendsRef = CustomRebase.listenTo('quoteOftheDay', {
      context: this,
      then(quoteOfDay) {
        firebaseUtil.fetchQuotes((err, data) => {
          var dayquote = _.find(data, { id: quoteOfDay.id})
          console.log('quote->', dayquote)
          if (dayquote) {
            this.setState({
              quoteOfTheDay: dayquote
            })
          }
        })
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

  editTrends() {
    this.setState({ showTrendsModal: true })
  }

  onCancel() {
    this.setState({ showTrendsModal: false })
  }

  onSubmitTrends(values) {
    var trendingAuthors = [];
    _.map(values.trend_authors, (authorValue, index) => {
      var matchAuthor = _.find(this.state.authors, { id: authorValue})
      if (matchAuthor) {
        trendingAuthors.push({
          index,
          id: matchAuthor.id,
          name: matchAuthor.name
        })
      }
    })
    var trendingTags = _.map(values.trend_tags, (tag, index) => {
      return {
        tag,
        index
      }
    })
    this.setState({
      trendingAuthors,
      trendingTags,
      showTrendsModal: false
    })
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

    var authorTrendsCols = [{
      title: 'Authors',
      dataIndex: 'name',
      width: '50%'
    }]

    var tagTrendsCols = [{
      title: 'Tags',
      dataIndex: 'tag',
      width: '50%'
    }]

    var trendsModal = null;
    if (this.state.showTrendsModal) {
      trendsModal = (
        <Trends authors={this.state.authors} tags={this.state.tags}
          trendingAuthors={this.state.trendingAuthors}
          trendingTags={this.state.trendingTags}
          onCancel={() => this.onCancel()}
          onSubmit={(values) => this.onSubmitTrends(values)} />
      )
    }

    return (
      <div>
        <Row>
          <Col span={18}>
            <Row>
                <div className="quoteday-container">
                  <Row><label><b>Quote Of The Day</b></label></Row>
                  <Row>
                    <Col span={15}>
                      <label>{this.state.quoteOfTheDay.text}</label>
                    </Col>
                    <Col span={4}>
                      <label>{this.state.quoteOfTheDay.author}</label>
                    </Col>
                    <Col span={5}>
                      <label>{this.state.quoteOfTheDay.tags}</label>
                    </Col>
                  </Row>
                </div>
              </Row>
            <Row>
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
            </Row>
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
          </Col>
          <Col span={6}>
            <div className="trends-container">
              <label>TRENDZ</label>
              <Row>
                <Table columns={authorTrendsCols} dataSource={this.state.trendingAuthors}
                  pagination={false} bordered rowKey='index'/>
              </Row>
              <Row style={{marginTop: '10px'}}>
                <Table columns={tagTrendsCols} dataSource={this.state.trendingTags}
                  pagination={false} bordered rowKey='index'/>
              </Row>
              <Row>
                <Button key="okay" type="default" size="large"
                    onClick={() => this.editTrends()}
                    style={{marginTop: '10px', float: 'left'}} icon="edit">
                    Edit Trends
                  </Button>
              </Row>  
            </div>
          </Col>
        </Row>
        {trendsModal}
      </div>
    )
  }
}

AddQuotes = Form.create({})(AddQuotes);
export default AddQuotes;
