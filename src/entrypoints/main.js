// Import custom stuff
import "../ts/bsl";

// Import instant page
import "instant.page";

// Import Alpine stuff
import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";

// Register Alpine plugins
Alpine.plugin(persist);
Alpine.plugin(focus);
Alpine.plugin(intersect);

// Assign Alpine to the window object and start it
window.Alpine = Alpine;
Alpine.start();