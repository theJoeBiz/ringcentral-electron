import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as messageActions from "../actions/Message";
import Panel from "react-bootstrap/lib/Panel";
import Alert from "react-bootstrap/lib/Alert";
import Table from "react-bootstrap/lib/Table";
import helpers from "ringcentral-helpers";

function mapStateToProps(state) {
    return {...state.message}
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators(messageActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Message extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        paging: PropTypes.any.isRequired,
        getMessages: PropTypes.func.isRequired,
        error: PropTypes.string
    };

    onPageClick(e) {
        this.props.getMessages(+e.target.innerText)
    }

    componentWillMount() {
        this.props.getMessages();
    }

    render() {

        const {paging, records, fetching, error} = this.props;

        if (error) return <Alert bsStyle="danger">Can't load messages: {error}</Alert>;

        return <Table striped>
                <thead>
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                {fetching ? <tr>
                    <td colspan="3">Loading...</td>
                </tr>
                    : records.map((entry, index) => {
                        return <tr key={index}>
                            <td>{contact(entry.from)}</td>
                            <td>{contact(entry.to[0])}{entry.to.length > 1 ? <div><small>And {entry.to.length - 1} more...</small></div> : ''}</td>
                            <td>{entry.subject}</td>
                        </tr>;
                    }
                )}

                </tbody>
                <tfoot>
                <tr>
                    <td colspan="3">
                        Total calls: {records.length} of {paging.totalElements}, page {paging.page}
                        of {paging.totalPages}
                        ({paging.perPage} per page)
                    </td>
                </tr>
                </tfoot>
            </Table>;
    }
}

function contact(rec) {
    return <div>
        {rec.name || rec.phoneNumber || rec.extension}
        {rec.location ? <div>
            <small>{rec.location}</small>
        </div> : null}
    </div>;
}