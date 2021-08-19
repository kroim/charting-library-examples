import * as React from 'react';
import './index.css';
import { widget } from '../../charting_library';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'KCS',
		interval: '1H',
		containerId: 'tv_chart_container',
		datafeedUrl: 'http://localhost:5000',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};

	tvWidget = null;
	
	componentDidMount() {
		console.log("componentDidMount");
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,

			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings','header_compare','header_indicators','header_settings','header_saveload','header_screenshot','header_fullscreen_button','left_toolbar','timeframes_toolbar','display_market_status','symbol_info'],
			enabled_features: [],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
		};

		const tvWidget = new widget(widgetOptions);
		widgetOptions.datafeed.onReady(function(configuration) {

			// configuration.supported_resolutions = ["1", "3", "5", "15", "30", "45", "60", "120", "180", "240", "1D", "1W", "1M"]
			// configuration.supports_marks = false
			// configuration.supports_timescale_marks = false
		});		
		this.tvWidget = tvWidget;		
		tvWidget.onChartReady(() => {			
			tvWidget.headerReady().then(() => {				
							
			});
		});
			
	}

	componentWillUnmount() {
		console.log("componentWillUnmount");
		if (this.tvWidget !== null) {			
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}
