import { resolveSelect } from "./select.js";

resolveSelect({
    name:true,
    expand: {
        "comments(post)": true
        
    }
})
