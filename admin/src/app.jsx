import React from "react";
import GenericApp from "@iobroker/adapter-react-v5/GenericApp";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { Grid, Tab, Box } from "@mui/material";
import { I18n, AdminConnection } from "@iobroker/adapter-react-v5";
import { updateTriggerForSelect } from "./lib/actionUtilis.mjs";

import HeaderIconBar from "./components/HeaderIconBar";
import Settings from "./components/settings";
import HeaderMenu from "./components/HeaderMenu";
import TabNavigation from "./components/TabNavigation";
import HeaderTelegramUsers from "./components/HeaderTelegramUsers";
import TabAction from "./components/TabAction";
import DropBox from "./components/popupCards/DropBox";
import PopupContainer from "./components/popupCards/PopupContainer";

import getIobrokerData from "./lib/socket.mjs";
import helperFunction from "./lib/Utilis.mjs";
import { insertNewItemsInData } from "./lib/newValuesForNewVersion.mjs";
import { navEntrys } from "./lib/entrys.mjs";
import { sortObjectByKey } from "./lib/actionUtilis.mjs";

// let myTheme;

class App extends GenericApp {
	constructor(props) {
		const extendedProps = {
			...props,
			encryptedFields: [],
			Connection: AdminConnection,
			translations: {
				en: require("../../admin/i18n/en/translations.json"),
				de: require("../../admin/i18n/de/translations.json"),
				ru: require("../../admin/i18n/ru/translations.json"),
				pt: require("../../admin/i18n/pt/translations.json"),
				nl: require("../../admin/i18n/nl/translations.json"),
				fr: require("../../admin/i18n/fr/translations.json"),
				it: require("../../admin/i18n/it/translations.json"),
				es: require("../../admin/i18n/es/translations.json"),
				pl: require("../../admin/i18n/pl/translations.json"),
				uk: require("../../admin/i18n/uk/translations.json"),
				"zh-cn": require("../../admin/i18n/zh-cn/translations.json"),
			},
		};
		super(props, extendedProps);
		// const theme = this.createTheme();
		this.state = {
			...this.state,
			native: {},
			data: {},
			tab: "nav",
			subTab: "set",
			draggingRowIndex: null,
			activeMenu: "",
			showPopupMenuList: false,
			instances: [],
			popupMenuOpen: false,
			themeName: "",
			// themeName: this.getThemeName(theme),
			// themeType: this.getThemeType(theme),
			themeType: "",
			unUsedTrigger: [],
			usedTrigger: [],
			showDropBox: false,
			doubleTrigger: [],
			connectionReady: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.setState = this.setState.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.native.instance !== this.state.native.instance && this.state.connectionReady) this.getUsersFromTelegram();
		if (prevState.native.data !== this.state.native.data || prevState.activeMenu !== this.state.activeMenu) {
			if (this.state.activeMenu && this.state.activeMenu != "") this.updateActiveMenuAndTrigger(this.state.activeMenu);
		}
		if (prevState.native.usersInGroup !== this.state.native.usersInGroup) {
			this.updateNativeValue("usersInGroup", sortObjectByKey(this.state.native.usersInGroup));
		}
		if (prevState.usedTrigger !== this.state.usedTrigger) {
			this.checkDoubleEntryInUsedTrigger();
		}
	}

	onConnectionReady() {
		// executed when connection is ready
		insertNewItemsInData(this.state.native.data, this.updateNativeValue.bind(this));
		this.updateNativeValue("usersInGroup", sortObjectByKey(this.state.native.usersInGroup));
		this.getUsersFromTelegram();

		// myTheme = this.props.themeName;
		getIobrokerData.getAllTelegramInstances(this.socket, (data) => {
			this.setState({ instances: data });
		});
		let firstMenu = "";
		if (this.state.native.usersInGroup) {
			firstMenu = Object.keys(this.state.native.usersInGroup)[0];
			this.setState({ activeMenu: firstMenu });
		}

		this.updateActiveMenuAndTrigger(firstMenu);
		console.log(this.state.native);
		this.setState({ connectionReady: true });
	}
	checkDoubleEntryInUsedTrigger = () => {
		const usedTrigger = [...this.state.usedTrigger];
		let doubleTrigger = [];
		usedTrigger.forEach((element, index) => {
			if (index !== usedTrigger.indexOf(element)) {
				if (element != "-") doubleTrigger.push(element);
			}
		});

		this.setState({ doubleTrigger: doubleTrigger });
	};
	updateActiveMenuAndTrigger = (menu) => {
		let result = updateTriggerForSelect(this.state.native.data, this.state.native.usersInGroup, menu);
		if (result) this.setState({ unUsedTrigger: result.unUsedTrigger, usedTrigger: result.usedTrigger });
	};

	getUsersFromTelegram() {
		getIobrokerData.getUsersFromTelegram(this.socket, this.state.native.instance || "telegram.0", (data) => {
			if (!this.state.native.instance) this.updateNativeValue("instance", "telegram.0");

			this.updateNativeValue("userListWithChatID", helperFunction.processUserData(data));
		});
	}
	closeDropBox = () => {
		this.setState({ showDropBox: false });
	};

	handleChange(event, val) {
		this.setState({ tab: val });
	}

	render() {
		if (!this.state.loaded) {
			return super.render();
		}
		const tabBox = {
			display: "flex",
			flexDirection: "column",
			height: "calc(100vh - 112px)",
		};
		return (
			<div className={`App row ${this.props.themeName}`}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<HeaderIconBar
							key="options"
							common={this.common}
							socket={this.socket}
							native={this.state.native}
							onError={(text) => this.setState({ errorText: (text || text === 0) && typeof text !== "string" ? text.toString() : text })}
							onLoad={(native) => this.onLoadConfig(native)}
							instance={this.instance}
							adapterName={this.adapterName}
							changed={this.state.changed}
							onChange={(attr, value, cb) => this.updateNativeValue(attr, value, cb)}
						></HeaderIconBar>
					</Grid>
					<Grid item xs={12} className="App-main-content">
						<Box sx={{ width: "100%", typography: "body1" }} className="Tab-Box" style={tabBox}>
							<TabContext value={this.state.tab}>
								<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
									<TabList onChange={this.handleChange} aria-label="lab API tabs example" className="App-TabList">
										<Tab label={I18n.t("Navigation")} value="nav" />
										<Tab label={I18n.t("Action")} value="action" />
										<Tab label={I18n.t("Settings")} value="settings" />
									</TabList>
								</Box>
								<Grid container spacing={1} className="Grid-HeaderMenu ">
									<Grid item xs={12}>
										{this.state.tab != "settings" ? (
											<HeaderMenu
												data={{ activeMenu: this.state.activeMenu, state: this.state }}
												callback={{
													setState: this.setState,
													updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
												}}
											></HeaderMenu>
										) : null}
									</Grid>
									<Grid item xs={12}>
										{this.state.tab != "settings" ? (
											<HeaderTelegramUsers
												data={{
													state: this.state,
													usersInGroup: this.state.native.usersInGroup,
													userActiveCheckbox: this.state.native.userActiveCheckbox,
													activeMenu: this.state.activeMenu,
												}}
												callback={{
													setState: this.setState,
													updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
												}}
												menuPopupOpen={this.state.popupMenuOpen}
											></HeaderTelegramUsers>
										) : null}
									</Grid>
								</Grid>

								<TabPanel value="nav">
									<TabNavigation
										activeMenu={this.state.activeMenu}
										data={{
											nav: this.state.native.data.nav,
											data: this.state.native.data,
											activeMenu: this.state.activeMenu,
											state: this.state,
											socket: this.socket,
											themeName: this.state.themeName,
											themeType: this.state.themeType,
											adapterName: this.adapterName,
										}}
										callback={{
											setState: this.setState,
											updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
										}}
										entrys={navEntrys}
									></TabNavigation>
								</TabPanel>
								<TabPanel value="action">
									<TabAction
										data={{
											action: this.state.native.data.action,
											data: this.state.native.data,
											state: this.state,
											socket: this.socket,
											themeName: this.state.themeName,
											themeType: this.state.themeType,
											adapterName: this.adapterName,
											unUsedTrigger: this.state.unUsedTrigger,
										}}
										activeMenu={this.state.activeMenu}
										callback={{
											setState: this.setState,
											updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
										}}
									></TabAction>
								</TabPanel>
								<TabPanel value="settings">
									<Settings
										data={{ instances: this.state.instances, state: this.state, checkbox: this.state.native.checkbox }}
										callback={{
											setState: this.setState,
											updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
										}}
									></Settings>
								</TabPanel>
							</TabContext>
						</Box>
					</Grid>
				</Grid>
				{this.state.showDropBox ? (
					<PopupContainer class="DropBox-PopupContainer" width="99%" height="30%" title="DropBox" callback={this.closeDropBox} closeBtn={true}>
						<DropBox
							tab={this.state.tab}
							subTab={this.state.subTab}
							index={this.state.draggingRowIndex}
							activeMenu={this.state.activeMenu}
							native={this.state.native}
							callback={{
								setState: this.setState,
								updateNative: (attr, value, cb) => this.updateNativeValue(attr, value, cb),
							}}
						></DropBox>
					</PopupContainer>
				) : null}
				{this.state.doubleTrigger.length > 0 ? (
					<div className="ErrorDoubleTrigger-Container">
						<p className="Error-Header">{I18n.t("You have double triggers, please remove them!")}</p>
						{this.state.doubleTrigger.map((element, index) => (
							<p className="Error-Items" key={index}>
								{element}
							</p>
						))}
					</div>
				) : null}
				{this.renderError()}
				{this.renderToast()}
				{this.renderSaveCloseButtons()}
			</div>
		);
	}
}

export default App;
