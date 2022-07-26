import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './firebase.js';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import db from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ListView from "./listView.js";
import moment from 'moment'
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import timelineElements from "./timelineElements";


class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], name: "", date: "", nameError: "", userAddShow: false, currentDate: "",
    };
    this.name = React.createRef();
    this.date = React.createRef();
    this.openUserAddModal = this.openUserAddModal.bind(this);
    this.cancelUserAddModal = this.cancelUserAddModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }

  openUserAddModal = () => {
    this.setState({ userAddShow: true });
  }

  cancelUserAddModal = () => {
    this.setState({ userAddShow: false });
  }
  closeModal() {
    this.setState({ userAddShow: true });
  }



  validatename = async () => {
    let nameError = "";
    if (!this.name.current.value) {
      nameError = "Name cannot be blank";
    }
    else {
      nameError = "";
    }
    this.setState({ nameError });
    if (nameError) {
      return false;
    }
    return true;
  }


  submitFormFields = async () => {
    const isValid = await this.validatename();

    if (isValid) {
      const docRef = await addDoc(collection(db, `users`),
        {
          name: this.name.current.value,
          date: this.date.current.value,
        });

      console.log("Document written with ID:", docRef);
      this.setState({ userAddShow: false });
    }
    this.name.current.value = '';

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


  render() {
    const date1 = new Date();
    const defaultValue = date1.toLocaleDateString('en-CA');
    const workIconStyles = { background: "#3b82f6" };

    return (
      <div className="App" >
        <div class="flex text-left">
          <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
            <li class="px-6 py-2 border-b border-gray-200 w-full bg-blue-600 text-white">
              <div class="flex">
                <p class="flex items-center justify-center md:justify-start">
                  <span class="">List View </span>
                </p>
                <p class="flex items-center justify-center md:justify-start ml-auto pr-2">
                  <span>
                    <FontAwesomeIcon icon={faPlus} onClick={() => { this.openUserAddModal(); }} />
                  </span>
                </p>

              </div>
            </li>
          </ul>
        </div>

        <div class="bg-gray-200">
          <ListView />
          {/* <VerticalTimeline>
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
          </VerticalTimeline> */}

        </div>

        {/* User Add Model */}
        <Transition appear show={this.state.userAddShow} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={this.closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add Form
                    </Dialog.Title>
                    <div class="flex flex-row pt-4">
                      <div>First Name</div>
                      <div class="pl-4">
                        <input class="input_design focus:outline-none focus:bg-white focus:border-blue-600" id="inline-full-name" type="text" ref={this.name} required >
                        </input>
                      </div>
                    </div>
                    <div class="flex flex-row pt-2">
                      <div>Date</div>
                      <div class="pl-4">
                        <input class="input_design focus:outline-none focus:bg-white focus:border-blue-600" id="date" type="datetime-local" defaultValue={defaultValue} name="date" ref={this.date} required >
                        </input>
                      </div>
                    </div>

                    <div class="flex space-x-4 flex-row justify-center items-center pt-4">
                      <div>
                        <button type="button" className="button_design bg-blue-600 hover: bg-blue-600 focus:shadow-outline focus:outline-none" onClick={() => { this.submitFormFields(); }}>
                          Add
                        </button>
                      </div>
                      <div>
                        <button type="button" className="button_design bg-gray-600 hover: bg-gray-600 focus:shadow-outline focus:outline-none" onClick={() => { this.cancelUserAddModal(); }}>
                          Cancel
                        </button>

                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div >

    );
  }
}

ReactDOM.render(
  <UserForm />,
  document.getElementById('root')
);




