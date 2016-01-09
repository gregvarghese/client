//yeah yeah I'll break this shit up later
//just testing things right now

import React = require("react")
import taskStore from "../store/task-store"
import {createSortOnProperty, bytesToSize} from "../util"

export class TaskList extends React.Component<{}, {tasks?: Array<TaskInfo>, sortProperty?: string, sortType?: string}> {
    constructor(props) {
        super(props)
        this.state = {tasks: [], sortProperty: "id", sortType: "asc"}
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount() {
        taskStore.listen(this.onChange)
    }
    componentWillUnmount() {
        taskStore.unlisten(this.onChange)
    }
    onChange(tasks) {
        this.setState(tasks)
        console.log(this.state)
    }
    setSort(prop: string) {
        if (this.state.sortProperty == prop) {
            this.setState({ sortType: (this.state.sortType == "asc" ? "desc" : "asc") })
        }
        else {
            this.setState({sortProperty: prop})
        }
    }
    render() {
        if (this.state.tasks.length == 0) {
            return (
                <p>Loading task list; hang on pleaaase...</p>
            )
        }
        if (this.state.sortProperty.length > 0) {
            this.state.tasks.sort(createSortOnProperty<TaskInfo>(this.state.sortProperty, this.state.sortType))
        }
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th onClick={() => this.setSort("name")}>Name</th>
                        <th onClick={() => this.setSort("id")}>ID</th>
                        <th onClick={() => this.setSort("cpuUsage")}>CPU</th>
                        <th onClick={() => this.setSort("ramUsage")}>Memory</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.tasks.map(task => {
                            return (<Task key={task.id} info={task} />)
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export class Task extends React.Component<{key: number, info: TaskInfo}, {}> {

    render() {
        return (
            <tr>
                <td><img src={"data:image/png;base64," + this.props.info.icon} /></td>
                <td>{this.props.info.name}</td>
                <td>{this.props.info.id}</td>
                <td>{this.props.info.cpuUsage + "%"}</td>
                <td>{bytesToSize(this.props.info.ramUsage)}</td>
            </tr>
        )
    }
}
