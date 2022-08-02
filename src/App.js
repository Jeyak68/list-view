import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './firebase.js';
import { collection, addDoc, query, onSnapshot, orderBy, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import db from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ListView from "./listView.js";
//import MultiSelect from 'react-multiple-select-dropdown-lite'
//import 'react-multiple-select-dropdown-lite/dist/index.css'
import moment from 'moment'
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import MultiSelectView from "./multiselect.js";


class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], name: "", date: "", name1: "", date1: "", nameError: "", ListAddShow: false, currentDate: "", listEditShow: false, listdelete: [], listDeleteOpen: false, listedit: [], listEditOpen: false,
    };
    this.name = React.createRef();
    this.date = React.createRef();
    this.name1 = React.createRef();
    this.date1 = React.createRef();
    this.openListAddModal = this.openListAddModal.bind(this);
    this.cancelListAddModal = this.cancelListAddModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.listDeleteCloseModal = this.listDeleteCloseModal.bind(this);
    this.openListDeleteModal = this.openListDeleteModal.bind(this);
    this.closeListDeleteModal = this.closeListDeleteModal.bind(this);
    this.listEditCloseModal = this.listEditCloseModal.bind(this);
    this.openListEditModal = this.openListEditModal.bind(this);
    this.closeListEditModal = this.closeListEditModal.bind(this);

  }

  openListAddModal = () => {
    this.setState({ ListAddShow: true });
  }
  cancelListAddModal = () => {
    this.setState({ ListAddShow: false });
  }
  closeModal() {
    this.setState({ ListAddShow: true });
  }
  listDeleteCloseModal() {
    this.setState({ listDeleteOpen: true });
  }
  listEditCloseModal() {
    this.setState({ listEditOpen: true });
  }


  listEditButtonClickHandler = () => {
    this.setState({ listEditShow: !this.state.listEditShow });
  };


  componentDidMount() {
    this.getDateTime();
    this.readData();
  }

  readData = async () => {
    //const q = query(collection(db, "users"), orderBy('date'));
    const q = query(collection(db, "users"), orderBy("date", "desc"));
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

  getDateTime = () => {
    let tempDate = new Date();
    let date = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
    this.setState({ currentDate: date })
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

  //add data
  submitFormFields = async () => {
    const isValid = await this.validatename();

    if (isValid) {
      const docRef = await addDoc(collection(db, `users`),
        {
          name: this.name.current.value,
          date: this.date.current.value,
        });

      console.log("Document written with ID:", docRef);
      this.setState({ ListAddShow: false });
    }
    this.name.current.value = '';

  }

  //delete list
  deleteList = async (id) => {

    this.setState(prevState => {
      return {
        ...prevState, listdelete: {
          id: id,
        },
        listDeleteOpen: true
      }
    });


  }

  deleteListModal = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    this.setState({ listDeleteOpen: false });
  }
  deleteCancelListModal = () => {
    this.setState({ listDeleteOpen: false });
  }
  openListDeleteModal() {
    this.setState({ listDeleteOpen: true });
  }
  closeListDeleteModal() {
    this.setState({ listDeleteOpen: false });
  }

  openListEditModal() {
    this.setState({ listEditOpen: true });
  }
  closeListEditModal() {
    this.setState({ listEditOpen: false });
  }

  //edit user get data
  editList = async (id) => {
    const docRef = doc(db, `users`, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.id, docSnap.data()['name']);
      this.setState(prevState => {
        return {
          ...prevState, listedit: {
            id: docSnap.id,
            name: docSnap.data()['name'],
            date: docSnap.data()['date'],
          },
          listEditOpen: true
        }
      });
    }

  }
  //edit user update data
  updateList = async (id) => {

    if (this.state.listedit.id) {
      const userRef = doc(db, `users`, id);
      await updateDoc(userRef, {
        name: this.name1.current.value,
        date: this.date1.current.value,
      });
      this.setState(prevState => {
        return {
          ...prevState, listedit: {
            id: "",
            name: "",
            date: "",
          },
          listEditOpen: false
        }
      });
      this.name1.current.value = '';

    }
  }

  updateCancelListModal = () => {
    this.setState({ listEditOpen: false });
  }



  render() {
    const date1 = new Date();
    const defaultValue2 = moment(date1).format('YYYY-MM-DDTHH:mm:ss');

    const options = [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
      { label: 'Option 3', value: 'option_3' },
      { label: 'Option 4', value: 'option_4' },
    ]
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
                    <FontAwesomeIcon icon={faPlus} onClick={() => { this.openListAddModal(); }} />
                  </span>
                  <span class="pl-4">
                    <FontAwesomeIcon icon={faPen} onClick={this.listEditButtonClickHandler} />
                  </span>

                </p>

              </div>
            </li>
          </ul>
        </div>

        <div class="bg-gray-200">

          <VerticalTimeline>
            {this.state.list.map((element) => {
              const date1 = element.date;
              var date_new = moment(date1, "YYYYMMDD").fromNow();
              const element_date = moment(date1).format("MMM Do YYYY");
              return (
                <VerticalTimelineElement
                  key={element.key}
                  dateClassName="date"
                  iconStyle={workIconStyles}
                  date={date_new}
                >
                  <div class="vertical-timeline-element-title">
                    <span class="float-left">
                      <div class="flex">
                        <span class="font-medium">
                          {element.name}
                        </span>
                        <span class="pl-2">
                          <listview displayControls={this.state.listEditShow} />
                          {this.state.listEditShow &&
                            <>
                              <FontAwesomeIcon icon={faPen} className="pr-4 h-4 w-4" onClick={() => { this.editList(element.id); }} />
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" onClick={() => { this.deleteList(element.id); }} />

                            </>
                          }
                        </span>
                      </div>
                    </span>

                    <span class="float-right ">
                      {element_date}
                    </span>

                  </div>


                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>


        </div>

        {/* List Add Model */}
        <Transition appear show={this.state.ListAddShow} as={Fragment}>
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
                        <input class="input_design focus:outline-none focus:bg-white focus:border-blue-600" id="date" type="datetime-local" defaultValue={defaultValue2} name="date" ref={this.date} required >
                        </input>
                      </div>
                    </div>
                    {/* <MultiSelect
                      onChange={this.handleChange}
                      options={options}
          /> */}

                    <div class="flex space-x-4 flex-row justify-center items-center pt-4">
                      <div>
                        <button type="button" className="button_design bg-blue-600 hover: bg-blue-600 focus:shadow-outline focus:outline-none" onClick={() => { this.submitFormFields(); }}>
                          Add
                        </button>
                      </div>
                      <div>
                        <button type="button" className="button_design bg-gray-600 hover: bg-gray-600 focus:shadow-outline focus:outline-none" onClick={() => { this.cancelListAddModal(); }}>
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

        {/* List Delete Modal */}
        <Transition appear show={this.state.listDeleteOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={this.listDeleteCloseModal}>
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
                      className="text-lg font-medium leading-6 text-gray-900 pb-4"
                    >
                      Are You Sure Want to Delete ?
                    </Dialog.Title>

                    <div class="flex space-x-4 flex-row justify-center items-center">
                      <div>
                        <button type="button" className="shadow bg-blue-600 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={() => { this.deleteListModal(this.state.listdelete.id); }}>
                          Yes
                        </button>
                      </div>
                      <div>
                        <button type="button" className="shadow bg-gray-600 hover:bg-gray-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" onClick={() => { this.deleteCancelListModal(); }}>
                          No
                        </button>

                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition >

        {/* List Edit Model */}
        <Transition appear show={this.state.listEditOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={this.listEditCloseModal}>
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
                      Edit Form
                    </Dialog.Title>
                    <div class="flex flex-row pt-4">
                      <div>First Name</div>
                      <div class="pl-4">
                        <input class="input_design focus:outline-none focus:bg-white focus:border-blue-600" id="inline-full-name" type="text" defaultValue={this.state.listedit.name} ref={this.name1} required >
                        </input>
                      </div>
                    </div>
                    <div class="flex flex-row pt-2">
                      <div>Date</div>
                      <div class="pl-4">
                        <input class="input_design focus:outline-none focus:bg-white focus:border-blue-600" id="date" type="datetime-local" defaultValue={this.state.listedit.date} name="date" ref={this.date1} required >
                        </input>
                      </div>
                    </div>
                    <div class="flex space-x-4 flex-row justify-center items-center pt-4">
                      <div>
                        <button type="button" className="button_design bg-blue-600 hover: bg-blue-600 focus:shadow-outline focus:outline-none" onClick={() => { this.updateList(this.state.listedit.id); }}>
                          Update
                        </button>
                      </div>
                      <div>
                        <button type="button" className="button_design bg-gray-600 hover: bg-gray-600 focus:shadow-outline focus:outline-none" onClick={() => { this.updateCancelListModal(); }}>
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




