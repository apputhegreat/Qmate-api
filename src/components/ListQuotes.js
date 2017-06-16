import React from 'react'
import { Col, Table, Row } from 'antd'

import { CustomRebase } from '../common/CustomRebase'

class ListQuotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quotes: []
    }
  }

  componentWillMount() {
    console.log('ComponentWillMount');
    this.refOff = CustomRebase.listenTo('quotes', {
      context: this,
      asArray: true,
      then(val) {
        this.setState({
          quotes: val
        })
      },
      onFailure(err) {
        console.log('err', err);
      }
    })
  }

  componentWillUnmount() {
    CustomRebase.removeBinding(this.refOff)
  }

  render() {
    const columns = [{
      title: <b>Quote</b>,
      dataIndex: 'text',
      width: '60%'
    }, {
      title: <b>Author</b>,
      dataIndex: 'author',
      width: '10%'
    }, {
      title: <b>Tags</b>,
      dataIndex: 'tags',
      width: '30%'
    }];
    return (
      <div>
        <Row style={{marginTop: 50}}>
          <Col span={20} offset={2}>
            <Table bordered columns={columns} dataSource={this.state.quotes} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListQuotes;
