// import custom stuff
import "./bsl";

// instant page
import "instant.page";

// import alpine stuff
import Alpine from "alpinejs";
import trap from "@alpinejs/trap";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";

Alpine.plugin(persist);
Alpine.plugin(trap);
Alpine.plugin(intersect);

window.Alpine = Alpine;
Alpine.start();
