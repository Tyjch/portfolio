import React from "react";

const SelectionContext = React.createContext({
	selection    : null,
	setSelection : () => {},
})

export default SelectionContext;