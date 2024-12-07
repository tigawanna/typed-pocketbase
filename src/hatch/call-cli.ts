import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import { generateTypes } from "../codegen/index.js";
import { filterByCollection } from "../codegen/modiiers/filter-collections.js";
import { modifyAndInjectCustomSTypes } from "../codegen/modiiers/custom-type-generation.js";

export async function callCliDirectly() {
  const url = process.env.VITE_PB_URL;
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  if (!url || !email || !password) {
    throw new Error(
      "Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD",
    );
  }
  return generateTypes({ email, password, url });
}

callCliDirectly()
  .then((res) => {
    // console.log("types  ====> ", res.slice(2600));
    filterByCollection(
      res,
      "",
	).then((res) => {
		console.log("\n\n== filtered types == ",res.text_output.split("// ===== Schema =====")[1])
		// const finaltypes = modifyAndInjectCustomSTypes({
		// 	content: res.text_output,
		// 	extracted_custom_db_types:"",
		// 	extracted_custom_db_types_array:[]
		// })
		// console.log(" ====>", finaltypes.split("// ===== Schema =====")[1])
	})
  });
