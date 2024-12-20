# typed-pocketbase

[![npm](https://img.shields.io/npm/v/typed-pocketbase)](https://www.npmjs.com/package/@tigawanna/typed-pocketbase)
![GitHub top language](https://img.shields.io/github/languages/top/tigawanna/typed-pocketbase)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/tigawanna/typed-pocketbase/main.yaml?branch=main)

Add types to the [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk).

> [!WARNING] 
> This is a fork only compatible with the latest version of the PocketBase JavaScript SDK (v0.22) with the pocketbase 0,23 rc
 
> [!NOTE] 
> Extra features include 
> - filtering collections to generate types for woth the -f flag
> - custom types (especially for JSON fields) that won't be over written on new type generation
> - supprot from the otp APIs
> - support ro the batch APIs 



## Installation

```bash
# npm
npm i @tigawanna/typed-pocketbase

# pnpm
pnpm i @tigawanna/typed-pocketbase

# yarn
yarn add @tigawanna/typed-pocketbase
```

## Usage

> [!WARNING]
> the -o flag was removed in favour of the -d flag that lets you specify where the main (`pb-types.ts`) and custom types (`custom-types.ts`) will go

Generate the types:

```bash
npx typed-pocketbase --email admin@mail.com --password supersecretpassword -d src/lib/pb -f auth,posts
```

The codegen tool will look for `POCKETBASE_EMAIL` and `POCKETBASE_PASSWORD` environment variables if the email or password are not passed using cli options.

Create a PocketBase client:

```ts
import PocketBase from 'pocketbase';
import { TypedPocketBase } from '@tigawanna/typed-pocketbase';
import { Schema } from './Database';

const db = new TypedPocketBase<Schema>('http://localhost:8090');
```

Enjoy full type-safety:

```ts
import { neq } from '@tigawanna/typed-pocketbase';

db.from('posts').getFullList({
	select: {
		id: true,
		title: true,
		content: true,
		expand: {
			owner: {
				username: true
			}
		}
	}
	sort: '-date',
	filter: neq('content', '')
});
```

## Selecting fields

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

## Filtering columns

Use the `and`, `or` and other utility functions to filter rows:

```ts
import { and, or, eq, gte, lt } from '@tigawanna/typed-pocketbase';

// get all posts created in 2022
db.from('posts').getFullList({
	// a "manual" filter is a tuple of length 3
	filter: and(['date', '<', '2023-01-01'], ['data', '>=', '2022-01-01'])
});

// get all posts expect for those created in 2022
db.from('posts').getFullList({
	filter: or(['date', '>=', '2023-01-01'], ['data', '<', '2022-01-01'])
});

// get all posts that were create at '2023-01-01'
db.from('posts').getFullList({ filter: eq('date', '2023-01-01') });

// combine or/and with helpers and manual filters
db.from('posts').getFullList({
	filter: or(
		//
		['date', '>=', '2023-01-01'],
		lt('date', '2022-01-01')
	)
});

// conditionally filter rows
// falsy values are excluded
db.from('posts').getFullList({
	filter: and(
		//
		gte('date', '2022-01-01'),
		!untilNow && lt('date', '2023-01-01')
	)
});

// filter for columns in relations
// works up to 6 levels deep, including the top level
db.from('posts').getFullList({
	filter: eq('owner.name', 'me')
});
```

Most filter operators are available as short hand function.

Visit the [pocketbase documentation](https://pocketbase.io/docs/api-records/) to find out about all filters in the `List/Search records` section.

## Sorting rows

```ts
db.from('posts').getFullList({
	// sort by descending 'date'
	sort: '-date'
});

db.from('posts').getFullList({
	// sort by descending 'date' and ascending 'title'
	sort: ['-date', '+title']
});

// conditionally sort rows
// falsy values are excluded
db.from('posts').getFullList({
	sort: ['-date', sortTitle && '+title']
});
```

## Expanding

> [!NOTE] 
> Switeched the indirect expand synta from `comments(posts)` -> `comments_via_post` 

In `@tigawanna/typed-pocketbase` expanding happens automatically when using select.

```ts
db.from('posts').getFullList({
	select: {
		expand: {
			user: true,
			comments_via_post: true
		}
	}
});

// select nested columns
db.from('posts').getFullList({
	select: {
		expand: {
			user: {
				name: true
				avatar: true
			}
		}
	}
});

// nested expand
db.from('posts').getFullList({
	select:{
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

[Back relation expanding](https://pocketbase.io/docs/working-with-relations/#back-relation-expand) is support aswell:

```ts
db.from('user').getFullList({
	select: {
		expand: {
			'posts(user)': {
				title: true,
				created: true
			}
		}
	}
});
```

### batch APIs
```ts
    const batch = db.fromBatch()
      batch.from("users").create({...});
      batch.from("users").upsert({...});
      await batch.send();
```

### impersonate client
```ts
    const impersinateClient = await db.impersonate("_superusers","user_id_being_impersonated",20);
    impersinateClient.from("posts").create({...});
    impersinateClient.from("posts").update({...});
```

## Helper methods:

### createSelect

```ts
const select = db.from('posts').createSelect({
	id: true,
	content: true,
	owner: true,
	collectionName: true,
	asd: true,
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

## License

[MIT](https://github.com/david-plugge/typed-pocketbase/blob/main/LICENSE)
