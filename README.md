# typed-pocketbase

[![npm](https://img.shields.io/npm/v/typed-pocketbase)](https://www.npmjs.com/package/@tigawanna/typed-pocketbase)
![GitHub top language](https://img.shields.io/github/languages/top/tigawanna/typed-pocketbase)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/tigawanna/typed-pocketbase/main.yaml?branch=main)

Add types and **Zod runtime validation** to the [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk).

> [!WARNING] 
> This is a fork only compatible with the latest version of the PocketBase JavaScript SDK (v0.22) with PocketBase 0.23 RC
 
## ✨ Features

- 🎯 **TypeScript Types** - Full type safety for PocketBase collections
- 🛡️ **Zod Runtime Validation** - Validate data at runtime with Zod v4
- 🎨 **Pattern Filtering** - Control which collections to include/exclude
- 🔒 **Security** - Exclude sensitive collections from public APIs
- ⚡ **Performance** - Tree-shakable schemas and optimized validation
- 🛠️ **Custom Types** - JSON field types that won't be overwritten
- 📦 **Batch APIs** - Support for batch operations
- 🔐 **OTP & Impersonation** - Support for OTP and user impersonation APIs

## Installation

```bash
# npm
npm i @tigawanna/typed-pocketbase

# pnpm
pnpm i @tigawanna/typed-pocketbase

# yarn
yarn add @tigawanna/typed-pocketbase
```

## Quick Start

### 1. Generate Types & Schemas

```bash
# Generate both TypeScript types and Zod schemas
npx typed-pocketbase \
  --email admin@example.com \
  --password supersecret \
  --type ts,zod \
  --dir src/lib/pb

# Generate only Zod schemas
npx typed-pocketbase \
  --email admin@example.com \
  --password supersecret \
  --type zod \
  --dir src/lib/pb

# With pattern filtering (exclude system collections)
npx typed-pocketbase \
  --email admin@example.com \
  --password supersecret \
  --type zod \
  --ignore "^_.*" \
  --dir src/lib/pb
```

### 2. Use Generated Types & Schemas

```ts
import PocketBase from 'pocketbase';
import { TypedPocketBase } from '@tigawanna/typed-pocketbase';
import { Schema } from './pb/pb-types';
import { WatchlistCreateSchema, watchlistValidators } from './pb/pb-zod';

// Create typed client
const db = new TypedPocketBase<Schema>('http://localhost:8090');

// Runtime validation with Zod
const createData = WatchlistCreateSchema.parse({
  title: 'My Movies',
  user_id: 'user123',
  visibility: 'public'
});

// Safe validation with error handling
const result = watchlistValidators.safeCreate(formData);
if (result.success) {
  const record = await db.collection('watchlist').create(result.data);
} else {
  console.error('Validation errors:', result.error.issues);
}
```

## CLI Options

| Option       | Short | Description             | Default                 | Example                         |
| ------------ | ----- | ----------------------- | ----------------------- | ------------------------------- |
| `--url`      | `-u`  | PocketBase instance URL | `http://127.0.0.1:8090` | `--url http://localhost:8090`   |
| `--email`    | `-e`  | Admin email             | `$POCKETBASE_EMAIL`     | `--email admin@example.com`     |
| `--password` | `-p`  | Admin password          | `$POCKETBASE_PASSWORD`  | `--password admin123`           |
| `--dir`      | `-d`  | Output directory        | -                       | `--dir ./types`                 |
| `--type`     | `-t`  | Output type             | `ts`                    | `--type ts,zod`                 |
| `--ignore`   | -     | Ignore pattern (regex)  | -                       | `--ignore "^_.*"`               |
| `--include`  | -     | Include pattern (regex) | -                       | `--include "^(users\|posts).*"` |
| `--filter`   | `-f`  | Filter by collection    | -                       | `--filter users`                |

### Type Options
- `ts` - Generate TypeScript types only
- `zod` - Generate Zod schemas only  
- `ts,zod` - Generate both TypeScript types and Zod schemas

## Pattern Filtering

Control which collections get schemas generated using regex patterns:

> [!WARNING]
> **Collection Dependencies**: When using `--include` or `--ignore` patterns, ensure that excluded collections are not referenced by included collections through relations. If Collection A has a relation field pointing to Collection B, and you exclude Collection B while including Collection A, the type generation will fail because it cannot resolve the relation target. Always include all collections that are referenced by the collections you want to generate.

```bash
# Only user-facing collections
npx typed-pocketbase --include "^(users|posts|comments).*" --type zod --dir ./types

# Exclude system collections (default behavior)
npx typed-pocketbase --ignore "^_.*" --type zod --dir ./types

# Include all collections
npx typed-pocketbase --ignore "" --type zod --dir ./types

# Combine patterns: include all but exclude secrets
npx typed-pocketbase --include ".*" --ignore "^_secrets$" --type zod --dir ./types
```

## Zod Runtime Validation

### Generated Schemas

For each collection, the tool generates:

- **Response Schema** - `{Collection}ResponseSchema` for API responses
- **Create Schema** - `{Collection}CreateSchema` for create operations  
- **Update Schema** - `{Collection}UpdateSchema` for update operations
- **Validation Helpers** - `{collection}Validators` with safe parsing
- **TypeScript Types** - Inferred from Zod schemas

### Field Type Mappings

| PocketBase Type | Zod Schema                                                             | Notes                            |
| --------------- | ---------------------------------------------------------------------- | -------------------------------- |
| `text`          | `z.string()`                                                           | With min/max/pattern validation  |
| `email`         | `z.email()`                                                            | Email format validation (Zod v4) |
| `url`           | `z.url()`                                                              | URL format validation (Zod v4)   |
| `number`        | `z.number()`                                                           | With min/max validation          |
| `bool`          | `z.boolean()`                                                          | Boolean validation               |
| `date`          | `z.string()` / `z.union([z.string(), z.date()])`                       | Flexible date handling           |
| `select`        | `z.enum([...])`                                                        | Enum with allowed values         |
| `relation`      | `z.string()` / `z.array(z.string())`                                   | Single or multiple relations     |
| `file`          | `z.instanceof(File)` / `z.string()`                                    | File handling                    |
| `json`          | `z.union([z.record(z.string(), z.any()), z.array(z.any()), z.null()])` | Flexible JSON                    |

### Validation Examples

```ts
import { z } from 'zod';
import { PostCreateSchema, postValidators } from './pb/pb-zod';

// Basic validation (throws on error)
const validData = PostCreateSchema.parse({
  title: 'My Post',
  content: 'Hello world',
  published: true
});

// Safe validation with error handling
const result = postValidators.safeCreate(formData);
if (result.success) {
  console.log('Valid data:', result.data);
  // Create record with validated data
  const record = await db.collection('posts').create(result.data);
} else {
  console.error('Validation errors:');
  result.error.issues.forEach(issue => {
    console.log(`${issue.path.join('.')}: ${issue.message}`);
  });
}

// Custom validation extensions
const CustomPostSchema = PostCreateSchema.extend({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long')
}).refine(data => data.title !== 'forbidden', {
  message: 'This title is not allowed',
  path: ['title']
});
```

## TypedPocketBase Client

### Selecting Fields

```ts
const showId = Math.random() < 0.5;

db.from('posts').getFullList({
	select: {
		id: showId,
		title: true,
		content: true
	}
});
```

### Filtering Columns

Use the `and`, `or` and other utility functions to filter rows:

```ts
import { and, or, eq, gte, lt } from '@tigawanna/typed-pocketbase';

// Get all posts created in 2022
db.from('posts').getFullList({
	filter: and(['date', '<', '2023-01-01'], ['date', '>=', '2022-01-01'])
});

// Combine filters with helpers
db.from('posts').getFullList({
	filter: or(
		['date', '>=', '2023-01-01'],
		lt('date', '2022-01-01')
	)
});

// Filter for columns in relations (up to 6 levels deep)
db.from('posts').getFullList({
	filter: eq('owner.name', 'me')
});
```

### Sorting Rows

```ts
db.from('posts').getFullList({
	// Sort by descending 'date'
	sort: '-date'
});

db.from('posts').getFullList({
	// Sort by multiple fields
	sort: ['-date', '+title']
});
```

### Expanding Relations

> [!NOTE] 
> Switched the indirect expand syntax from `comments(posts)` → `comments_via_post` 

```ts
db.from('posts').getFullList({
	select: {
		expand: {
			user: true,
			comments_via_post: true
		}
	}
});

// Select nested columns
db.from('posts').getFullList({
	select: {
		expand: {
			user: {
				name: true,
				avatar: true
			}
		}
	}
});

// Nested expand
db.from('posts').getFullList({
	select: {
		expand: {
			user: {
				expand: {
					profile: true
				}
			}
		}
	}
});
```

### Batch APIs

```ts
const batch = db.fromBatch();
batch.from("users").create({...});
batch.from("users").upsert({...});
await batch.send();
```

### Impersonate Client

```ts
const impersonateClient = await db.impersonate("_superusers", "user_id_being_impersonated", 20);
impersonateClient.from("posts").create({...});
impersonateClient.from("posts").update({...});
```

## Helper Methods

### createSelect

```ts
const select = db.from('posts').createSelect({
	id: true,
	content: true,
	owner: true,
	expand: {
		owner: {
			username: true,
			email: true
		}
	}
});
```

### createFilter

```ts
const filter = db
	.from('posts')
	.createFilter(or(eq('content', 'bla'), eq('published', true)));
```

### createSort

```ts
const sort = db.from('posts').createSort('+id', '-date');
```

## Environment Variables

Set environment variables to avoid passing credentials in commands:

```bash
export POCKETBASE_EMAIL=admin@example.com
export POCKETBASE_PASSWORD=admin123

# Now you can run without --email and --password
npx typed-pocketbase --url http://localhost:8090 --type zod --dir ./types
```

## Best Practices

1. **Always validate external data** - API responses, user input, etc.
2. **Use safe parsing** for user-facing operations to handle errors gracefully
3. **Validate at boundaries** - When data enters/exits your application
4. **Regenerate schemas** when your PocketBase collections change
5. **Use pattern filtering** for different environments (dev vs prod)

## Programmatic API

```ts
import { generateTypes } from '@tigawanna/typed-pocketbase/codegen';

const result = await generateTypes({
  url: 'http://127.0.0.1:8090',
  email: 'admin@example.com',
  password: 'admin-password',
  ignorePattern: '^_.*',
  includePattern: '^(users|posts).*'
});

// Write generated files
await fs.writeFile('pb-types.ts', result.types);
await fs.writeFile('pb-zod.ts', result.zodSchemas);
```

## License

[MIT](https://github.com/david-plugge/typed-pocketbase/blob/main/LICENSE)
