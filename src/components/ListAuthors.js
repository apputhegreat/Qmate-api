import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Icon,Input, Table, Row } from 'antd'
import * as _ from 'lodash'
import async from 'async';

import { CustomRebase } from '../common/CustomRebase'
import '../common/styles.css'

class ListAuthors extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authors: [],
      filteredAuthors: [],
      authorFilterDropdownVisible: false,
      searchAuthor: '',
      authorFiltered: false
    }
  }

  componentWillMount() {
    this.refOff = CustomRebase.listenTo('authors', {
      context: this,
      asArray: true,
      then(val) {
        this.setAuthors(val);
      },
      onFailure(err) {
        if (err) {
          console.log('err', err);
        }
      }
    })
  }

  setAuthors(authors) {
    var authorsList = _.map(authors, (author) => {
      return this.getAuthorUrl(author)
    })
    this.setState({
      authors: authorsList,
      filteredAuthors: authorsList
    })
  }

  onSearchAuthorChange = (e) => {
    this.setState({ searchAuthor: e.target.value });
  }

  getAuthorUrl(author) {
    if (author.image) {
      var imageRef = CustomRebase.initializedApp.storage().refFromURL(author.image)
      imageRef.getDownloadURL().then((url) => {
        author.downloadLink = url;
      }).catch((err) => {
        console.log(err);
      });
      return author;
    } else {
      author.downloadLink = '';
      return author;
    }
  }

  onSearchAuthor = () => {
    const { searchAuthor, authors } = this.state;
    const reg = new RegExp(searchAuthor, 'gi');
    this.setState({
      authorFilterDropdownVisible: false,
      authorFiltered: !!searchAuthor,
      filteredAuthors: _.filter(authors, (author) => {
        const match = author.name.match(reg)
        if (match) {
          return true
        } else {
          return false
        }
      })
    });
  }

  render() {
    const columns = [{
      title: <b>Author</b>,
      dataIndex: 'name',
      kay: 'name',
      width: '50%',
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
      title: <b>Image</b>,
      dataIndex: 'downloadLink',
      kay: 'downloadLink',
      width: '50%',
      render: (value, record, index) => {
        return (
          <img src={record.downloadLink} height="42" width="42"/>
        )
        }
    }, {
        title: <b>Action</b>,
        render: (value, record, index) => {
          return (
            <div>
              <Row>
                <Col span={12}>
                  <Link to={`/editauthor/${record.id}`}
                    className="link-primary">
                    <Button>
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
            <Table bordered columns={columns} dataSource={this.state.filteredAuthors}
              rowKey='id'/>
          </Col>
        </Row>
      </div>
    )
  }

  componentWillUnmount() {
    CustomRebase.removeBinding(this.refOff)
  }
}

export default ListAuthors;
