// filter by typed pocektbase by the provided collection
export async function filterByCollection(schema_string: string, collection = "") {
  // console.log("filtering by collection: ", collection);
  // if (!collection) {
  //   throw new Error("Please provide a collection name");
  // }
  try {
    let text_output = "";
    let currentBlock: string | null = null;
    let first_block_index = 0;
    let current_block_indexes = [0, 0];
    const all_block_indexes: { [key: string]: number[] } = {};

    // const file_string = await readFile(TYPES_OUTPUT_PATH, "utf-8");
    // const file_string = await getPBType();
    const lines = schema_string.split("\n");
    for (const [index, line] of lines.entries()) {
      if (currentBlock) {
        // mark the end current block if at the end of the file
        if (lines.length - 1 === index) {
          current_block_indexes[1] = index;
          all_block_indexes[currentBlock] = [...current_block_indexes];
        }
      }
      if (line.startsWith("// ===== ")) {
        const current_block_name = line.split("=====")[1].trim();
        // currentBlck is not null after the first // ===== encount eredor a new block
        if (currentBlock) {
          // current block is not the same as the current block name
          if (currentBlock !== current_block_name) {
            // mark where the currennt block index ends at
            current_block_indexes[1] = index;
            // save the current block index to the all_block_indexes
            all_block_indexes[currentBlock] = [...current_block_indexes];
          }
          //   nullify the current block name to start the new one
          currentBlock = null;
        }
        // current block is null after the first // ===== encount eredor a new block
        if (!currentBlock) {
          // mark where the first // ===== block index is encountered ,this will be used to determine where the glbal/shared types end
          if (Object.entries(all_block_indexes).length === 0) {
            first_block_index = index;
          }
          // mark where the currennt block index starts at
          current_block_indexes[0] = index;
          //   set the current block name
          currentBlock = current_block_name;
        }
      }
    }
    //  add init types ( shared pocketbase types )
    const init_types = lines.slice(0, first_block_index);
    const collections_to_include = [collection];
    const all_block_indexes_array = Object.entries(all_block_indexes);
    const targetCollectionsIndexes = all_block_indexes_array.filter((el) => {
      return el[0].includes(collection);
    });

    // console.log({ targetCollectionsIndexes });
    targetCollectionsIndexes.flatMap((coll) => {
      const relationType = lines.slice(coll[1][0], coll[1][1]).join("\n");
      //  isolate any relations:{}
      const regex = /relations:\s*{\s*([^}]+)\s*}/;
      const match = regex.exec(relationType);

      if (match) {
        const relationFields = match[1].split(",").map((field) => field.trim());
        const fieldNames = relationFields.flatMap((field) => {
          const fieldName = field.split(";").map(
            (part) => part.split(":")[0].replace("\t\t", "").replace("\t", "").replace("\n", "")
            // .split("_")[0]
          );
          return fieldName;
        });

        collections_to_include.push(...fieldNames);
      }
      return coll[1];
    });

    text_output = init_types.join("\n");
    // console.log({ collections_to_include, all_block_indexes_array });
    //  Main types section
    for (const [key, value] of all_block_indexes_array) {
      // const collection_in_included_list = collections_to_include.filter((el) => {
      //   console.log({ el,key,value });
      //   return el.includes(key);
      // });

      // console.log({ key,value });
      // filter only for specified collection
      const collection_in_included_list = collections_to_include.filter((el) => {
        return key.includes(el);
      });

      if (collection_in_included_list.length === 0) {
        // console.log("Skipping: ", collections_to_include, key);
        continue;
      }
      // if (!key.includes(collection)) continue;
      const selected_lines = lines.slice(value[0], value[1]);
      selected_lines.splice(0, 1, `// ==== start of ${key} block =====\n`);
      selected_lines.push(`// ==== end of ${key} block =====\n`);
      const data = selected_lines.join("\n");
      text_output += `${data}\n`;
    }
    //  add the final schema block
    const schema_block = all_block_indexes.Schema;

    // filter only for specified collection
    if (schema_block) {
      const schema_lines = lines.slice(schema_block[0], schema_block[1]);

      // final schema looks like this
      // export type Schema = {
      //   _mfas: MfasCollection;
      //   _otps: OtpsCollection;
      //   _externalAuths: ExternalAuthsCollection;
      //   _authOrigins: AuthOriginsCollection;
      //   _superusers: SuperusersCollection;
      //   users: UsersCollection;
      //   posts: PostsCollection;
      //   comments: CommentsCollection;
      // };

      const filtered_schema_lines = [];

      for (const line of schema_lines) {
        const collection_in_included_list = collections_to_include
          .filter((el) => {
            return line.includes(el);
          })
          .filter((el) => {
            return el.length > 0;
          });
        if (collection_in_included_list.length > 0 || !collection || collection==="") {
          filtered_schema_lines.push(line);
        } else if (line.includes("{") || line.includes("}")) {
          filtered_schema_lines.push(line);
        }
         
      }
      if(!filtered_schema_lines[filtered_schema_lines.length - 1].includes("}") ){
        filtered_schema_lines.push("}");
      }
      // initla parsing adds a schema block at the end of the file that will be duplicated if not removed
      const text_output_without_init_schema_block = text_output.split(
        "// ==== start of Schema block ====="
      )[0];
      text_output = text_output_without_init_schema_block + "\n" + filtered_schema_lines.join("\n");
      // console.log(" === text_output after === ",text_output.slice(text_output.length - 1000))
      // console.log({ filtered_schema_lines });
    }

    return { text_output, all_block_indexes, first_block_index };
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error;
  }
}
