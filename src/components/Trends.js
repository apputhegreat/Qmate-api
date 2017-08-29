import React from 'react';
import { Button, Form, message, Modal, Row, Select } from 'antd';
import async from 'async';
import * as _ from 'lodash';

import firebaseUtil from '../utils/firebaseUtil';

const FormItem = Form.Item;
const Option = Select.Option;

class Trends extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var selectedAuthors = _.map(this.props.trendingAuthors, (author) => {
            return author.id;
        })
        var selectedTags = _.map(this.props.trendingTags, (obj) => {
            return obj.tag;
        })
        this.props.form.setFieldsValue({
            trend_authors: selectedAuthors,
            trend_tags: selectedTags
        });
    }
    onSubmit() {
        function getValues(callback) {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(err){
                  callback(err)
                  return;
                }
                callback(null, values)
            })
        }

        function saveToFirebase(values, callback) {
            var trending = {
                authors: values.trend_authors,
                tags: values.trend_tags
            }
            firebaseUtil.setTrends(trending, (err) => {
                callback(err);
            });
        }

        async.waterfall([
            getValues.bind(this),
            saveToFirebase.bind(this)
        ],
        (err) => {
            if (err) {
                console.log(err);
                message.success('Set Trendz failed');
            } else {
                message.success('Set Trendz successful');
                this.props.onCancel()
            }
        })
    }

    filterAuthors(inputValue, options) {
        const reg = new RegExp(inputValue, 'gi');
        const match = options.props.children.match(reg)
        if (match) {
          return true;
        }
        return false;
    }

    filterTags(inputValue, options) {
        const reg = new RegExp(inputValue, 'gi');
        const match = options.props.children.match(reg)
        if (match) {
          return true;
        }
        return false;
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const tagSelectOptions = this.props.tags.map((tag, index) => {
            return (
              <Option key={index} value={tag}>{tag}</Option>
            );
        })
        const authorSelectOptions = this.props.authors.map((author, index) => {
            return (
              <Option key={author.id} value={author.id}>{author.name}</Option>
            );
          })
        return (
            <Form>
              <Modal
                width={600}
                visible={true}
                maskClosable={false}
                title='Set Trends'
                footer={[
                  <Button key="cancel" type="ghost" size="large"
                    onClick={() => this.props.onCancel()}>
                    Cancel
                  </Button>,
                  <Button key="okay" type="primary" size="large"
                    onClick={() => this.onSubmit()}>
                    Save
                  </Button>,
                ]}
                onCancel={() => this.props.onCancel()}
                >
                <Row>
                <FormItem label="Authors">
                    { getFieldDecorator('trend_authors', {
                        rules: [{ required: true, message: 'Please provide Authors' }],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="Select a option"
                            style={{width:'100%'}}
                            filterOption={(value, options) => this.filterAuthors(value, options)}>
                            {authorSelectOptions}
                        </Select>
                    )}
                </FormItem>
                </Row>
                <Row>
                <FormItem label="Tags">
                    { getFieldDecorator('trend_tags', {
                        rules: [{ required: true, message: 'Please provide Tags' }],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="Select a option"
                            style={{width:'100%'}}
                            filterOption={(value, options) => this.filterTags(value, options)}>
                            {tagSelectOptions}
                        </Select>
                    )}
                </FormItem>
                </Row>
              </Modal>
            </Form>
          )
    }
}
Trends = Form.create({})(Trends);
export default Trends;