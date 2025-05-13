import Swiper from "swiper";
import { Navigation, Pagination, Parallax, Autoplay } from "swiper/modules";

// Configuración base que se puede extender
const baseConfig = {
  speed: 600,
  navigation: {
    nextEl: ".slide--button-next",
    prevEl: ".slide--button-prev",
  },
};

// Configuraciones específicas para cada slider
const sliderConfigs = {
  banner: {
    ...baseConfig,
    slidesPerView: "auto",
    spaceBetween: 20,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    modules: [Autoplay],
  },
};

// Función para inicializar los sliders
export function initializeSwiper() {
  const sliders = [
    {
      selector: ".carrousel__container",
      config: sliderConfigs.banner,
    },
  ];

  sliders.forEach(({ selector, config }) => {
    if (document.querySelector(selector)) {
      new Swiper(selector, config);
    }
  });
}
