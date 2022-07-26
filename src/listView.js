
import './App.css';
import React, { Component } from "react";
import './firebase.js';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import db from "./firebase";
import moment from 'moment'

import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";



class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [], listShow: false,
        };

    }
    componentDidMount() {
        // this.getDateTime();
        this.readData();
    }

    readData = async () => {
        const q = query(collection(db, "users"), orderBy('date'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let list = [];
            querySnapshot.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data()['name'], date: doc.data()['date'] });
                console.log(doc.id, " => ", doc.data());
            });
            this.setState(prevState => {
                return { ...prevState, list: list };
            })

        })
    };

    /*  getDateTime = () => {
          let tempDate = new Date();
          let date = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
          this.setState({ currentDate: date })
      } */


    render() {
        const workIconStyles = { background: "#3b82f6" };
        return (
            <>
                <div class="bg-gray-200">
                    <VerticalTimeline>
                        {this.state.list.map((element) => {
                            const date1 = element.date;
                            var date_new = moment(date1, "YYYYMMDD").fromNow();
                            return (
                                <VerticalTimelineElement
                                    key={element.key}
                                    dateClassName="date"
                                    iconStyle={workIconStyles}
                                    date={date_new}
                                >
                                    <div class="vertical-timeline-element-title">
                                        <span class="float-left">
                                            {element.name}
                                        </span>
                                        <span class="float-right">
                                            {element.name}
                                        </span>
                                    </div>


                                </VerticalTimelineElement>
                            );
                        })}
                    </VerticalTimeline>

                </div>
            </>
        )
    }
}

export default ListView
