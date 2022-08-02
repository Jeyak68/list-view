import MultiSelect from "editable-creatable-multiselect";
import React from 'react';

class MultiSelectView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [{ name: "Microsoft", id: 1 },
            { name: "Apple", id: 2 },
            { name: "Google", id: 3 },
            { name: "JetBrains", id: 4 },
            { name: "Airbnb", id: 5 },
            { name: "Amazon", id: 6 },
            { name: "Tesla", id: 7 },
            { name: "NVIDIA", id: 8 },
            { name: "Samsung", id: 9 },
            { name: "Netflix", id: 10 }], selectedList: [],
        };
    }

    render() {

        return (
            <div className="App">
                <MultiSelect
                    suggestions={this.state.suggestions}
                    selectedItems={this.state.selectedList}
                    updateSuggestions={(response) => {
                        console.log("suggestion: ");
                        console.log(response);
                        this.setState({ suggestions: response.list });

                    }}
                    updateSelectedItems={(response) => {
                        console.log("selection: ");
                        console.log(response);
                        if (response.removedItem) {
                            this.setState({ suggestions: ([...this.state.suggestions, response.removedItem]) });
                        }
                        this.setState({ selectedList: response.list });
                    }}
                    displayField={"name"}
                    maxDisplayedItems={15}
                    disabled={false}
                    editFieldPosBelow={true}
                    placeholder={"Types ."}
                />
                <h2>welcome</h2>
            </div>
        );
    }
}

export default MultiSelectView;
