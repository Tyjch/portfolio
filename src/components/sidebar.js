import React from "react";

const SidebarContext = React.createContext({
	content    : null,
	setContent : () => {},
})

export default SidebarContext;