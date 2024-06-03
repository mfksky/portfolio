// swiperSetup.js
import Swiper from 'swiper';
import { EffectFade, EffectCreative, Autoplay, Navigation, Pagination } from 'swiper/modules';
import '../../../node_modules/swiper/swiper.min.css';
import '../../../node_modules/swiper/modules/effect-fade.css';
import '../../../node_modules/swiper/modules/effect-creative.css';

Swiper.use([EffectFade, EffectCreative, Autoplay, Navigation, Pagination]);

export default Swiper;
export { EffectFade, EffectCreative, Autoplay, Navigation, Pagination };