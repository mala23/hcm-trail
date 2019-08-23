import * as ImagePreload from './modules/imagePreload';
import * as WeatherWidget from './modules/weatherWidget';
import * as ScrollHint from './modules/scrollHint';
import * as NavbarToggleButton from './modules/navbarToggleButton';
import * as Search from './modules/search';
import * as MapWidget from './modules/mapWidget';
import * as InstagramWidget from './modules/instagramWidget';
import * as Dropdown from './modules/dropdown';
import * as ResponsiveVideo from './modules/responsiveVideo';
import * as Gallery from './modules/gallery';

ImagePreload.init();
WeatherWidget.init();
ScrollHint.init();
NavbarToggleButton.init();
Search.init();
MapWidget.init();
InstagramWidget.init();
Dropdown.init();
ResponsiveVideo.init();
Gallery.init();

/**
 * Workaround for vh100 bug
 */

const header = document.getElementById('header');
if (!header.classList.contains('header-hidden') && !header.classList.contains('header-naked')) {
    header.style.height = window.innerHeight + 'px';
    header.classList.remove('header-vh100');
}
