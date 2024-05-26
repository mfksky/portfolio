// swiperSetup.js
import Swiper from 'swiper';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import '../../../node_modules/swiper/swiper.min.css';
import '../../../node_modules/swiper/modules/effect-fade.css';

Swiper.use([EffectFade, Autoplay, Navigation, Pagination]);

export default Swiper;
export { EffectFade, Autoplay, Navigation, Pagination };