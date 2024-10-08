// import { DEFAULT_CUSTOM_DB_TYPES_PATH, DEFAULT_PB_FILES_DIR } from "./utils";

function givenIndexFindInterface(index: number, types_array: string[]) {
  if (types_array[index].includes("interface")) return index;
  if (types_array.length <= 0) {
    return -1;
  }
  return givenIndexFindInterface(index - 1, types_array);
}

function customTypesStringgTemplate(interface_name: string, field: string) {
  const capitalized_field = field.charAt(0).toUpperCase() + field.slice(1);
  return `// === start of custom type ===
  // ${interface_name}.${interface_name}${capitalized_field}.${field}
  export type ${interface_name}${capitalized_field} = Array<{
 
  }>;
  // === end of custom type ===\n\n`;
}

/**
 * Adds points for custom types.
 * if not sustom types are definde default types will be added for any json fields
 * This function takes a string of generated types, and adds custom types to the interfaces
 * that are named Create, Update, or Response.
 * The generated types should be a string of the interfaces, with each interface on a new line.
 * The function will add a new line of code for each custom type, with the format:
 * @example
 * // === start of custom type ===
 * // ${interface_name}.${interface_name}${capitalized_field}.${field}
 * export type ${interface_name}${capitalized_field} = Array<{
 *
 * }>;
 * // === end of custom type ===
 * @param generated_types The string of generated types.
 * @returns An object with the extracted custom types as a string, and an array of custom types.
 */
export function addPointsForCustomTypes(generated_types: string) {
  const gen_types_array = generated_types.split("\n");
  const extracted_custom_db_types_array: Array<{
    target_interface: string;
    field: string;
    new_custom_type: string;
  }> = [];
  const gen_types_set = new Set<string>();
  const custom_types = gen_types_array.map((gen_types, gen_types_idx) => {
    if (gen_types.includes("Record<string, any> | Array<any>")) {
      const gen_type_value = gen_types
        .split("Record<string, any> | Array<any>")[0]
        .replace("?", "")
        .replace(":", "")
        .trim();
      const interface_name_idx = givenIndexFindInterface(gen_types_idx, gen_types_array);
      const interface_name_line = gen_types_array[interface_name_idx].split("interface")[1].trim();

      if (interface_name_line.includes("Create")) {
        const new_interface_name = interface_name_line.split("Create")[0];
        if (gen_types_set.has(new_interface_name)) return;
        gen_types_set.add(new_interface_name);
        const capitalized_field = gen_type_value.charAt(0).toUpperCase() + gen_type_value.slice(1);

        extracted_custom_db_types_array.push({
          target_interface: `${new_interface_name}Create`,
          field: `${gen_type_value}`,
          new_custom_type: `${new_interface_name}${capitalized_field}`,
        });

        return customTypesStringgTemplate(new_interface_name, gen_type_value);
      }
      if (interface_name_line.includes("Update")) {
        const new_interface_name = interface_name_line.split("Update")[0];
        if (gen_types_set.has(new_interface_name)) return;
        gen_types_set.add(new_interface_name);
        const capitalized_field = gen_type_value.charAt(0).toUpperCase() + gen_type_value.slice(1);
        extracted_custom_db_types_array.push({
          target_interface: `${new_interface_name}Update`,
          field: `${gen_type_value}`,
          new_custom_type: `${new_interface_name}${capitalized_field}`,
        });

        return customTypesStringgTemplate(new_interface_name, gen_type_value);
      }
      if (interface_name_line.includes("Response")) {
        const new_interface_name = interface_name_line.split("Response")[0];
        if (gen_types_set.has(new_interface_name)) return;
        gen_types_set.add(new_interface_name);
        const capitalized_field = gen_type_value.charAt(0).toUpperCase() + gen_type_value.slice(1);
        extracted_custom_db_types_array.push({
          target_interface: `${new_interface_name}Response`,
          field: `${gen_type_value}`,
          new_custom_type: `${new_interface_name}${capitalized_field}`,
        });
        return customTypesStringgTemplate(new_interface_name, gen_type_value);
      }
    }
  });

  // console.log("= custom_types ", custom_types.filter(Boolean).join("\n"));
  const extracted_custom_db_types = custom_types.filter(Boolean).join("\n");
  return {
    extracted_custom_db_types,
    extracted_custom_db_types_array,
  };
}

export function getCustomTypes(generated_types: string, custom_db_types_string: string) {
  try {
    if (!custom_db_types_string || custom_db_types_string.trim().length <= 0) {
      const { extracted_custom_db_types, extracted_custom_db_types_array } =
        addPointsForCustomTypes(generated_types);
      return {
        extracted_custom_db_types,
        extracted_custom_db_types_array,
      };
    }

    let extracted_custom_db_types = "";
    const extracted_custom_db_types_array: {
      target_interface: string;
      field: string;
      new_custom_type: string;
    }[] = [];
    const custom_db_types_lines = custom_db_types_string.split("\n");
    //   const custom_type_start = custom_db_types_lines.findIndex((line) =>line.includes("custom_db_types"));
    const extracted_types_set = new Set();
    for (const [index, line] of custom_db_types_lines.entries()) {
      // console.log("= line ",line);
      if (line.includes("=== start of custom type ===")) {
        const custom_block_hint = custom_db_types_lines[index + 1].trim().split(".");
        const sub_custom_db_types_lines = custom_db_types_lines.slice(index);
        // find the end of custom type
        const custom_block_end = sub_custom_db_types_lines.findIndex((line) =>
          line.includes("=== end of custom type ===")
        );

        const interface_name = sub_custom_db_types_lines[2];
        // if the interface is already extracted, skip
        if (extracted_types_set.has(interface_name)) {
          continue;
        } else {
          // extract the custom types
          extracted_custom_db_types += `${sub_custom_db_types_lines
            .slice(0, custom_block_end + 1)
            .join("\n")}\n`;
          // mark the interface as extracted
          extracted_types_set.add(interface_name);
        }
        // adding hints to which types our custom type shiuld replace
        const target_interface_prefix = custom_block_hint[0].replace("//", "").trim();
        extracted_custom_db_types_array.push({
          target_interface: `${target_interface_prefix}Create`,
          field: `${custom_block_hint[2]}`,
          new_custom_type: custom_block_hint[1],
        });
        extracted_custom_db_types_array.push({
          target_interface: `${target_interface_prefix}Update`,
          field: `${custom_block_hint[2]}`,
          new_custom_type: custom_block_hint[1],
        });
        extracted_custom_db_types_array.push({
          target_interface: `${target_interface_prefix}Response`,
          field: `${custom_block_hint[2]}`,
          new_custom_type: custom_block_hint[1],
        });
      }
    }
    // if there are no extracted types , add the defalut custom types (for JSON fields)
    if (!extracted_types_set.size) {
      const { extracted_custom_db_types, extracted_custom_db_types_array } =
        addPointsForCustomTypes(generated_types);
      return {
        extracted_custom_db_types,
        extracted_custom_db_types_array,
      };
    }

    return {
      extracted_custom_db_types,
      extracted_custom_db_types_array,
    };
  } catch (error: any) {
    // if the custom types file is not found , createa a new one with defaults
    if (error.code === "ENOENT") {
      const { extracted_custom_db_types, extracted_custom_db_types_array } =
        addPointsForCustomTypes(generated_types);
      return {
        extracted_custom_db_types,
        extracted_custom_db_types_array,
      };
    } else {
      throw error;
    }
  }
}
interface IModifyAndInjectCustomSTypes {
  content: string;
  extracted_custom_db_types: string;
  extracted_custom_db_types_array: {
    target_interface: string;
    field: string;
    new_custom_type: string;
  }[];
}

export function modifyAndInjectCustomSTypes({
  content,
  extracted_custom_db_types,
  extracted_custom_db_types_array,
}: IModifyAndInjectCustomSTypes) {
  const content_array = content.split("\n");
  for (const [
    _,
    { target_interface, field, new_custom_type },
  ] of extracted_custom_db_types_array.entries()) {
    for (const [index, target] of content_array.entries()) {
      if (target.includes(target_interface)) {
        const target_index = content_array.findIndex((line, idx) => {
          return line.includes(field) && idx > index;
        });

        if (target_index && target_index > 0) {
          content_array.splice(target_index, 1, `\t${field}?: ${new_custom_type}`);
        }
      }
    }
  }
  const new_content_string = `${extracted_custom_db_types}\n${content_array.join("\n")}`;
  // console.log(" === content after  ==== ",new_content_string)
  return new_content_string;
}
