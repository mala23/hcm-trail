export default class WeatherWidgetComponent {
	constructor( element, provider ) {
		this.root = element;

		this.props = {
			attribution: provider.attribution,
			weekdays: element.getAttribute( 'data-weekdays' ).split( ',' ),
		};

		this.state = {
			loading: true,
			title: this.root.getAttribute( 'data-loading-title' ),
			data: null,
		};

		this.render();
	}

	update( data ) {
		const title = this.root.getAttribute( 'data-title' );
		this.state.title = title.replace( '$city', data.city );
		this.state.loading = false;
		this.state.data = data;
		this.render();
	}

	render() {
		const loadingTemplate = `
        <div class="weather-loading">
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
        </div>`;

		const weatherTemplate = !this.state.loading && `
        <ul class="weather-forecast">
            <li>
              <span class="weather-weekday">Now</span>
              <i class="wi ${this.state.data.current.code}"></i>
              <span class="weather-temp">${this.state.data.current.temp}&deg;</span>
            </li>
            ${this.state.data.forecast.map( ( f ) => `
                <li>
                    <span class="weather-weekday">${this.props.weekdays[ ( new Date( f.date ) ).getDay() ]}</span>
                    <i class="wi ${f.code}"></i>
                    <span class="weather-temp">${f.high}&deg;/${f.low}&deg;</span>
                </li>
            ` ).join( '' )}
        </ul>`;

		const template = `
        <div class="widget widget-side">
          <h2 class="widget-title">${this.state.title}</h2>
          <div class="weather">
            ${this.state.loading ? loadingTemplate : weatherTemplate}
            <div class="weather-attribution">
              <a href=${this.props.attribution.link} target="_blank">${this.props.attribution.text}</a>
            </div>
          </div>
        </div>`;

		while ( this.root.firstChild ) {
			this.root.removeChild( this.root.firstChild );
		}
		this.root.insertAdjacentHTML( 'beforeend', template );
	}
}

