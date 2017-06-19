import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Icon,Input, Table, Row } from 'antd'
import * as _ from 'lodash'

import { CustomRebase } from '../common/CustomRebase'
import '../common/styles.css'

class ListQuotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quotes: [],
      filteredQuotes: [],
      quoteFilterDropdownVisible: false,
      authorFilterDropdownVisible: false,
      tagFilterDropdownVisible: false,
      searchQuote: '',
      searchAuthor: '',
      searchTag: '',
      quoteFiltered: false,
      authorFiltered: false,
      tagFiltered: false
    }
  }

  componentWillMount() {
    console.log('ComponentWillMount');
    this.refOff = CustomRebase.listenTo('quotes', {
      context: this,
      asArray: true,
      then(val) {
        this.setState({
          quotes: val,
          filteredQuotes: val
        })
      },
      onFailure(err) {
        console.log('err', err);
      }
    })
  }

  onEditQuote(record) {
    console.log('record', record);
  }

  onSearchQuoteChange = (e) => {
    this.setState({ searchQuote: e.target.value });
  }

  onSearchQuote = () => {
    const { searchQuote, quotes } = this.state;
    const reg = new RegExp(searchQuote, 'gi');
    this.setState({
      quoteFilterDropdownVisible: false,
      quoteFiltered: !!searchQuote,
      authorFiltered: false,
      tagFiltered: false,
      filteredQuotes: _.filter(quotes, (quote) => {
        const match = quote.text.match(reg)
        if (match) {
          return true
        } else {
          return false
        }
      })
    });
  }

  onSearchAuthorChange = (e) => {
    this.setState({ searchAuthor: e.target.value });
  }

  onSearchAuthor = () => {
    const { searchAuthor, quotes } = this.state;
    const reg = new RegExp(searchAuthor, 'gi');
    this.setState({
      authorFilterDropdownVisible: false,
      authorFiltered: !!searchAuthor,
      quoteFiltered: false,
      tagFiltered: false,
      filteredQuotes: _.filter(quotes, (quote) => {
        const match = quote.author.match(reg)
        if (match) {
          return true
        } else {
          return false
        }
      })
    });
  }

  onSearchTagChange = (e) => {
    this.setState({ searchTag: e.target.value });
  }

  onSearchTag = () => {
    const { searchTag, quotes } = this.state;
    const reg = new RegExp(searchTag, 'gi');
    this.setState({
      tagFilterDropdownVisible: false,
      tagFiltered: !!searchTag,
      quoteFiltered: false,
      authorFiltered: false,
      filteredQuotes: _.filter(quotes, (quote) => {
        var found = false;
        _.map(quote.tags, (tag) => {
          const match = tag.match(reg)
          if (match) {
            found = true;
            return true;
          }
        })
        if (found) {
          return true
        } else {
          return false
        }
      })
    });
  }

  componentWillUnmount() {
    CustomRebase.removeBinding(this.refOff)
  }

  render() {
    const columns = [{
      title: <b>Quote</b>,
      dataIndex: 'text',
      width: '60%',
      key: 'text',
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInputQuote = ele}
            placeholder="Search Quote"
            value={this.state.searchQuote}
            onChange={this.onSearchQuoteChange}
            onPressEnter={this.onSearchQuote}
          />
          <Button type="primary" onClick={this.onSearchQuote}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="filter" style={{ color: this.state.quoteFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.quoteFilterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          quoteFilterDropdownVisible: visible,
        }, () => this.searchInputQuote.focus());
      },
    }, {
      title: <b>Author</b>,
      dataIndex: 'author',
      kay: 'author',
      width: '10%',
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInputAuthor = ele}
            placeholder="Search Author"
            value={this.state.searchAuthor}
            onChange={this.onSearchAuthorChange}
            onPressEnter={this.onSearchAuthor}
          />
          <Button type="primary" onClick={this.onSearchAuthor}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="filter" style={{ color: this.state.authorFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.authorFilterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          authorFilterDropdownVisible: visible,
        }, () => this.searchInputAuthor.focus());
      },
    }, {
      title: <b>Tags</b>,
      dataIndex: 'tags',
      key: 'tags',
      width: '30%',
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
            ref={ele => this.searchInputTags = ele}
            placeholder="Search Tag"
            value={this.state.searchTag}
            onChange={this.onSearchTagChange}
            onPressEnter={this.onSearchTag}
          />
          <Button type="primary" onClick={this.onSearchTag}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="filter" style={{ color: this.state.tagFiltered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.tagFilterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          tagFilterDropdownVisible: visible,
        }, () => this.searchInputTags.focus());
      },
    }, {
        title: <b>Action</b>,
        render: (value, record, index) => {
          return (
            <div>
              <Row>
                <Col span={12}>
                  <Link to={`/editquote`}
                    className="link-primary">
                    <Button onClick={() => this.onEditQuote(record)}>
                      <Icon type="edit"/>
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          )
        }
      }];
    return (
      <div>
        <Row style={{marginTop: 50}}>
          <Col span={20} offset={2}>
            <Table bordered columns={columns} dataSource={this.state.filteredQuotes}
              rowKey='id'/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListQuotes;
