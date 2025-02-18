import React, { Component } from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { handleMouseOut, handleMouseOver } from "../lib/dragNDrop.mjs";
import { getElementIcon } from "../lib/actionUtilis.mjs";

class SubTable extends Component {
	render() {
		return (
			<Table>
				<TableBody>
					{typeof this.props.data != "string" && this.props.data != null && this.props.data != undefined
						? this.props.data.map((element, index) => (
								<TableRow key={index} className="SubTable">
									<TableCell style={{ padding: "0", border: "none" }}>
										<span
											draggable={false}
											className="noneDraggable"
											onMouseOver={(e) => handleMouseOver(e, this.props.setState)}
											onMouseLeave={(e) => handleMouseOut(e, this.props.setState)}
										>
											{this.props.name != "values" ? getElementIcon(element) : element}
										</span>
									</TableCell>
								</TableRow>
						  ))
						: null}
				</TableBody>
			</Table>
		);
	}
}

export default SubTable;
