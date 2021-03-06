export default class YahooWeather {
	constructor( settings ) {
		this.settings = settings;
		this.units = settings.units;
	}

	get attribution() {
		return {
			text: 'Powered by Yahoo!',
			link: 'https://www.yahoo.com/?ilc=401',
		};
	}

	hmacsha1(k,d,_p,_z) {
		if(!_p){_p='=';}if(!_z){_z=8;}function _f(t,b,c,d){if(t<20){return(b&c)|((~b)&d);}if(t<40){return b^c^d;}if(t<60){return(b&c)|(b&d)|(c&d);}return b^c^d;}function _k(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;}function _s(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF);}function _r(n,c){return(n<<c)|(n>>>(32-c));}function _c(x,l){x[l>>5]|=0x80<<(24-l%32);x[((l+64>>9)<<4)+15]=l;var w=[80],a=1732584193,b=-271733879,c=-1732584194,d=271733878,e=-1009589776;for(var i=0;i<x.length;i+=16){var o=a,p=b,q=c,r=d,s=e;for(var j=0;j<80;j++){if(j<16){w[j]=x[i+j];}else{w[j]=_r(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);}var t=_s(_s(_r(a,5),_f(j,b,c,d)),_s(_s(e,w[j]),_k(j)));e=d;d=c;c=_r(b,30);b=a;a=t;}a=_s(a,o);b=_s(b,p);c=_s(c,q);d=_s(d,r);e=_s(e,s);}return[a,b,c,d,e];}function _b(s){var b=[],m=(1<<_z)-1;for(var i=0;i<s.length*_z;i+=_z){b[i>>5]|=(s.charCodeAt(i/8)&m)<<(32-_z-i%32);}return b;}function _h(k,d){var b=_b(k);if(b.length>16){b=_c(b,k.length*_z);}var p=[16],o=[16];for(var i=0;i<16;i++){p[i]=b[i]^0x36363636;o[i]=b[i]^0x5C5C5C5C;}var h=_c(p.concat(_b(d)),512+d.length*_z);return _c(o.concat(h),512+160);}function _n(b){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s='';for(var i=0;i<b.length*4;i+=3){var r=(((b[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((b[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((b[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>b.length*32){s+=_p;}else{s+=t.charAt((r>>6*(3-j))&0x3F);}}}return s;}function _x(k,d){return _n(_h(k,d));}return _x(k,d);
	}

	getAuthHeader(url, params, key, secret) {
		const oauth = {
			'oauth_consumer_key': key,
			'oauth_nonce': Math.random().toString(36).substring(2),
			'oauth_signature_method': 'HMAC-SHA1',
			'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
			'oauth_version': '1.0',
		};

		const merged = Object.assign(Object.assign({}, params), oauth);
		const mergedArr = Object.keys(merged).sort().map((k) => {
			return [k + '=' + encodeURIComponent(merged[k])];
		});

		oauth['oauth_signature'] = this.hmacsha1(
			`${encodeURIComponent(secret)}&`,
			`GET&${encodeURIComponent(url)}&${encodeURIComponent(mergedArr.join('&'))}`
		);
		return 'OAuth ' + Object.keys(oauth).map((k) => {
			return [k + '="' + oauth[k] + '"'];
		}).join(',');
	};

	load( location ) {
		return new Promise( ( resolve, reject ) => {
			const url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
			const query = {'location': location, 'format': 'json', 'u': this.units};
			const queryString = Object.keys(query).map((x) => {
				return x + '=' + query[x];
			}).join('&');

			fetch(url + '?' + queryString, {
				headers: {
					'Authorization': this.getAuthHeader(url, query, this.settings['provider-client-id'], this.settings['provider-key']),
					'X-Yahoo-App-Id': this.settings['provider-app-id'],
				},
			}).then((response) => {
				return response.json();
			}).then((response) => {
				if (typeof response.location.city === 'undefined') {
					return reject( 'No result returned' );
				}
				resolve({
					success: true,
					title: 'xxx',
					city: response.location.city,
					current: {
						temp: response.current_observation.condition.temperature,
						code: `wi-yahoo-${response.current_observation.condition.code}`,
					},
					forecast: response.forecasts.slice(1, 4).map((f) => ({
						code: `wi-yahoo-${f.code}`,
						date: f.date * 1000,
						high: f.high,
						low: f.low,
					})),
				});
			});

		} );
	}
}
