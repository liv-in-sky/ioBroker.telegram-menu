import React, { Component } from "react";
import Input from "./btn-Input/input";
import { Grid } from "@mui/material";
import Checkbox from "./btn-Input/checkbox";
import { I18n } from "@iobroker/adapter-react-v5";
import Select from "./btn-Input/select";

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "/opt/iobroker/grafana/",
			options: ["One", "Two", "Three"],
		};
	}
	onClickCheckbox = (event, id) => {
		const checkbox = { ...this.props.data.state.native.checkbox };
		checkbox[id] = event.target.checked;
		console.log(checkbox);
		this.props.callback.updateNative("checkbox", checkbox);
	};
	render() {
		console.log(this.props.data.state.native.checkbox);
		return (
			<div className="Settings">
				<h1>{I18n.t("Settings")}</h1>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Select
							options={this.props.data.instances}
							placeholder="--Please choose a telegram instance--"
							label={I18n.t("Telegram Instance")}
							name="instance"
							selected={this.props.data.state.native.instance}
							id="instance"
							callback={this.props.callback.updateNative}
							setNative={true}
						></Select>
					</Grid>
					<Grid item xs={4}>
						<Input
							label={I18n.t("Text will be send if no entry was found!")}
							placeholder="No entry found"
							callback={this.props.callback.updateNative}
							id="textNoEntry"
							value={this.props.data.state.native.textNoEntry || I18n.t("Entry not found!")}
							setNative={true}
							width="100%"
						/>
					</Grid>
					<Grid item xs={8}>
						<Checkbox
							label={I18n.t("Active")}
							id="checkboxNoValueFound"
							isChecked={this.props.data.state.native.checkbox.checkboxNoValueFound}
							callbackValue="event"
							callback={this.onClickCheckbox}
						/>
					</Grid>
					<Grid item xs={3}>
						<Checkbox
							label="Resize Keyboard"
							id="resKey"
							isChecked={this.props.data.state.native.checkbox.resKey}
							callback={this.onClickCheckbox}
							callbackValue="event"
							setNative={true}
							title="Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app's standard keyboard."
							class="title"
						/>
					</Grid>
					<Grid item xs={3}>
						<Checkbox
							label="One Time Keyboard"
							id="oneTiKey"
							isChecked={this.props.data.state.native.checkbox.oneTiKey}
							callback={this.onClickCheckbox}
							callbackValue="event"
							setNative={true}
							title="Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again."
							class="title"
						/>
					</Grid>
					<Grid item xs={6}></Grid>
					<Grid item xs={6}>
						<Input
							label={I18n.t("Token Grafana")}
							placeholder="Token Grafana"
							callback={this.props.callback.updateNative}
							id="tokenGrafana"
							value={this.props.data.state.native.tokenGrafana}
							setNative={true}
							width="100%"
						/>
					</Grid>
					<Grid item xs={4}>
						<Input
							label={I18n.t("Directory")}
							placeholder="/opt/iobroker/grafana/"
							callback={this.props.callback.updateNative}
							id="directory"
							value={this.props.data.state.native.directory || "/opt/iobroker/grafana/"}
							setNative={true}
							width="100%"
						/>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default Settings;
